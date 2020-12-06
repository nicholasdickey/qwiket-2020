import Immutable from "immutable";
import {
    fetchPageData,
    setSession,
    fetchTag,
    fetchMetatag,
} from "../actions/app";
import { fetchQwiket, fetchShowQwiket } from "../actions/context";
import { fetchQueue } from "../actions/queue";
import Root from "window-or-global";
import Bowser from "bowser";
import chalk from "chalk";
import { isImmutable } from "immutable";
function ssrParams(req) {
    if (!req) return false;
    const cookies = req.cookies;

    let identity = cookies["identity"];
    if (!identity) {
        identity = cookies["qid"] || "";
    }
    let anon_identity = cookies["anon"] || "";
    var xFF = req.headers["x-forwarded-for"];
    var ua = encodeURIComponent(req.headers["user-agent"] || "");
    var ip = xFF ? xFF.split(",")[0] : req.connection.remoteAddress || "";
    //console.log("IP: ", { ip, xFF, rip: req.connection.remoteAddress, identity, hostname: req.hostname, reqip: req.ip })
    var w = ip.split(":");
    ip = w ? w[w.length - 1] : ip;
    let ssrParams = {};
    ssrParams.host = req.headers.host;
    ssrParams.xip = ip;
    ssrParams.ua = encodeURIComponent(ua);
    ssrParams.pxid = identity;
    ssrParams.anon = anon_identity;
    //console.log("ssrParams:", { ssrParams })
    return ssrParams;
}
function setCookie(req, cookie) {
    const maxAge = 24 * 3600 * 30 * 1000 * 100;
    const entries = Object.entries(cookie);
    for (const [key, value] of entries) {
        req.res.cookie(key, value, { maxAge, sameSite: "Lax" });
        console.log(`Setting up a cookie ${key} = ${value}`);
    }
}

async function fetchApp({
    req,
    store,
    channel,
    q,
    solo,
    code,
    appid,
    utm_source,
    utm_medium,
}) {
    if (!utm_source) utm_source = "";
    if (!utm_medium) utm_medium = "";
    if (store) {
        console.log("server fetchApp");
        await store.dispatch(
            fetchPageData({
                ssrType: "channel",
                channel,
                ssrQid: q,
                code,
                appid,
                utm_source,
                utm_medium,
                ssrParams: req ? ssrParams(req) : "",
            })
        );
        if (req && store.getState().app.get("cookie"))
            await setCookie(req, store.getState().app.get("cookie").toJS());
    } else {
        console.log("client fetchApp");
        fetchPageData({
            ssrType: "channel",
            channel,
            ssrQid: q,
            code,
            ssrParams: ssrParams(req),
        });
    }
    //  console.log("fetchApp AFTER DISPATCH>>>>>>>>>>>>>>", store.getState().app.get("cookie").toJS());
}
function initSession(req) {
    let session = req.session;
    let ua = req.headers["user-agent"];
    console.log({ ua });
    const bowser = Bowser.getParser(
        ua
            ? ua
            : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
    );

    const platformType = bowser.getPlatformType();
    console.log(chalk.green.bold("PLATFORM:", platformType));
    let defaultWidth = 600;
    if (platformType == "tablet") defaultWidth = 900;
    else if (platformType == "desktop") defaultWidth = 1200;

    if (!session || !session.options) {
        // l(chalk.red("updSessionParam: no session"));

        session = {
            init: 1,
            theme: 1,
            twitter: 1,
            activeTopics: 1,
            cover: 0,
            zoom: "out",
            thick: 0,
            dense: 0,
            loud: 0,
            width: defaultWidth,
            userLayout: {},
            layoutNumber: "l1",
            platformType,
            defaultWidth,
        };
        return session;
    } else {
        let options = session.options;
        options.platformType = platformType;
        options.defaultWidth = defaultWidth;
        return options;
    }
}

async function dispatchSession({ req, store }) {
    await store.dispatch(setSession({ session: initSession(req) }));
    //  console.log("fetchApp AFTER dispatchSession>>>>>>>>>>>>>>", store.getState().app.get("cookie").toJS(), store.getState().session.toJS());
}

async function fetchColumns({ columns, app, store, query, req, force }) {
    let startTime = Date.now();
    let channel = app.get("channel").get("channel");

    let homeChannel = app.get("channel").get("homeChannel");
    let shortname = query.shortname || query.tag;
    // if (Root.store)
    //     store = Root.store;
    let state = store.getState();

    let queues = state.queues; //cache.get('queues');
    let qwikets = state.cache.get("qwikets");
    let tags = state.app.get("tags") || Immutable.fromJS({});
    let context = state.context;
    let session = state.session;
    let promises = [];

    let hot = +session.get("cover");
    console.log("FETCH: HOT=", hot);
    if (hot) {
        console.log("pushing the promis for hot");
        promises.push(
            store.dispatch(
                fetchQueue({
                    type: "hot",
                    tag: "hot",
                    channel,
                    homeChannel,
                    size: 9,
                })
            )
        );
    }
    //  let context = state.context;
    console.log("fetchColumns", { force, query, columns });
    let hasTopic = false;
    if (columns)
        for (var i = 0; i < columns.length; i++) {
            let col = columns[i];
            //columns.forEach(async col => {
            console.log(chalk.magenta.bold("COL:"), col.selector, {
                col,
                query,
            });
            if (col.selector == "twitter") continue;
            switch (col.selector) {
                case "topic":
                    hasTopic = true;
                    if (shortname) {
                        if (!tags.get(shortname) || force) {
                            promises.push(
                                store.dispatch(fetchTag({ tag: shortname }))
                            );
                            console.log("FETCHED TAG", {
                                tag: shortname,
                                tags: app.get("tags"),
                                shortname,
                                queues: queues.toJS(),
                            });
                        } else {
                            // promises.push(store.dispatch(fetchTag({ tag: shortname, meta: tags.get(shortname) })));
                        }
                        if (!queues.get(shortname) || force) {
                            console.log("NO PREFETCHED", { shortname });
                            promises.push(
                                store.dispatch(
                                    fetchQueue({
                                        tag: shortname,
                                        channel,
                                        homeChannel,
                                        solo: 0,
                                        shortname,
                                        lastid: 0,
                                        page: 0,
                                        type: "feed",
                                        tail: "",
                                    })
                                )
                            );
                        } else {
                            console.log("PREFETCHED", { shortname });
                            /* promises.push(store.dispatch(fetchQueue({
                                 tag: shortname,
                                 items: queues.get(shortname).get('items'),
                                 channel,
                                 homeChannel,
                                 solo: 0,
                                 shortname,
                                 lastid: 0,
                                 page: 0,
                                 type: 'feed',
                                 tail: ''
     
                             }))) */
                        }
                    }
                    let qwiketid = query.hub
                        ? `${query.hub}-slug-${query.threadid}`
                        : query.threadid;
                    if (qwikets.get(qwiketid)) {
                        let qwiket = qwikets.get(qwiketid);
                        promises.push(
                            store.dispatch(
                                fetchQwiket({
                                    qwiket,
                                    channel,
                                    qwiketid,
                                    ssrParams: ssrParams(req),
                                })
                            )
                        );
                    } else {
                        promises.push(
                            store.dispatch(
                                fetchQwiket({
                                    channel,
                                    qwiketid,
                                    ssrParams: ssrParams(req),
                                })
                            )
                        );
                    }
                    //   console.log("after fetching topic")

                    //  console.log("after fetching topic")
                    break;

                case "newsviews":
                case "reacts":
                case "stickies":
                case "topics":
                default:
                    if (
                        queues.get(col.selector) &&
                        !force &&
                        !(col.selector == "newsline") &&
                        !(col.selector == "newsgrid")
                    ) {
                        console.log("skip queue fetch, already loaded");
                        continue;
                    }

                    console.log(`fetching ${col.selector}`, {
                        channel,
                        time: Date.now() - startTime,
                    });
                    //await store.dispatch(fetchQwiket({ channel, qwiketid: query.qwiketid, ssrParams: ssrParams(req) }));
                    promises.push(
                        store.dispatch(
                            fetchQueue({
                                tag:
                                    col.selector == "newsgrid"
                                        ? "newsline"
                                        : col.selector,
                                channel,
                                homeChannel,
                                solo:
                                    col.selector == "newsline" &&
                                    query.soloShortname
                                        ? 1
                                        : 0,
                                shortname:
                                    col.selector == "newsline" &&
                                    query.soloShortname
                                        ? query.soloShortname
                                        : "",
                                lastid: 0,
                                page: 0,
                                type:
                                    col.selector == "newsviews"
                                        ? "mix"
                                        : col.selector == "newsgrid"
                                        ? "newsline"
                                        : col.selector,
                                tail: "",
                                ssrParams: ssrParams(req),
                            })
                        )
                    );
                    console.log(`after fetching ${col.selector}`, {
                        time: Date.now() - startTime,
                    });
                    if (query.route && query.route.indexOf("show") >= 0) {
                        let qType =
                            col.selector == "newsviews" ||
                            col.selector == "reacts"
                                ? "mix"
                                : "topics";
                        let qwiketid = query.qwiketid;
                        // console.log("QSHOw", qwiketid);
                        if (qwiketid) {
                            promises.push(
                                store.dispatch(
                                    fetchShowQwiket({
                                        channel,
                                        qwiketid,
                                        qType,
                                        ssrParams: ssrParams(req),
                                    })
                                )
                            );
                        }
                    }
                    if (col.selector == "newsline") {
                        console.log("NEWSLINE", col.msc);
                        if (col.msc == "navigator") {
                            let channelDetails = app
                                .get("channel")
                                .get("channelDetails");
                            let config = channelDetails.get("config");
                            let cpath = config.get("cpath");
                            let cme = config.get("cme");
                            //  let cme = channelDetails.get("cme");

                            console.log("!!!!>>>>>", { cpath, cme });

                            //console.log({ config })
                            let defaultDefinedTag = config.get(
                                "defaultDefinedTag"
                            )
                                ? config
                                      .get("definedTags")
                                      .get(config.get("defaultDefinedTag"))
                                      .get("tag")
                                : null;
                            let metatag =
                                session.get("navigatorTag") ||
                                defaultDefinedTag;
                            console.log("FETCHING METATAG:", {
                                metatag,
                                cpath,
                                cme,
                                channel,
                            });
                            /* await store.dispatch(fetchMetatag({
                                 channel,
                                 cpath,
                                 cme,
                                 metatag
 
                             }));*/
                            /*  promises.push(store.dispatch(fetchMetatag({
                                channel,
                                cpath,
                                cme,
                                metatag,
                                ssrParams: ssrParams(req)

                            })
                            ));*/
                            console.log("222");
                        } else {
                            console.log(
                                chalk.magenta.bold(
                                    "SECONDARY MSC SSR FETCH",
                                    JSON.stringify(col)
                                )
                            );
                            if (!(queues.get(col.msc) && !force)) {
                                console.log(`secondary fetching ${col.msc}`, {
                                    channel,
                                    time: Date.now() - startTime,
                                });
                                //await store.dispatch(fetchQwiket({ channel, qwiketid: query.qwiketid, ssrParams: ssrParams(req) }));
                                promises.push(
                                    store.dispatch(
                                        fetchQueue({
                                            tag: col.msc,
                                            channel,
                                            homeChannel,

                                            lastid: 0,
                                            page: 0,
                                            type: col.msc,
                                            tail: "",
                                            ssrParams: ssrParams(req),
                                        })
                                    )
                                );
                            }
                        }
                    }

                    break;
            }
        }
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!! BEFORE PROMISE ALL", { query, selector: col.selector, shortname })
    if (req) await Promise.all(promises);
    else await Promise.all(promises);

    if (hasTopic && !shortname) {
        console.log("topic, no tag");
        let context = store.getState().context;
        //  console.log("context:", context.toJS());
        shortname = context.get("topic").get("tags").get(0);
        //  console.log("got shortname from topic:", shortname)
        if (!app.get("tags") || !app.get("tags").get(shortname))
            await store.dispatch(fetchTag({ tag: shortname }));
        //   console.log("FETCHED TAG", { tag: shortname, tags: app.get("tags") })
        if (!queues.get(shortname))
            await store.dispatch(
                fetchQueue({
                    tag: "feed",
                    channel,
                    homeChannel,
                    solo: 0,
                    shortname,
                    lastid: 0,
                    page: 0,
                    type: "feed",
                    tail: "",
                })
            );
        else {
            await store.dispatch(
                fetchQueue({
                    tag: "feed",
                    items: queues.get(shortname).get("items"),
                    channel,
                    homeChannel,
                    solo: 0,
                    shortname,
                    lastid: 0,
                    page: 0,
                    type: "feed",
                    tail: "",
                })
            );
        }
    }
    let finishTime = Date.now();
    console.log("end of fetchColumns:", `${finishTime - startTime} ms`);
}
module.exports = {
    fetchColumns,
    ssrParams,
    setCookie,
    fetchApp,
    initSession,
    dispatchSession,
};
