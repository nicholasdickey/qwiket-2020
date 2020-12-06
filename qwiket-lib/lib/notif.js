import React from "react";
import LazyLoad from "vanilla-lazyload";
import Root from "window-or-global";

export class Notif extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log("NOTIF common constructor");
        this.queues = {
            newItemsNotifications: Immutable.fromJS({}),
            commentNotifications: null,
            alerts: [],
        };
    }
    newItemsNotificationsAPI() {
        if (this.api) return this.api;
        this.api = {
            registerQueue: (({
                type,
                channel,
                homeChannel,
                shortname,
                solo,
                lastid,
                qwiketid,
            }) => {
                var queueId = Math.floor(Math.random() * 1000000);
                console.log("registerQueue", {
                    queueId,
                    type,
                    channel,
                    homeChannel,
                    shortname,
                    solo,
                    lastid,
                    qwiketid,
                });

                this.queues.newItemsNotifications = this.queues.newItemsNotifications.set(
                    queueId,
                    {
                        type,
                        channel,
                        homeChannel,
                        shortname,
                        solo,
                        lastid,
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
                //console.log("COMMON updateLastId", { queueId, lastid, tail, o })
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
        console.log("COOMON componentDidMount");
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

        this.intervalHandler = setInterval(() => {
            console.log("registerQueue notificationsHandler:", {
                newItemsNotifications: this.queues.newItemsNotifications.toJS(),
            });
            if (this.queues && this.queues.newItemsNotifications)
                this.queues.newItemsNotifications.forEach((p, i) => {
                    console.log("notif,queue:", { i, p });
                    /*$$$PROD */ actions.fetchNotifications(p);
                    /*$$$PROD*/ // actions.onlineCount();
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
}
