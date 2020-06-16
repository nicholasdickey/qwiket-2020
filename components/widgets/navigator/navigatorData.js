import React from "react";

import styled from "styled-components";

export class NavigatorData extends React.Component {
    constructor(props) {
        super(props);
    }
    deriveNavigatorTag({ channelState, session }) {
        console.log({ channelState: channelState.toJS() });
        let channelDetails = channelState.get("channelDetails");
        let config = channelDetails.get("config");
        //console.log("config:", config.toJS(), session.toJS())
        let defaultDefinedTag = config.get("defaultDefinedTag")
            ? config
                  .get("definedTags")
                  .get(config.get("defaultDefinedTag"))
                  .get("tag")
            : null;
        let metatag = session.get("navigatorTag") || defaultDefinedTag;
        return metatag;
    }
    checkAndFetch({
        navigatorTag,
        navigatorData,
        actions,
        channelState,
        cpath,
        cme,
    }) {
        let channelDetails = channelState.get("channelDetails");

        let config = channelDetails.get("config");
        console.log("checkAndFetch", {
            navigatorTag,
            config,
            data: navigatorData.get(navigatorTag),
        });

        /* if (!navigatorData || !navigatorData.get(navigatorTag)) {
            let channel = channelState.get("channel");

            if (!cpath || !me) {
                cpath = channelDetails.get("cpath");
                cme = channelDetails.get("cme");

                if (cme && cme.indexOf(":") == 0) {
                    cme = cme.split(':')[1];
                }
                console.log("!!!!", { cpath, cme })
            }
            console.log("FETCHING METATAG:", { metatag: navigatorTag, cpath, cme, channel })
            actions.fetchMetatag({ cpath, cme, channel, metatag: navigatorTag });
        }*/
    }
    componentDidMount() {
        let {
            channel: channelState,
            session,
            navigatorData,
            actions,
            qparams,
        } = this.props;
        let navigatorTag = this.deriveNavigatorTag({ channelState, session });
        if (navigatorData)
            if (!navigatorData.get(navigatorTag)) {
                this.checkAndFetch({
                    navigatorTag,
                    navigatorData,
                    actions,
                    channelState,
                    cpath: qparams.cpath,
                    cme: qparams.cme,
                });
            }
    }
    componentDidUpdate(prevProps) {
        let {
            channel: channelState,
            session,
            navigatorData,
            actions,
            qparams,
        } = this.props;
        let {
            channel: prevChannelState,
            session: prevSession,
            qparams: prevQparams,
        } = prevProps;
        let navigatorTag = this.deriveNavigatorTag({ channelState, session });
        let prevNavigatorTag = this.deriveNavigatorTag({
            channelState: prevChannelState,
            session: prevSession,
        });

        /* if (navigatorTag == 'users' && navigatorTag != prevNavigatorTag) {
             actions.fetchNavUsers({ channel: channelState.get("channel") });
         }
         if (navigatorTag == 'tags' && navigatorTag != prevNavigatorTag) {
             actions.fetchNavTags({ channel: channelState.get("channel") });
         }*/
        if (
            navigatorTag != prevNavigatorTag ||
            prevQparams.cme != qparams.cme
        ) {
            this.checkAndFetch({
                navigatorTag,
                navigatorData,
                actions,
                channelState,
                cpath: qparams.cpath,
                cme: qparams.cme,
            });
        }
    }
    render() {
        let {
            listRenderer,
            treeRenderer,
            qparams,
            session,
            channel: channelState,
            navigatorData,
            myFeedsData,
        } = this.props;
        if (!myFeedsData) return <div>Loading...</div>;
        let metatag = this.deriveNavigatorTag({ channelState, session });
        let channelDetails = channelState.get("channelDetails");
        let channel = channelState.get("channel");
        let config = channelDetails.get("config");
        console.log("MYFEEDS", myFeedsData.toJS());
        let defaultDefinedTag = config.get("defaultDefinedTag");
        let navigatorTag = session.get("navigatorTag") || defaultDefinedTag;
        let tags = [];
        console.log("!!!!!!!!!!!!!!!!", navigatorTag);
        let definedTagsMap = config.get("definedTags").toJS();
        console.log({ definedTagsMap });
        let dtVals = Object.values(definedTagsMap);
        console.log({ dtVals });
        let currentTag = null;
        let definedTags = dtVals.forEach((p, i) => {
            tags.push({ tag: p.tag, text: p.name });
        });

        console.log({ tags });
        tags.push({ tag: "users", text: "Users" });
        tags.push({ tag: "tags", text: "Tags" });
        let myFeeds = myFeedsData.get(channel);
        console.log({ myFeeds: myFeeds.toJS() });
        if (
            navigatorData &&
            navigatorTag != "users" &&
            navigatorTag != "tags"
        ) {
            let d = navigatorData.get(navigatorTag);
            // console.log("NAVIGATOR DATA", JSON.stringify(d.toJS(), null, 4))
            if (!d)
                return treeRenderer({
                    tags,
                    currentTag: navigatorTag,
                    myFeeds,
                    session,
                    qparams,
                });
            let parents = d.get("parents");
            let children = d.get("children");
            let level = d.get("level");
            let feeds = d.get("feeds");
            console.log(">>>", {
                metatag,
                navigatorTag,
                feeds,
                dt: definedTags,
                parents: parents.toJS(),
                childrenItems: children.toJS(),
                level: level.toJS(),
                feeds: feeds.toJS(),
                myFeeds,
            });

            let currentTag = config
                .get("definedTags")
                .get(navigatorTag)
                .get("tag");

            return treeRenderer({
                tags,
                currentTag: currentTag,
                myFeeds,
                parents,
                childrenItems: children,
                level,
                feeds,
                session,
                qparams,
            });
        } else {
            console.log("returning listRenderer", { navigatorTag });
            return listRenderer({
                tags,
                currentTag: navigatorTag,
                myFeeds,
                session,
                qparams,
            });
        }
        return <div>{metatag}</div>;
    }
}
