import React from "react";

import styled from "styled-components";

import Head from "next/head";

import LazyLoad from "vanilla-lazyload";
import Root from "window-or-global";

import Typography from "@material-ui/core/Typography";

import u from "../qwiket-lib/lib/utils";
import Topline from "./topline";
import { Layout, InnerGrid } from "../qwiket-lib/components/layout";
import { parseLayout } from "../qwiket-lib/lib/layout";
//import QwiketView from "../components/qwikets/qwiketView";
import Header from "./header";
import LayoutView from "./layoutView";
var debounce = require("lodash.debounce");
import dynamic from "next/dynamic";
const { Notif } = dynamic(import("../qwiket-lib/lib/notif"));
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default class Common extends React.Component {
    constructor(props, context) {
        super(props, context);
        //  console.log("Common constructor")
        this.queues = {
            newItemsNotifications: Immutable.fromJS({}),
            commentNotifications: null,
            alerts: [],
        };
    }

    shouldComponentUpdate(nextProps) {
        let props = this.props;
        let contextChanged = props.context != nextProps.context;
        let appChanged = props.app != nextProps.app;
        let qparamsChanged = props.qparams != nextProps.qparams;
        let queuesChanged = props.queues != nextProps.queues;

        let nextSession = nextProps.session;
        let session = props.session;
        let width = u.getLayoutWidth({ session });
        let nextWidth = u.getLayoutWidth({ session: nextSession });
        //   const sessionChanged = nextSession != session;
        const thickChanged = nextSession.get("thick") != session.get("thick");
        const loudChanged = nextSession.get("loud") != session.get("loud");
        const darkChanged = nextSession.get("theme") != session.get("theme");
        const bandChanged = nextSession.get("cover") != session.get("cover");
        const sessionChanged =
            thickChanged || loudChanged || darkChanged || bandChanged;

        //   console.log("WIDTH EVAL", { width, nextWidth, sWidth: session.get("width"), nsWidth: nextSession.get("width") })
        let widthChanged = width != nextWidth;
        //Root.qparams = nextProps.qparams;
        let userChanged = props.user != nextProps.user;
        let selChanged =
            props.qparams.sel != nextProps.qparams.sel ||
            props.qparams.channel != nextProps.qparams.channel;
        let layoutChanged = props.qparams.layout != nextProps.qparams.layout;
        //  console.log("Common shouldComponentUpdate", { selChanged, rparams: Root.qparams, contextChanged, appChanged, qparamsChanged, queuesChanged, sessionChanged, userChanged })
        return sessionChanged || userChanged || layoutChanged || selChanged; // || qparamsChanged// || contextChanged;
    }
    newItemsNotificationsAPI() {
        if (this.api) return this.api;
        this.api = {
            registerQueue: (({
                tag,
                type,
                channel,
                homeChannel,
                shortname,
                solo,
                lastid,
                qwiketid,
                tail,
            }) => {
                var queueId = Math.floor(Math.random() * 1000000);
                //  console.log("registerQueue", { queueId, tag, type, channel, homeChannel, shortname, solo, lastid, qwiketid, tail })

                this.queues.newItemsNotifications = this.queues.newItemsNotifications.set(
                    queueId,
                    {
                        tag,
                        type,
                        channel,
                        homeChannel,
                        shortname,
                        solo,
                        lastid,
                        tail,
                        qwiketid,
                        test: 0,
                    }
                );
                return queueId;
            }).bind(this),
            unregisterQueue: (({ queueId }) => {
                this.queues.newItemsNotifications = this.queues.newItemsNotifications.delete(
                    queueId
                );
            }).bind(this),
            registerComment: (({ rootId, nodes, channel, storyId }) => {
                // console.log("registerComment>>")
                this.commentNotifications = {
                    storyId,
                    rootId,
                    nodes,
                    channel,
                    type: "notif",
                    test: 0,
                };
            }).bind(this),
            unregisterAllComments: (() => {
                this.commentNotifications = null;
            }).bind(this),
            updateLastId: (({ queueId, lastid, tail }) => {
                if (!this.queues || !this.queues.newItemsNotifications) return;
                let o = this.queues.newItemsNotifications.get(queueId);
                if (!o) return;
                //  console.log("COMMON updateLastId", { queueId, lastid, tail, o })
                o.lastid = lastid;
                o.tail = tail;
                this.queues.newItemsNotifications = this.queues.newItemsNotifications.set(
                    queueId,
                    o
                );
            }).bind(this),
        };
        return this.api;
    }
    updateDimensions() {
        if (Root.__CLIENT__) {
            let props = this.props;
            const width = props.session.get("width");
            const clientWidth = u.width(null);
            if (width != clientWidth) {
                // console.log("WIDTH changed", { clientWidth, width })
                props.actions.updateSession({ width: clientWidth });
            }
        }
    }
    componentDidMount() {
        //  console.log("COOMON componentDidMount")

        window.addEventListener(
            "resize",
            debounce(this.updateDimensions.bind(this), 500, {
                leading: false,
                trailing: true,
                maxWait: 3000,
            })
        );
        window.goBack = false;
        this.updateDimensions();
        const props = this.props;
        const {
            actions,
            path,
            app,
            user,
            qparams,
            queues,
            session,
            context,
            dispatch,
        } = props;

        let channel = qparams.channel;
        let { sel } = qparams;
        let alerts = app.get("alerts");
        let username = user.get("username");

        if (sel == "context") {
            if (session.get("tPage") != 0) actions.updateSession({ tPage: 0 });
        }
        let items = alerts ? alerts.get("items") : null;
        let lastid = "";
        if (items) {
            let lastAlert = items.get(0);
            lastid = lastAlert ? lastAlert.get("alertid") : "";
        }
        // actions.checkAlerts({ username, lastid });
        // console.log("registerComment seInterval");
        let usedQwiketids = [];
        let usedTags = [];
        /* this.intervalHandler2 = setInterval(async () => {
             let store = Root.store;
             if (!store)
                 return;
             let currentState = store.getState();
             let cache = currentState.cache;
             console.log("intervalHandler2")
             let t1 = Date.now();
             const [...keys] = cache.get('queues').keys();
             console.log({ keys, size: keys.length })
             for (var j = 0; j < keys.length; j++) {
                 //console.log({ j })
                 let tag = keys[j];
                 if (tag == 'qwikets')
                     continue;
                 let q = cache.get('queues').get(tag);
                 let t2 = Date.now();
                 //console.log({ t1, t2 })
                 // if (t2 - t1 > 5000)
                 //    return;
                 // console.log("QUEUE", tag, q.toJS())
                 let items = q.get("items");
                 if (!items) {
                     console.log("QUEUE - NO ITEMS", tag, q.toJS())
 
                     continue;
                 }
                 //console.log({ items, size: items.size });
                 for (var i = 0; i < items.size; i++) {
                     let item = items.get(i);
                     // console.log({ i, item })
                     let t3 = Date.now();
                     //  if (t3 - t1 > 8000)
                     //     return;
                     // await sleep(1000);
                     // console.log("item process")
                     let qwiketid = item.get("qwiketid") || item.get("threadid");
                     // console.log("item process", { qwiketid, usedQwiketids })
                     if (!props.cache.get("qwikets").get(qwiketid) && usedQwiketids.indexOf(qwiketid) < 0) {
                         usedQwiketids.push(qwiketid);
                         console.log("fetching item", qwiketid, usedQwiketids)
                         await actions.fetchQwiket({
                             channel,
                             qwiketid,
                             cache: true,
                         })
                         // await sleep(1000);
                     }
                 }
                 // if (tag == 'newsviews' || tag == 'topics')
                 //    return;
 
             }
             const [...keys2] = cache.get("qwikets").keys();
             console.log("KEYS2@:", keys2, { cache: cache.toJS() })
             for (var k = 0; k < keys2.length; k++) {
                 let qwiketid = keys2[k];
                 let qwiket = cache.get("qwikets").get(qwiketid);
                 let tag = qwiket.get("cat") || qwiket.get("categoy");
                 if (!tag)
                     tag = qwiket.get("tags") ? qwiket.get("tags").get(0) : '';
                 console.log("processTag", { qwiketid, tag, qwiket: qwiket.toJS(), usedTags, cacheTags: cache.get("tags").toJS(), cacheQueues: cache.get('queues').toJS() });
                 if (tag && usedTags.indexOf(tag) < 0) {
                     console.log("###############", { qwiketid, tag, qwiket: qwiket.toJS() });
                     let tags = cache.get("tags");
                     console.log({ tags: tags.toJS() })
                     if (!tags.get(tag)) {
                         console.log("PREFETCH TAG", tag)
                         actions.fetchTag({ tag, cache: true })
                     }
                     usedTags.push(tag);
                     if (!cache.get('queues').get(tag)) {
                         console.log("PREFETCH FEED", tag)
                         await actions.fetchQueue({
                             tag,
                             cache: true,
                             channel,
                             homeChannel: props.app.get("channel").get("homeChannel"),
                             solo: 0,
                             shortname: tag,
                             lastid: 0,
                             page: 0,
                             type: 'feed',
                             tail: ''
 
                         })
                     }
 
 
                 }
             }
         }, 10000);
         */
        this.intervalHandler = setInterval(() => {
            //  console.log("registerQueue notificationsHandler:", { newItemsNotifications: this.queues.newItemsNotifications.toJS() });
            if (this.queues && this.queues.newItemsNotifications)
                this.queues.newItemsNotifications.forEach((p, i) => {
                    // console.log("notif,queue:", { i, p });
                    /*$$$PROD */ actions.fetchNotifications(p);
                    /*$$$PROD*/ actions.onlineCount();
                });
            // console.log("registerComment CommentsNotifications action", this.commentNotifications)
            if (this.commentNotifications) {
                // console.log("registerComment action")
                actions.fetchComments(this.commentNotifications);
            }
            alerts = app.get("alerts");
            items = alerts ? alerts.get("items") : null;
            let lastid = "";
            if (items) {
                let lastAlert = items.get(0);
                lastid = lastAlert ? lastAlert.get("alertid") : "";
            }
            actions.checkAlerts({ username, lastid });
        }, 10000);

        if (Root.__CLIENT__) {
            //console.log("GA:", path);
            Root.__WEB__ = true;

            if (typeof ga !== "undefined") {
                ga("set", "page", path);
                ga("send", "pageview");
            }
            this.lazyLoadInstance = new LazyLoad({
                elements_selector: ".lazyload",
                // ... more custom settings?
            });
        }

        // console.log("common did mount")
    }
    componentDidUpdate() {
        console.log("COMMON componentDidUpdate");
        if (this.lazyLoadInstance) {
            this.lazyLoadInstance.update();
        }
    }
    componentWillUnmount() {
        // window.removeEventListener("resize", this.updateDimensions);
        if (this.intervalHandler) {
            clearInterval(this.intervalHandler);
        }
        if (this.intervalHandler2) {
            clearInterval(this.intervalHandler2);
        }
    }
    componentWillReceiveProps(nextProps) {
        const props = this.props;
        const { actions, session, globals, qparams: params, sel, path } = props;
        let nparams = nextProps.qparams;
        if (!params || !nparams) return;
        //const width = u.width(globals);
        //const channel = params && params.channel ? params.channel : 'qwiket';
        /* if (nparams && channel != globals.get("channel")) {
             actions.fetchApp(nparams.channel);
             props.actions.setGlobals(globals.set("channel", channel));
         }*/
        //   console.log("CommonPage componentWillReceiveProps", { nthreadid: nparams.threadid, threadid: params.threadid, width })
        if (
            nparams.threadid != params.threadid ||
            nparams.shortname != params.shortname
        ) {
            if (session.get("tPage") != 0) actions.updateSession({ tPage: 0 });
            //console.log("CommonPage o=",o);
            /*$$$ if (Root.__CLIENT__) {
                 console.log("2GA:", path);
                 ga('set', 'page', path);
                 ga('send', 'pageview');
             }*/
        }
        /*if(!nextProps.os.get("articles")||nextProps.os.get("articles").length==0){
          const categoryXid=nextProps.cs.get("community_category_xid");
          nextProps.actions.fetchCatArticles(categoryXid);
        }*/
        if (
            nparams.rootThreadid != params.rootThreadid ||
            nparams.qwiketid != params.qwiketid ||
            nparams.threadid != params.threadid
        ) {
            // console.log('CommonPage componentWillReceiveProps fetchShowQwiket nparams:', nparams)
            const rootThreadid = nparams.rootThreadid
                ? nparams.rootThreadid
                : nparams.threadid;
            const qwiketid = nparams.qwiketid
                ? nparams.qwiketid
                : nparams.threadid;

            // props.actions.fetchShowQwiket({ rootThreadid, qwiketid, qType: nextProps.qType });
        }
        if (nparams.qwiketid != params.qwiketid) {
            // console.log('fetchShowQwiket CommonPage componentWillReceiveProps fetchShowQwiket nparams:', nparams)
            const rootThreadid = nparams.rootThreadid
                ? nparams.rootThreadid
                : nparams.threadid;
            const qwiketid = nparams.qwiketid
                ? nparams.qwiketid
                : nparams.threadid;
            const channel = nparams.channel;
            props.actions.fetchShowQwiket({
                channel,
                rootThreadid,
                qwiketid,
                qType: nextProps.qType,
            });
        }
    }
    render() {
        // console.log("RENDER COMMON layoutview");
        const {
            app,
            session,
            queues,
            qparams,
            context,
            user,
            actions,
        } = this.props;
        let hot = +session.get("cover");
        let loud = +session.get("loud");
        let width = u.getLayoutWidth({ session });
        let theme = +session.get("theme") == 1 ? 1 : 0;
        let pageType = qparams.sel ? qparams.sel : "newsline";
        let channel = app.get("channel").get("channel");
        let chanConfig = app.get("channel").get("channelDetails").get("config");
        let updateSession = actions.updateSession;
        //   console.log("COMMON RENDER", { pageType, qparams })
        // console.log({ user: user.toJS() })
        /* let qwiket = Immutable.fromJS({
             title: 'Test Title',
             description: "Test Description",
             image: "",
             definedTags: {
                 'publication': {
                     name: 'Test Publication',
                     shortname: 'testpublication'
                 }, 'author': {
                     name: 'Test Auhtor',
                     shortname: 'testauthor'
                 }
             },
             extraTags: [],
             published_time: 0
         }) */
        const PageTitle = styled.div`
            display: flex;
            justify-content: center;
            margin-top: 20px;
            font-family: Playfair Display !important;
            font-size: 5rem;
        `;
        const PageWrap = styled.div`
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: ${user.get("mask") ? 0.5 : 1.0};
        `;
        const QwiketViewWrap = styled.div`
            width: 20%;
        `;
        /*
        <Typography variant="h6" gutterBottom>
                                QwiketView:
                        </Typography>
                            <QwiketViewWrap>
                                <QwiketView qwiket={qwiket} qparams={qparams} />
                            </QwiketViewWrap>*/
        /*
        <Typography variant="subtitile2" gutterBottom>CHANNEL: {app.get('channel').get('channelDetails').get('name')}</Typography>*/

        //  console.log("COMMON RENDER ======================================================================================>>>>>>>>>>>>>>>>>>>.")
        qparams.newItemsNotificationsAPI = this.newItemsNotificationsAPI();
        if (__CLIENT__) {
            if (Root.__CLIENT__) setTimeout(() => actions.onlineCount(), 500);
            if (!Root.qparams) Root.qparams = qparams;
            Root.qparams.newItemsNotificationsAPI = this.newItemsNotificationsAPI();
        }
        // console.log("calling parseLayout", { qparams })
        let { layout, selectors, density } = parseLayout({
            qparams,
            app,
            session,
            pageType,
            user,
        });
        let hpads = layout.hpads;
        //  console.log("InnerGrid render layoutview")
        const Grid = styled.div`
            padding-left: ${hpads.w0};
            padding-right: ${hpads.w0};
            width: "100%" @media (min-width: 750px) {
                padding-left: ${hpads.w750};
                padding-right: ${hpads.w750};
            }
            @media (min-width: 900px) {
                padding-left: ${hpads.w900};
                padding-right: ${hpads.w900};
            }
            @media (min-width: 1200px) {
                padding-left: ${hpads.w1200};
                padding-right: ${hpads.w1200};
            }
            @media (min-width: 1600px) {
                padding-left: ${hpads.w1600};
                padding-right: ${hpads.w1600};
            }
            @media (min-width: 1800px) {
                padding-left: ${hpads.w1800};
                padding-right: ${hpads.w1800};
            }
            @media (min-width: 1950px) {
                padding-left: ${hpads.w1950};
                padding-right: ${hpads.w1950};
            }
            @media (min-width: 2100px) {
                padding-left: ${hpads.w2100};
                padding-right: ${hpads.w2100};
            }
            @media (min-width: 2400px) {
                padding-left: ${hpads.w2400};
                padding-right: ${hpads.w2400};
            }
        `;
        if (typeof chanConfig === "string")
            chanConfig = Immutable.fromJS(JSON.parse(chanConfig));
        //   console.log({ chanConfig: chanConfig.toJS() })
        const InnerWrapper = ({ layout, selectors, density }) => (
            <div>
                <Topline layout={layout} width={width} />
                <Grid>
                    <PageWrap>
                        <Header
                            width={width}
                            pageType={pageType}
                            layout={layout}
                            qparams={Root.qparams ? null : qparams}
                            density={density}
                        />
                        <LayoutView
                            chanConfig={chanConfig}
                            layout={layout}
                            selectors={selectors}
                            density={density}
                            updateUserLayout={actions.updateUserLayout}
                            userLayout={user.get("user_layout")}
                            channel={channel}
                            width={width}
                            hot={hot}
                            loud={loud}
                            theme={theme}
                            pageType={pageType}
                            layout={layout}
                            selectors={selectors}
                            density={density}
                            qparams={Root.qparams ? null : qparams}
                        />
                    </PageWrap>
                </Grid>
            </div>
        );
        return (
            <div>
                <InnerWrapper
                    layout={layout}
                    selectors={selectors}
                    density={density}
                />
            </div>
        );
    }
}
