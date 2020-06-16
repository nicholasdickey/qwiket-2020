import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Bowser from "bowser";
import { withApollo } from "../lib/apollo";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
var debounce = require("lodash.debounce");
import Layout from "../lib/layout";
import LayoutView from "../components/layoutView";
import { Context as ResponsiveContext } from "react-responsive";
import Qwikets from "../components/columns/qwikets";
const GET_CHANNEL = gql`
    query storeGetChannel($ns: String) {
        storeGetChannel(newslineSlug: $ns) {
            channelSlug
            config {
                layout
                comment
                displayName
                shortname
                description
                logo
                hometown
                navmenu {
                    slug
                    sub {
                        slug
                        name
                        description
                    }
                    name
                    description
                }
                layout
                selectors
                newslines
                defaultDefinedTag
                cpath
                cme
                definedTags
                lacantinaName
                lacantinaSlug
            }

            newslineSlug
            newslineDisplayName
            newslineLogo
            twitter
        }
    }
`;
const GET_USER = gql`
    query storeGetUser($ns: String) {
        storeGetUser(newslineSlug: $ns) {
            slug
            userName
            subscrData
            subscrStatus
            config {
                userLayout
            }
        }
    }
`;
const GET_SESSION = gql`
    query sessionGet {
        sessionGet {
            options {
                loud
                thick
                dense
                dark
                band
            }
            state
        }
    }
`;
const SAVE_USER_LAYOUT = gql`
    mutation userSaveUserLayout($userLayout: String) {
        userSaveUserLayout(userLayout: $userLayout)
    }
`;
const SAVE_SESSION = gql`
    mutation sessionSave($session: String) {
        sessionSave(session: $session)
    }
`;

const useStyles = makeStyles({
    root: {
        width: "100%",
        overflowX: "auto",
    },
    table: {
        minWidth: 650,
    },
});
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
`;
const QwiketViewWrap = styled.div`
    width: 20%;
`;

const Channel = ({ qparams, setThemeDark, setMeta, dark, meta, width }) => {
    const [dimensions, setDimensions] = React.useState({
        width: 0,
    });
    let { channel: newslineSlug } = qparams;
    const { error: channelError, data: channel } = useQuery(GET_CHANNEL, {
        variables: { ns: newslineSlug },
        notifyOnNetworkStatusChange: true,
        onCompleted: data => {
            console.log("completed GET_CHANNEL", data);
        },
    });
    React.useEffect(() => {
        let handleResize = debounce(() => {
            if (window && dimensions.width != window.innderWidth)
                setDimensions({
                    width: window.innerWidth,
                });
        }, 1000);

        window.addEventListener("resize", handleResize);
    });
    const { error: userError, data: user, refetch: refetchUser } = useQuery(
        GET_USER,
        {
            variables: { ns: newslineSlug },
            notifyOnNetworkStatusChange: true,
            onCompleted: data => {
                console.log("completed GET_USERL", data);
            },
        }
    );
    const {
        error: sessionError,
        data: session,
        refetch: refetchSession,
    } = useQuery(GET_SESSION, {
        notifyOnNetworkStatusChange: true,
        onCompleted: data => {
            let { options } = data.sessionGet;
            if (options.dark != dark) setThemeDark({ dark: options.dark });
            /*console.log(
                "=============>completed GET_SESSION_OPTIONS",
                data,
                options
            );*/
        },
    });
    const [saveUserLayout, { error: saveUserLayoutError }] = useMutation(
        SAVE_USER_LAYOUT,
        {
            onCompleted: data => {
                refetchUser();
                console.log("saveUserLayout completed");
            },
        }
    );
    const [saveSession, { error: saveSessionError }] = useMutation(
        SAVE_SESSION,
        {
            onCompleted: data => {
                refetchSession();
                console.log("saveSession completed");
            },
        }
    );
    if (session && session.state) session.state = JSON.parse(session.state);

    const updateSessionOption = update => {
        let sessionRoot = session.sessionGet;
        console.log("updateSessionOption", sessionRoot);
        sessionRoot.options = { ...sessionRoot.options, ...update };
        let sessionStr = JSON.stringify(sessionRoot);
        saveSession({
            variables: {
                session: sessionStr,
            },
        });
    };
    const updateSessionState = update => {
        session.state = session.state.merge(update);
        let sessionStr = JSON.stringify(session);
        saveSession({
            variables: {
                session: sessionStr,
            },
        });
    };

    const qstate = {
        session: session?.sessionGet,
        channel: channel
            ? channel.storeGetChannel
            : { channelSlug: newslineSlug, newslineSlug },
        user: user?.storeGetUser,

        actions: {
            saveUserLayout,
            saveSession,
            updateSessionOption,
            updateSessionState,
            setThemeDark,
        },
    };
    // setTimeout(async () => await setMeta({ title: "Qwiket" }), 0);
    // console.log("qparams:", qparams);
    width =
        typeof window !== "undefined" && window.innerWidth
            ? window.innerWidth
            : width;
    // console.log("WIDTH===>", width);
    return (
        <ResponsiveContext.Provider value={{ width }}>
            <Layout qparams={qparams} qstate={qstate}>
                <LayoutView width={width} />
            </Layout>
        </ResponsiveContext.Provider>
    );

    /*return (
        <div>
            CHANNEL:{JSON.stringify(channel)}
            <br />
            USER:{JSON.stringify(user)}
            <br />
            SESSION:{JSON.stringify(session)}
        </div>
    );*/
    /* return (
        <div>
            <Qwikets
                qparams={qparams}
                qstate={qstate}
                selector={"newsline"}
                queueid={"ppd"}
            />
            <div>
                CHANNEL:{JSON.stringify(channel)}
                <br />
                USER:{JSON.stringify(user)}
                <br />
                SESSION:{JSON.stringify(session)}
            </div>
        </div>
    );*/
};
const Container = styled.div`
    width: 960px;
    height: 100vh;
    margin: 2rem auto;
    padding: 2rem;
    background: #f2f2f2;
`;
Channel.getInitialProps = ({
    query,
    setThemeDark,
    req,
    dark,
    meta,
    setMeta,
}) => {
    let width = 600;
    if (req) {
        let ua = req.headers["user-agent"];
        console.log({ ua });
        const bowser = Bowser.getParser(
            ua
                ? ua
                : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
        );

        const platformType = bowser.getPlatformType();
        console.log("USER AGENT", ua, { platformType });
        switch (platformType) {
            case "tablet":
                width = 900;
                break;
            case "desktop":
                width = 1200;
        }
    }
    return {
        qparams: query,
        setThemeDark,
        setMeta,
        dark,
        meta,
        width: req
            ? width
            : typeof window !== "undefined"
            ? window.innerWidth
            : 0,
    };
};
export default withApollo({ ssr: true })(Channel);
