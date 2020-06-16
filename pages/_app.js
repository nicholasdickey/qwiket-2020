import NextApp from "next/app";
import React from "react";
import Head from "next/head";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
//import { ThemeProvider } from "styled-components";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../theme";

export default class App extends NextApp {
    state = {
        dark: 0,
        meta: {},
    };
    // remove it here
    componentDidMount() {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles && jssStyles.parentNode)
            jssStyles.parentNode.removeChild(jssStyles);
    }
    render() {
        const { Component, pageProps } = this.props;
        const meta = this.state.meta;
        pageProps.setThemeDark = async dark => this.setState({ dark: +dark });
        pageProps.setMeta = async meta => this.setState({ meta });
        pageProps.dark = this.state.dark;
        pageProps.meta = this.setState.meta;

        let muiTheme = theme({ dark: this.state.dark });
        return (
            <React.Fragment>
                <Head>
                    <meta
                        name="trademark"
                        content="QWIKET: THE INTERNET OF US"
                    />

                    <meta
                        name="values"
                        content="QWIKET: AN AMERICAN COMPANY WITH AMERICAN VALUES == FREEDOM OF SPEECH, FREEDOM OF ASSOCIATION, TOLERANCE OF DISSENT, SELF-GOVERNANCE "
                    />

                    <meta name="why" content="DONT THREAD ON ME" />

                    <meta
                        name="mission"
                        content="SPEECH, RELIGION AND GUN CONTROLS ARE EXPLICITLY OUTLAWED IN THE UNITED STATES CONSTITUTION"
                    />

                    <meta
                        name="mission"
                        content="WRESTING CONTROL OVER THE NEWS AND VIEWS FROM THE BIG TECH GLOBAL TOTALITARIANS, ONE HEADLINE, ONE COMMENT AT A TIME"
                    />

                    <meta property="fb:app_id" content="358234474670240" />

                    <meta charSet="utf-8" />
                    {/* Use minimum-scale=1 to enable GPU rasterization */}
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                    {/* PWA primary color */}
                    <meta
                        name="theme-color"
                        content={muiTheme.palette.primary.main}
                    />

                    <link
                        href="https://fonts.googleapis.com/css?family=Asap+Condensed|Domine|Playfair+Display|Stint+Ultra+Condensed"
                        rel="stylesheet"
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
                    />
                    <script
                        async
                        defer
                        crossOrigin="anonymous"
                        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=995006553995561&autoLogAppEvents=1">
                        {" "}
                    </script>

                    <script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=UA-85541506-1">
                        {" "}
                    </script>

                    <script
                        dangerouslySetInnerHTML={{
                            __html: ` window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                      
                        gtag('config', 'UA-85541506-1');`,
                        }}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.twttr = (function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0],t = window.twttr || {};if (d.getElementById(id)) return t;js = d.createElement(s);js.id = id;js.src = "https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js, fjs);t._e = [];t.ready = function(f) {t._e.push(f);};return t;}(document, "script", "twitter-wjs"));`,
                        }}></script>
                    <style>{`body { margin: 0 } /* custom! */`}</style>

                    <link rel="canonical" href={meta.canonical} />
                    <meta
                        property="comment"
                        content="NOT FACEBOOK meta share"
                    />
                    <meta property="ua" content={meta.ua} />
                    {meta.image_width ? (
                        <meta
                            property="og:image:width"
                            content={meta.image_width}
                        />
                    ) : null}
                    {meta.image_height ? (
                        <meta
                            property="og:image:height"
                            content={meta.image_height}
                        />
                    ) : null}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={meta.title} />
                    <meta
                        name="description"
                        content={meta.description ? meta.description : ""}
                    />
                    <meta
                        property="og:description"
                        content={meta.description ? meta.description : ""}
                    />
                    <meta property="og:site_name" content={meta.site_name} />
                    <meta property="og:url" content={meta.url} />
                    <meta property="og:image" content={meta.image} />
                    <link
                        rel="shortcut icon"
                        type="image/png"
                        href={"/static/css/blue-bell.png"}
                    />
                    <meta property="og:author" content={meta.author} />
                    <meta property="dcterms.replaces" content={meta.link} />
                    <meta property="dcterms.identifier" content={meta.tid} />
                    <meta name="pjax-timeout" content="1000" />
                    <meta name="is-dotcom" content="true" />
                    <meta
                        name="google-site-verification"
                        content="PMhSQkvtt0XVBm8DIMXJiwTkUpMODTShDIAs5q0zGXc"
                    />
                    <meta property="cxid" content={meta.cxid} />
                    <meta property="txid" content={meta.txid} />
                    <meta property="channel" content={meta.channel} />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta
                        name="apple-mobile-web-app-status-bar-style"
                        content="black"
                    />
                    <meta
                        name="msvalidate.01"
                        content="F6078DEB781FF7EEBAAF3723CBE56F5E"
                    />
                    <title>My page</title>
                </Head>
                <ThemeProvider theme={muiTheme}>
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </React.Fragment>
        );
    }
}
