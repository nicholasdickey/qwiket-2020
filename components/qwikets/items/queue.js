//require("babel/register");
import React from "react";
import ReactDom from "react-dom";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//import u from "../lib/utils";
import $ from "jquery";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
var debounce = require("lodash.debounce");

// refactoring of qwiketItems fpr V10
class Wrapper extends React.Component {
    render() {
        let W = styled.div`
            width: 100%;
        `;
        return <W data-id="w-wrapper">{this.props.children}</W>;
    }
}

let QueueRenderer = React.memo(
    ({
        tag,
        isGrid,
        items,
        channel,
        listRenderer,
        renderer,
        debug,
        thisQueue,
        type,
    }) => {
        let rows = [];
        var c = 0;
        //  console.log("RENDER QueueRenderer", { tag });
        if (!items) return <div>Loading...</div>;
        items.forEach((p, i) => {
            //console.log("bi in",p)
            if (!p || !(typeof p.get === "function")) {
                //console.log("bi blank")
                return;
            }
            if (!p.get("title")) {
                //console.log("fixing title")
                p = p.set("title", "no title...");
            }
            if (!p.get("description")) {
                //console.log("fixing description")
                p = p.set("description", "no description...");
            }
            if (
                (!debug && +p.get("threadid") > 0) ||
                (p.get("title") && p.get("title").indexOf("Liberty Score") >= 0)
            ) {
                console.log("return bad threadid or title", p.toJS());
                return;
            }
            let image = p.get("image");
            if (!image) {
                //console.log("no image , getting image_src")
                image = p.get("image_src");
            }
            if (
                image &&
                image.indexOf("https") < 0 &&
                image.indexOf("http") >= 0 &&
                (image.indexOf("qwiket.com") >= 0 ||
                    image.indexOf("d4rum.com") >= 0)
            ) {
                image = image.replace("http", "https");
                p = p.set("image", image);
                /*if(image.indexOf('thehill')>=0){
                console.log("grid: image=",image);
            }*/
            }

            // console.log("bi 3")
            let contextUrl = "/context";

            let ch = channel ? "/channel/" + channel : "";
            let innerLink = contextUrl + ch + "/topic/" + p.get("threadid");
            let cb = c => {
                //console.log("callback lastRow=", c ? c.props.lastRow : '-1', 'props.grid=', props.grid, type)
                if (!c) {
                    u.unregisterEvents("bottomScroll", thisQueue);
                } else if (c.props.lastRow) {
                    //console.log("LastRow bottom register", { type })
                    let el = ReactDom.findDOMNode(c);
                    let domRect = el.getBoundingClientRect();
                    //  console.log({ domRect })
                    let j = $(el);
                    let offset = j.offset();

                    u.unregisterEvents("bottomScroll", thisQueue);
                    if (!offset || offset.top == 0) return;
                    //  console.log("offset", { j, offset, el })

                    const bottomScroll = debounce(
                        thisQueue.bottomScroll.bind(
                            thisQueue
                        ) /*window.scrollTo(0, 0)*/,
                        1000,
                        { leading: true, trailing: false, maxWait: 1000 }
                    );
                    //  console.log("REF:", { c, props: c.props, y: offset ? offset.top : 0 });

                    u.registerEvent(
                        "bottomScroll",
                        bottomScroll,
                        { me: thisQueue, y: offset ? offset.top : 0 },
                        type
                    );
                }
            };
            let lr = i == items.count() - 1;
            if (lr) {
                //console.log("---LAST ROW RENDERING ---", type);
            }
            let fr = i == 0;
            //console.log('Items',props.grid)
            if (isGrid) {
                var x, y;
                if (width < 600) {
                    c = 1;
                    x = 3;
                    y = 2;
                } else {
                    switch (c) {
                        case 0:
                            x = 2;
                            y = 2;
                            break;
                        case 1:
                            x = 1;
                            y = 2;
                            break;
                        case 2:

                        case 5:
                            x = 1;
                            y = 1;
                            break;
                        case 3:
                        case 4:
                            x = 2;
                            y = 1;
                            break;
                    }
                }
                /*
            const description = p.get("description").replace(/&eacute;/g).replace(/&rsquo;/g, '\'').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&lduo;/g, '"').replace(/&quot;/g, '\'').replace(/&nbsp;/g, ' ').replace(/<p>/g, ' ').replace(/<\/p>/g, ' ').replace(/<i>/g, ' ').replace(/<\/i>/g, ' ').replace(/<em/g, ' ').replace(/<\/em>/g, ' ').replace(/\\n/g, ' ').replace(/>/g, '').slice(0, x == 3 ? 386 : x == 2 ? 250 : 168);
            const title = p.get("title").replace(/&eacute;/g).replace(/&rsquo;/g, '\'').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&lduo;/g, '"').replace(/&quot;/g, '\'').replace(/&nbsp;/g, ' ').replace(/<p>/g, ' ').replace(/<\/p>/g, ' ').replace(/<i>/g, ' ').replace(/<\/i>/g, ' ').replace(/<em/g, ' ').replace(/<\/em>/g, ' ').replace(/\\n/g, ' ').replace(/>/g, '').slice(0, x == 3 ? 386 : x == 2 ? 250 : 168);
 
            const author = p.get("author") && p.get("author") != 'undefined' ? p.get("author") : '';
            const byline = p.get("site_name") + (author ? ' : ' : '  ') + author;
*/
                //console.log("Add GridTile") this.props.invalidateContext(true,this.props.topic.get('cat'),this.props.topic.get('xid'),this.props.topic)

                rows.push(
                    <Wrapper
                        key={`key-${tag}-${i}`}
                        rowIndex={i}
                        ref={cb}
                        lastRow={lr}
                        firstRow={fr}>
                        {" "}
                        {renderer({ item: p, channel })}
                    </Wrapper>
                );
                c++;
                if (c > 5) c = 0;
            } else {
                // console.log({ i, p })
                // if (tag == 'hot')
                //     console.log("*> RENDERING HOT ITEM")
                rows.push(
                    renderer({
                        item: p,
                        channel,
                        wrapper: {
                            key: `key-${tag}-${i}`,
                            rowIndex: i,
                            ref: cb,
                            lastRow: lr,
                            firstRow: fr,
                        },
                    })
                );
            }
        });
        //if (tag == 'newsviews')
        //  console.log("*> LIST RENDERER", { tag, rows })

        return <div>{listRenderer({ rows })}</div>;
    }
);

export class Queue extends React.Component {
    constructor(props) {
        super(props);
        //   console.log("QUEUE CONSTRUCTOR")
        this.fetch = debounce(this.fetch, 1000);
        this.state = { queueId: null };
        let queue = props.queues.get(props.tag);

        if (!queue) {
            // console.log("NO  TAG queue", { tag: props.tag })
            this.fetch({ clear: true, clear: false, page: 0 });
        }
    }
    topScroll(name, e) {
        //console.log("topScroll")
        //console.log("QWIKETITEMS FETCH topScroll")
        this.fetch({ clear: true, clear: false, page: 0 });
        if (this.props.count) this.props.count();
    }
    bottomScroll(name, e) {
        const props = this.props;
        //console.log("bottom calling fetch items", name, { page: props.state.get("page"), type: this.props.type, noscroll: props.noscroll, drafts: props.drafts });
        // console.log("bottomScroll")
        if (props.noscroll || props.drafts) return;
        //this.page++
        //console.log("bottomScroll", { state: props.state.toJS() })
        let { queues, tag } = props;
        //console.log({ tag, queues })
        let state = queues.get(tag);
        //console.log({ state })

        let page = state ? state.get("page") : 0;

        if (!page) {
            //	console.log("no page, reset")
            page = 0;
        }
        page++;
        //	console.log("bottomScroll ", { name, page, comment: e.comment });
        //console.log("===================>>QWIKETITEMS FETCH bottomScroll", page)
        this.fetch({ clear: false, remove: false, page });
    }

    componentWillUnmount() {
        //console.log('Items componentWillUnmount')
        let { qparams } = this.props;
        u.unregisterEvents("topScroll", this);
        if (qparams && qparams.newItemsNotificationsAPI) {
            qparams.newItemsNotificationsAPI.unregisterQueue({
                queueId: this.state.queueId,
            });
        }
    }
    fetchNotifications({ username, page, channel }) {
        this.props.actions.fetchNotifications({ username, page, channel });
        return;
    }
    fetch({ clear, remove, page }) {
        // console.log("FETCH", page)
        let { app, queues, actions, tag, qparams, spaces, solo } = this.props;

        let channelObject = app.get("channel");
        let channel = channelObject.get("channel");
        let homeChannel = channelObject.get("homeChannel");
        let state = queues.get(tag);
        let type = "";
        let shortname = "";
        let size = spaces || 25;
        if (size < 8) size = 8;
        let username = app.get("user").get("username");
        switch (tag) {
            case "newsgrid":
                type = "newsline";
                break;
            case "newsline":
            case "topics":
            case "reacts":
            case "stickies":
            case "hot":
                type = tag;
                break;
            case "newsviews":
                type = "mix";
                break;
            case "dq":
            case "allq":
            case "drafts":
                type = tag;
                shortname = username;
                break;
            default:
                type = "feed";
                shortname = tag;
        }

        let { fetchAlerts, clearQueue, fetchQueue } = actions;
        if (remove) {
            clearQueue();
        }
        let tail = "";
        if (type == "alerts") {
            // console.log("CALLING FETCHALERTS", { username, page })
            fetchAlerts({ username, page });
            return;
        } else tail = state ? state.get("tail") : "";
        //console.log("fetch calling fetchQueue", { communityState: communityState.toJS(), channel, page, type, homeChannel, tail, lastid: clear ? 0 : (state ? state.get("lastid") : 0), })
        fetchQueue({
            tag,
            channel,
            homeChannel,
            solo: solo ? 1 : 0,
            shortname: solo ? solo : shortname,
            lastid: clear ? 0 : state ? state.get("lastid") : 0,
            page,
            size,
            type,
            tail,
        });
    }
    componentWillReceiveProps(nextProps) {
        const props = this.props;
        let { tag, queues, qparams, solo } = props;
        let {
            tag: nextTag,
            queues: nextQueues,
            qparams: nextQparams,
            solo: nextSolo,
        } = nextProps;

        let state = queues.get(tag);
        let nextState = nextQueues.get(nextTag);
        let myFeedsData = props.myFeedsData;

        let nextMyFeedsData = nextProps.myFeedsData;
        const myFeedsChanged = myFeedsData != nextMyFeedsData;
        //console.log("QUEUE componentWillReceiveProps myFeeds", myFeedsChanged)

        if ((!nextState && solo != nextSolo) || myFeedsChanged) {
            // console.log("NO NEXT TAG or changed solo", { nextTag, nextState, solo, nextSolo })
            this.fetch({ clear: true, clear: false, page: 0 });
        } else {
            // console.log("NEXT TAG", { nextTag, nextState })
        }
        // console.log("QwiketItems channels old=", state.toJS(), " new=", nextState.toJS(), 'lastid:', { lastid: state.get('lastid'), nextLastid: nextState.get('lastid') })
        //	console.log('Items componentWillReceiveProps', nextProps)
        if (
            nextProps.author != props.author ||
            props.starred != nextProps.starred ||
            props.solo != nextProps.solo ||
            props.orderby != nextProps.orderby ||
            props.query != nextProps.query ||
            props.site != nextProps.site ||
            props.channel != nextProps.channel ||
            (props.sitename != nextProps.sitename && nextProps.sitename)
        ) {
            //	console.log('Mix ITEMS componentWillReceiveProps this=%o,props=%o', this.props, nextProps)
            let page = nextProps.state.get("page");
            if (!page) page = 0;
            //console.log("QWIKETITEMS FETCH 1")
            //  this.fetch({ clear: true, remove: true, page });
        }
        if (
            nextState &&
            state &&
            ((typeof state.get("lastid") !== "undefined" &&
                nextState.get("lastid") != state.get("lastid")) ||
                (typeof nextState.get("tail") !== "undefined" &&
                    nextState.get("tail") != state.get("tail")))
        ) {
            // console.log("QwiketItems update lastid,tail", { rqparams: Root.qparams, qparams, lastid: nextState.get("lastid"), tail: nextState.get("tail") })
            if (!qparams || !qparams.newItemsNotificationsAPI)
                qparams = Root.qparams;
            qparams.newItemsNotificationsAPI.updateLastId({
                queueId: this.state.queueId,
                lastid: nextState.get("lastid"),
                tail: nextState.get("tail"),
            });
        }
    }
    componentDidMount() {
        const props = this.props;
        let page = props.state ? props.state.get("page") : 0;
        if (!this.props.noscroll)
            u.registerEvent("topScroll", this.topScroll.bind(this), {
                me: this,
            });

        //if (!page)
        page = 0;
        //console.log("fetchQueue QWIKETITEMS componentDidMount FETCH ")
        /* if (!(__CLIENT__ && window.goBack)) {
             //console.log("calling fetch")
             this.fetch(true, false, props, page);
         }*/
        //console.log("ITEMS WILL MOUNT")
        if (
            !this.props.topics ||
            this.props.topics.count() == 0 /*||this.props.sitename*/
        ) {
            //console.log("EMTPTY TOPICS")
            const page = 0;
            //if(this.props.type!='c')
            //	console.log("QWIKETITEMS FETCH 3")

            //  this.fetch({ clear: true, remove: false, page })
        }
        // if (Root.__CLIENT__) {
        let { solo, tag, qparams, app, queues, qwiketid, spaces } = this.props;
        //  let state = queues[tag];
        // let homeChannel = app.get("channel").get("homeChannel");

        let channelObject = app.get("channel");
        let channel = channelObject.get("channel");
        let homeChannel = channelObject.get("homeChannel");
        let state = queues.get(tag);
        let type = "";
        let shortname = "";
        let size = spaces || 25;
        let username = app.get("user").get("username");
        switch (tag) {
            case "newsline":
            case "topics":
            case "reacts":
            case "stickies":
            case "hot":
                type = tag;
                break;
            case "newsviews":
                type = "mix";
                break;
            case "dq":
            case "allq":
            case "drafts":
                type = tag;
                shortname = username;
                break;
            default:
                type = "feed";
                shortname = tag;
        }

        if (
            tag != "topics" &&
            tag != "hot" &&
            tag != "stickies" &&
            tag != "drafts" &&
            tag != "alerts" &&
            qparams &&
            qparams.newItemsNotificationsAPI
        ) {
            // console.log('calling registerQueue:', { tag, type, channel, shortname, solo, lastid: state ? state.get("lastid") : 0, tail: state ? state.get("tail") : '' })

            const queueId = qparams.newItemsNotificationsAPI.registerQueue({
                tag,
                type,
                channel,
                homeChannel,
                qwiketid,
                shortname: solo ? solo : shortname,
                solo: solo ? 1 : 0,
                lastid: state ? state.get("lastid") : 0,
                tail: state ? state.get("tail") : "",
            });
            //console.log("QwiketItems registered ", { queueId })
            if (queueId) this.setState({ queueId });
        }
        // }
    }
    shouldComponentUpdate(nextProps) {
        const props = this.props;

        let nextTag = nextProps.tag;
        let tag = props.tag;
        // console.log('NEXT TAG queue shouldComponentUpdate1', { tag, nextTag });
        let myFeedsData = props.myFeedsData;
        let nextMyFeedsData = nextProps.myFeedsData;
        const myFeedsChanged = myFeedsData != nextMyFeedsData;
        //   console.log("QUEUE shouldComponentUpdate myFeeds", myFeedsChanged)
        const tagChanged = nextTag != tag;
        let nextQueue = nextProps.queues.get(nextTag);
        let queue = props.queues.get(tag);
        const queueChanged = nextQueue != queue;

        let channelChanged =
            props.qparams &&
            nextProps.qparams &&
            props.qparams.channel &&
            nextProps.qparams.channel &&
            props.qparams.channel != nextProps.qparams.channel;
        // console.log("Queue shouldComponentUpdate", { tag, tagChanged, queueChanged, channelChanged, nextTag });

        return tagChanged || queueChanged || channelChanged || myFeedsChanged;
    }

    render() {
        const props = this.props;
        let {
            app,
            session,
            queues,
            actions,
            tag,
            debug,
            isGrid,
            renderer,
            listRenderer,
            type,
            qparams,
        } = props;
        //  if (Root.qparams) qparams = Root.qparams;
        let channel = qparams.channel; //app.get("channel").get("channel");
        //  console.log("queue render:", { channel, tag })
        let state = queues.get(tag);
        let Loading = styled.div`
            margin-left: 8px;
        `;
        if (!state) {
            console.log("no items in the queue yet", { tag });
            return <Loading>Loading...</Loading>;
        }
        let items = state.get("items");
        let newItems = state.get("newItems");
        //  console.log(">>RENDER QUEUE", { tag, newItems, items: items.count() });
        let StyledNotification = styled.div`
            position: absolute;
            padding-left: 4px;
            padding-right: 4px;
            z-index: 9;
            width: 100%;
            opacity: 0.9;
            &:hover {
                opacity: 1;
            }
        `;
        let OuterNotification = styled.div`
            position: relative;
            width: 100%;
        `;

        return (
            <div>
                {" "}
                {newItems ? (
                    <OuterNotification>
                        <StyledNotification data-id="li-2">
                            <Button
                                data-id="b12"
                                fullWidth={true}
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => {
                                    let arg = state.get("notificationSpec");
                                    if (!arg) arg = {};
                                    arg.lastid = 0;
                                    props.actions.fetchQueue(arg);
                                }}>
                                <span style={{ fontSize: "0.9rem" }}>{`Show  ${
                                    newItems < 100 ? newItems : "100+"
                                } New ${
                                    newItems == 1 ? "Item" : "Items"
                                }`}</span>
                            </Button>
                        </StyledNotification>
                    </OuterNotification>
                ) : null}
                <QueueRenderer
                    tag={tag}
                    channel={channel}
                    isGrid={isGrid}
                    debug={debug}
                    items={items}
                    listRenderer={listRenderer}
                    renderer={renderer}
                    thisQueue={this}
                    type={type}
                />
            </div>
        );
    }
}
