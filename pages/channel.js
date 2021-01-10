import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import update from "immutability-helper";
import Bowser from "bowser";
import withApollo from "../lib/apollo";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
var debounce = require("lodash.debounce");
import Layout from "../lib/layout";
import LayoutView from "../components/layoutView";
import { Context as ResponsiveContext } from "react-responsive";
import Qwikets from "../components/columns/qwikets";
import u from "../lib/utils";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
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

const GET_SESSION = gql`
    query userGetSession($newslineSlug: String) {
        userGetSession(newslineSlug: $newslineSlug) {
            options {
                loud
                thick
                dense
                dark
                band
            }
            state
            user {
                config
                slug
                userName
                subscrStatus
                avatar
            }
        }
    }
`;
const SAVE_USER_CONFIG = gql`
    mutation userSaveUserConfig($config: String) {
        userSaveUserConfig(config: $config)
    }
`;
const SAVE_SESSION_OPTIONS = gql`
    mutation sessionSaveOptions($options: String) {
        sessionSaveOptions(options: $options)
    }
`;
const SAVE_SESSION_STATE = gql`
    mutation sessionSaveState($state: String) {
        sessionSaveState(state: $state)
    }
`;
const USER_LOGOUT = gql`
    mutation userLogout {
        userLogout
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
    & .backdrop {
        opacity: 0.2;
    }
    opacity: 0.7;
    background-color: #000;
`;

const QwiketViewWrap = styled.div`
    width: 20%;
`;

const Channel = ({ qparams, setThemeDark, setMeta, dark, meta, width }) => {
    const [dimensions, setDimensions] = React.useState({
        width: 0,
    });
    const [isLoggingIn, setIsLoggingIn] = React.useState(0);
    let { channel: newslineSlug } = qparams;
    const { error: channelError, data: channel } = useQuery(GET_CHANNEL, {
        variables: { ns: newslineSlug },
        notifyOnNetworkStatusChange: true,
        onCompleted: data => {
            // console.log("completed GET_CHANNEL", data);
        },
    });
    React.useEffect(() => {
        let handleResize = debounce(() => {
            if (
                typeof window != "undefined" &&
                dimensions.width != window.innderWidth
            )
                setDimensions({
                    width: window.innerWidth,
                });
        }, 1000);

        window.addEventListener("resize", handleResize);
    });

    const {
        error: sessionError,
        data: session,
        refetch: refetchSession,
    } = useQuery(GET_SESSION, {
        notifyOnNetworkStatusChange: true,
        onCompleted: data => {
            let session = data.userGetSession;
            if (session && session.options && session.options.dark != dark) {
                console.log("SETTING DARK THEME", session.options.dark);
                setThemeDark({ dark: session.options.dark });
            }
            console.log("=============>completed GET_SESSION", {
                dark,
                data,
                session,
            });
        },
        variables: { newslineSlug },
    });
    const [userLogout, { error: userLogoutError }] = useMutation(USER_LOGOUT, {
        onCompleted: data => {
            //  refetchUser();
            // console.log("saveUserConfig completed");
        },
        refetchQueries: [{ query: GET_SESSION, variables: { newslineSlug } }],
    });
    const [saveUserConfig, { error: saveUserConfigError }] = useMutation(
        SAVE_USER_CONFIG,
        {
            onCompleted: data => {
                //  refetchUser();
                // console.log("saveUserConfig completed");
            },
            refetchQueries: [
                { query: GET_SESSION, variables: { newslineSlug } },
            ],
        }
    );
    const [saveSessionOptions, { error: saveSessionOptionError }] = useMutation(
        SAVE_SESSION_OPTIONS,
        {
            refetchQueries: [
                { query: GET_SESSION, variables: { newslineSlug } },
            ],
        }
    );
    const [saveSessionState, { error: saveSessionSaveError }] = useMutation(
        SAVE_SESSION_STATE,
        {
            refetchQueries: [
                { query: GET_SESSION, variables: { newslineSlug } },
            ],
        }
    );

    const qstate = {
        session: session?.userGetSession,
        channel: channel
            ? channel.storeGetChannel
            : { channelSlug: newslineSlug, newslineSlug },
        user: session?.userGetSession.user,
    };
    /// console.log("qstate1:", qstate);
    if (qstate.session && typeof qstate.session.state === "string")
        qstate.session.state = JSON.parse(qstate.session.state);
    if (qstate.user) {
        // console.log("qstate.user:", qstate.user);
    }
    if (
        qstate.user &&
        qstate.user.config &&
        typeof qstate.user.config === "string"
    ) {
        // console.log("parsing config", qstate.user.config);
        qstate.user.config = JSON.parse(qstate.user.config);
    }
    if (
        qstate.channel &&
        qstate.channel.config &&
        typeof qstate.channel.config.layout === "string"
    ) {
        qstate.channel.config.layout = JSON.parse(qstate.channel.config.layout);
    }
    if (
        qstate.channel &&
        qstate.channel.config &&
        typeof qstate.channel.config.definedTags === "string"
    ) {
        qstate.channel.config.definedTags = JSON.parse(
            qstate.channel.config.definedTags
        );
    }
    if (
        qstate.channel &&
        qstate.channel.config &&
        typeof qstate.channel.config.newslines === "string"
    ) {
        qstate.channel.config.newslines = JSON.parse(
            qstate.channel.config.newslines
        );
    }
    if (
        qstate.channel &&
        qstate.channel.config &&
        typeof qstate.channel.config.selectors === "string"
    ) {
        qstate.channel.config.selectors = JSON.parse(
            qstate.channel.config.selectors
        );
    }
    // console.log("qparams:", qparams, "qstate:", qstate);
    const updateSessionOption = update => {
        let sessionRoot = qstate.session;
        //  console.log("dark: updateSessionOption", sessionRoot);
        sessionRoot.options = { ...sessionRoot.options, ...update };
        let optionsStr = JSON.stringify(sessionRoot.options);
        qstate.session.options = sessionRoot.options;
        saveSessionOptions({
            variables: {
                options: optionsStr,
            },
        });
        /*  console.log("dark: updateSessionOption", {
            dark,
            newDark: sessionRoot.options.dark,
            sessionRoot,
            setThemeDark,
        });*/
        if (sessionRoot.options.dark != dark)
            setThemeDark(sessionRoot.options.dark);
    };
    const updateSessionState = async updateState => {
        let newState = update(qstate.state || {}, updateState);
        let stateStr = JSON.stringify(newState);
        /* console.log(
            "!!!!!!!!!!!!!!!!!updateSessionState",
            updateState,
            stateStr
        );*/
        await saveSessionState({
            variables: {
                state: stateStr,
            },
        });
    };
    const updateUserConfig = updateUserConfig => {
        let newConfig = update(qstate.user.config || {}, updateUserConfig);
        let configStr = JSON.stringify(newConfig);
        saveUserConfig({
            variables: {
                config: configStr,
            },
        });
    };

    qstate.actions = {
        updateUserConfig,
        updateSessionOption,
        updateSessionState,
        setThemeDark,
        setIsLoggingIn,
        userLogout,
    };

    // setTimeout(async () => await setMeta({ title: "Qwiket" }), 0);
    // console.log("qparams:", qparams);
    width =
        typeof window !== "undefined" && window.innerWidth
            ? window.innerWidth
            : width;
    /* console.log("WIDTH1===>", {
        innerWidth: window?.innerWidth,
        width,
        isLoggingIn,
        typeof: window !== "undefined",
    });*/
    width = u.getLayoutWidth({ width });
    /* console.log("WIDTH===>", {
        innerWidth: window?.innerWidth,
        width,
        isLoggingIn,
        typeof: window !== "undefined",
    }); */
    /*  if (
        qstate &&
        qstate.session &&
        qstate.session.state &&
        qstate.session.state.loginRedirect
    ) {
        qstate.actions.updateUserConfig({
            logginIn: { $set: 0 },
            loginRedirect: {
                $set: "",
            },
        });

        window.location = qstate.session.state.loginRedirect;
        <div>Redirecting...</div>;
    }
    */
    /* if (qstate.session && qstate.session.options.dark != dark) {
        console.log("setThemeDark", qstate.session.options.dark);
        //setThemeDark(qstate.session.options.dark);
    }*/
    return (
        <ResponsiveContext.Provider value={{ width }}>
            <PageWrap>
                <Backdrop
                    className={"backdrop"}
                    open={isLoggingIn == 1 ? true : false}
                    // onClick={handleClose}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </PageWrap>
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
        // console.log({ ua });
        const bowser = Bowser.getParser(
            ua
                ? ua
                : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
        );

        const platformType = bowser.getPlatformType();
        //console.log("USER AGENT", ua, { platformType });
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
