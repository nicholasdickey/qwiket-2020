import React, { useState } from "react";

import styled from "styled-components";
import Link from "next/link";

import { useTheme } from "@material-ui/core/styles";
import StarOutline from "mdi-material-ui/StarOutline";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import navMenu from "../lib/navMenu";
import { ClickWalledGarden } from "../lib/walledGarden";

import indigo from "@material-ui/core/colors/indigo";

import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";
import blueGrey from "@material-ui/core/colors/blueGrey";
import teal from "@material-ui/core/colors/teal";
import cyan from "@material-ui/core/colors/cyan";
import FilledStar from "mdi-material-ui/Star";
import { route } from "../lib/qwiketRouter";

import { LayoutSwitch } from "./widgets/layoutSwitch.js";
const TitleBand = ({ title, leftLogo, rightLogo, link }) => {
    const muiTheme = useTheme();
    const backgroundColor = muiTheme.palette.background.default;
    const color = muiTheme.palette.text.primary;
    const StyledWrapper = styled.div`
        display: flex;
        width: 100%;
        align-items: center;
        font-family: Playfair Display !important;
        justify-content: center;
        font-size: 2rem;
        @media (max-width: 749px) {
            display: none;
        }
        & a {
            cursor: pointer;
            text-decoration: none;
            color: ${color};
        }
    `;
    const Logo = styled(props => {
        return <img {...props} />;
    })`
        width: 60px;
        height: 60px;
        margin-left: 30px;
        margin-right: 30px;
        @media (min-width: 900px) {
            width: 40px;
            height: 40px;
        }
        @media (min-width: 1000px) {
            width: 50px;
            height: 50px;
        }

        @media (max-width: 1200px) {
            width: 60px;
            height: 60px;
        }
        @media (max-width: 1800px) {
            width: 90px;
            height: 90px;
        }
        @media (min-width: 1800px) {
            width: 120px;
            height: 120px;
        }
        @media (min-width: 2100px) {
            width: 140px;
            height: 140px;
        }
    `;
    const Title = styled.div`
        font-size: 2rem;
        text-align: center;
        padding-bottom: 10px;

        margin-left: 30px;
        margin-right: 30px;
        @media (min-width: 900px) {
            font-size: 2.2rem;
        }
        @media (min-width: 1000px) {
            font-size: 2.7rem;
        }
        @media (min-width: 1200px) {
            font-size: 3.7rem;
        }
        @media (min-width: 1400px) {
            font-size: 4.5rem;
        }
        @media (min-width: 1800px) {
            font-size: 5.4rem;
        }
        @media (min-width: 2100px) {
            font-size: 6rem;
        }
    `;

    return (
        <StyledWrapper>
            <Logo src={leftLogo} />{" "}
            <Title>
                <Link href={link.href} as={link.as}>
                    <a>{title.toUpperCase()}</a>
                </Link>
            </Title>
            {rightLogo ? <Logo src={rightLogo} /> : null}
        </StyledWrapper>
    );
};

const DatelineBand = ({
    layout,
    pageType,
    qparams,
    qstate,
    session,
    channel,
    user,
    actions,
    ...other
}) => {
    let dark = +session?.dark;
    const muiTheme = useTheme();
    const backgroundColor = muiTheme.palette.background.default;
    const color = muiTheme.palette.text.primary;
    //  console.log("DATELINE BAND", { user });
    const linkColor = muiTheme.palette.linkColor;
    let subscr_status = +user?.subscr_status;
    if (!subscr_status) subscr_status = 0;
    //  console.log({ subscr_status });
    let starColor = green[700];
    switch (subscr_status) {
        case 1:
            starColor = green[700];
            break;
        case 2:
            //  console.log("subscr_status=2")
            starColor = indigo[900];
            break;
        case 3:
            starColor = blueGrey[200];
            break;
        case 4:
            starColor = amber[900];
            break;
        case 5:
            starColor = red[900];
    }

    const StyledWrapper = styled.div`
        display: flex;
        width: 100%;
        align-items: center;
        font-family: Playfair Display !important;
        justify-content: center;
        font-size: 1.8rem;
        @media (max-width: 749px) {
            display: none;
        }
        & a {
            cursor: pointer;
            text-decoration: none;
            color: ${color};
        }
        & a:hover {
            font-weight: 500;
            color: ${linkColor};
        }
    `;

    const HorizWrap = styled.div`
        display: flex;
        justify-content: center;
        margin-left: 40px;
        margin-right: 40px;
    `;
    const SubTitle = styled.div`
        font-size: 1.4rem;
        text-align: center;
        margin-left: 10px;
        margin-right: 10px;
        @media (min-width: 1200px) {
            font-size: 1.3rem;
        }
        @media (min-width: 1400px) {
            font-size: 1.4rem;
        }
        @media (min-width: 1800px) {
            font-size: 1.5rem;
        }
        @media (min-width: 2100px) {
            font-size: 1.6rem;
        }
    `;
    const SubscriberStar = styled((...props) => (
        <FilledStar
            style={{ color: starColor, marginTop: -4, marginLeft: 4 }}
            {...props}
        />
    ))``;
    const AvatarGroup = styled.div`
        display: flex;
        align-items: flex-begin;
    `;
    let channelConfig = channel.config;
    let hometown = channelConfig?.hometown || "HOMELESS";

    let channelSlug = channel.channelslug;
    //console.log("CHANNEL:", channelSlug);
    let date = new Date();
    let dateStrging = date.toDateString();
    let name = user?.userName;
    let approver = user?.approver;
    let avatar = user?.avatar;
    let userLayout = user?.config?.userLayout;

    let isLoggedIn = name ? true : false;
    /* console.log("user userLayout", {
        user,
        name,
        avatar,
        userLayout,
        isLoggedIn,
    }); */

    let LayoutSwitchWrap = styled.div`
        display: none;
        & @media(min-width:900px) {
            display: flex;
        }
    `;
    return (
        <div>
            <StyledWrapper>
                <HorizWrap>
                    <SubTitle>{`${dateStrging}  ${hometown}`}</SubTitle>
                </HorizWrap>
                {isLoggedIn ? (
                    <HorizWrap>
                        <AvatarGroup>
                            <img src={avatar} width={32} height={32} />
                            {subscr_status > 0 ? <SubscriberStar /> : null}
                        </AvatarGroup>
                    </HorizWrap>
                ) : null}

                {!isLoggedIn ? (
                    <ClickWalledGarden
                        qparams={qparams}
                        qstate={qstate}
                        login={true}
                        placeHolder={
                            <SubTitle>
                                <a>Sign In</a>&nbsp; Subscribe
                            </SubTitle>
                        }
                    />
                ) : (
                    <div>
                        <HorizWrap>
                            <SubTitle>
                                <a
                                    onClick={() => {
                                        console.log("sign out:");
                                        qstate.actions.userLogout();
                                    }}>
                                    Sign Out
                                </a>
                            </SubTitle>
                            {!approver ? <SubTitle>|</SubTitle> : null}
                            <SubTitle>
                                {" "}
                                {`${
                                    isLoggedIn
                                        ? approver
                                            ? "[" + name + "]"
                                            : name
                                        : "Subscribe"
                                }`}
                            </SubTitle>
                        </HorizWrap>
                    </div>
                )}
            </StyledWrapper>{" "}
            <HorizWrap>
                <LayoutSwitch
                    layout={layout}
                    pageType={pageType}
                    qparams={qparams}
                    userLayout={userLayout}
                    channelConfig={channelConfig}
                    actions={actions}
                    {...other}
                />
            </HorizWrap>
        </div>
    );
};

const DesktopNavigation = ({ qparams, qstate }) => {
    let { session, channel, actions } = qstate;
    //  if (Root.qparams) qparams = Root.qparams;
    // console.log("CHANNEL:::", JSON.stringify(channel), null, 4);
    let { dark } = session ? session.options : {};
    const muiTheme = useTheme();
    const backgroundColor = muiTheme.palette.background.default;
    const color = muiTheme.palette.text.primary;
    // console.log(JSON.stringify({ palette: muiTheme.palette }, null, 4));
    const linkColor = dark
        ? muiTheme.palette.linkColor.dark
        : muiTheme.palette.linkColor.light;
    const NavigationWrapper = styled.div`
        display: flex;
        margin: 10px;
        width: 100%;
        align-items: center;
        font-family: Playfair Display !important;
        justify-content: center;
        font-size: 1.8rem;
        @media (max-width: 749px) {
            display: none;
        }
        & a {
            text-decoration: none;
            color: ${color};
        }
        & a:hover {
            font-weight: 500;
            color: ${linkColor};
        }
    `;

    const MenuEntry = ({ name, v10Link, gap, subMenu }) => {
        let [anchorEl, setAnchorEl] = useState(0);

        const StyledItem = styled.div`
            font-family: Asap Condensed;
            font-weight: 500;
            font-size: 1.4rem;
            text-align: center;
            margin-left: ${gap ? `60px` : `20px`};
            margin-right: 20px;
            @media (min-width: 1200px) {
                font-size: 1.6rem;
            }
            @media (min-width: 1400px) {
                font-size: 1.7rem;
            }
            @media (min-width: 1800px) {
                font-size: 1.8rem;
            }
            @media (min-width: 2100px) {
                font-size: 1.9rem;
            }
            cursor: pointer;
        `;
        if (!subMenu)
            return (
                <StyledItem>
                    <Link href={v10Link.href} as={v10Link.as}>
                        <a data-id="menu-anchor">{name}</a>
                    </Link>
                </StyledItem>
            );
        //  console.log({ subMenu, anchorEl })
        const handleClose = target => {
            setAnchorEl(null);
        };
        let keys = Object.keys(subMenu);
        let rows = keys.map(key => {
            v10Link = route({
                nextRoute: "newsline-channel",
                routeParams: {
                    channel: key,
                },
            });
            // let link = `/channel?channel=${key}`;
            // let as = `/channel/${key}`;
            let StyledLink = styled.a`
                text-decoration: none;
                color: ${color};
                :hover {
                    //text-decoration:underline;
                    color: ${linkColor};
                }
            `;
            return (
                <MenuItem
                    key={`navmenu-${key}`}
                    onClick={() => handleClose(key)}>
                    <Link href={v10Link.href} as={v10Link.as}>
                        <a>
                            <StyledLink>{subMenu[key]}</StyledLink>
                        </a>
                    </Link>
                </MenuItem>
            );
        });
        const Item = () => (
            <StyledItem>
                <a>{name}</a>
            </StyledItem>
        );
        // console.log("RENDER MenuEntry");
        return (
            <div
                onClick={event => {
                    // console.log("onClick", { anchorEl })
                    if (anchorEl) setAnchorEl(false);
                    else {
                        let anchor = event.currentTarget;
                        // console.log("opening menu", anchor);
                        setAnchorEl(anchor);
                    }
                }}>
                <Item />
                <Menu
                    id="section-sub-menu"
                    anchorEl={anchorEl}
                    //keepMounted
                    elevation={8}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    {rows}
                </Menu>
            </div>
        );
    };
    let menu = navMenu({ config: channel.config });
    menu["find"] = "Find";
    menu["channels"] = "Channels";
    menu["lacantina"] = "La Cantina";
    let keys = Object.keys(menu);
    //const router = useRouter();
    //console.log({ router, Root })
    let channelSlug = channel.channelSlug;
    let lacantinaSlug = channel.config
        ? channel.config.lacantinaSlug
        : "lacantina";
    /*console.log(
        "lacantinaSlug:",
        JSON.stringify(channel, null, 4),
        lacantinaSlug
    ); */
    //let asPath = router.asPath;

    let items = keys.map((key, i) => {
        let subMenu = navMenu({
            config: channel.config,
            toplevel: key,
        });

        // let link = '';
        // let as = '';
        let v10Link;
        let gap = false;
        if (key == "home") {
            v10Link = route({
                nextRoute: "newsline-channel",
                routeParams: {
                    channel: channelSlug,
                },
            });
            // link = `/channel?channel=${channelDetails.get("shortname")}`;
            // as = `/channel/${channel}`;
        } else if (key == "find") {
            v10Link = route({ sel: qparams.sel, qparams, nextParams: {} });
            v10Link.href.query.find = "1";
            v10Link.as += "?find=1";
            gap = true;
        } else if (key == "lacantina") {
            v10Link = route({
                nextRoute: "context-channel-tag-topic",
                routeParams: {
                    channel: channelSlug,
                    threadid: lacantinaSlug,
                    tag: channel.channelSlug,
                },
            });
        } else if (subMenu) {
        } else {
            v10Link = route({
                nextRoute: "newsline-channel",
                routeParams: {
                    channel: key,
                },
            });
        }
        // console.log("Menu:", { name: menu[key], link, as })
        return (
            <MenuEntry
                key={`NavmenuItems - ${i} `}
                name={menu[key]}
                v10Link={v10Link}
                gap={gap}
                subMenu={subMenu}
            />
        );
    });
    //  console.log({ menu })

    return <NavigationWrapper>{items}</NavigationWrapper>;
};
const Lowline = ({ session }) => {
    let hasBand = +session?.band;
    const OuterWrapper = styled.div`
        margin-left: 4px;
        margin-right: 4px;
    `;
    const LowlineWrapper = styled.div`
        display: flex;
        margin-top: 10px;

        border-top: thin solid grey;
        height: 30px;
        border-bottom: ${hasBand == 1 ? null : "thin solid grey"};
        width: 100%;
        align-items: center;
        font-family: Roboto;
        justify-content: center;
        font-size: 0.9rem;
        @media (max-width: 749px) {
            display: none;
        }
    `;
    const VerticalTablet = styled.div`
        display: none;
        @media (min-width: 900px) {
            display: flex;
        }
        @media (min-width: 1199px) {
            display: none;
        }
    `;
    const HorizontalTablet = styled.div`
        display: none;
        @media (min-width: 1200px) {
            display: flex;
        }
        @media (min-width: 1799px) {
            display: none;
        }
    `;
    const SmallDesktop = styled.div`
        display: none;
        @media (min-width: 1800px) {
            display: flex;
        }
        @media (min-width: 2100px) {
            display: none;
        }
    `;
    const LargeDesktop = styled.div`
        display: none;
        @media (min-width: 2100px) {
            display: flex;
        }
    `;
    const Stars = styled.div`
        flex-shrink: 0;
        width: 60px;
        margin-right: 30px;
        margin-left: 30px;
    `;
    const Star = styled((...props) => (
        <StarOutline style={{ marginLeft: 10, fontSize: 10 }} {...props} />
    ))`
        font-size: 10px;
        margin-left: 10px;
        color: red;
    `;
    //console.log("RENDER LOWLINE");
    return (
        <OuterWrapper>
            <LowlineWrapper>
                <Stars>
                    <Star />
                    <Star />
                    <Star />
                </Stars>
                <VerticalTablet>
                    The go-to-site for the news WE read. Contact:
                    support@qwiket.com
                </VerticalTablet>
                <HorizontalTablet>
                    The go-to-site for the news WE read. : Created and operated
                    in USA. Contact: support@qwiket.com
                </HorizontalTablet>
                <SmallDesktop>
                    QWIKET.COM: The go-to-site for the news WE read : Made in
                    USA - with love. Contact: support@qwiket.com: The Internet
                    of Us™ : QWIKET.COM
                </SmallDesktop>
                <LargeDesktop>
                    QWIKET.COM: The go-to-site for the news WE read : Made in
                    USA - with love. Contact: support@qwiket.com,
                    ads@qwiket.com, invest@qwiket.com, copyright@qwiket.com :
                    The Internet of Us™ : QWIKET.COM
                </LargeDesktop>
                <Stars>
                    <Star />
                    <Star />
                    <Star />
                </Stars>
            </LowlineWrapper>
        </OuterWrapper>
    );
};

let Header = ({ pageType, layout, qparams, qstate, ...other }) => {
    // if (Root.qparams) qparams = Root.qparams;
    let { channel, user, session, actions } = qstate;
    let {
        newslineSlug,
        channelSlug,
        newslineDisplayName,
        newslineLogo,
        config,
    } = channel ? channel : {};
    //console.log("RENDER HEADER actions", actions);
    //  console.log({ newsline: newsline.toJS(), session: session.toJS() })
    const StyledHeader = styled.div`
        width: 100%;
    `;
    //  if (Root.qparams) qparams = Root.qparams;
    let v10Link = route({
        nextRoute: "newsline-channel",
        routeParams: {
            channel: channelSlug,
        },
    });
    //  console.log("RENDER HEADER newslineLogo:", newslineLogo);
    return (
        <StyledHeader>
            <TitleBand
                link={v10Link}
                title={`${
                    newslineSlug != channelSlug ? `${config.shortname}:` : ""
                }${
                    newslineDisplayName
                        ? newslineDisplayName
                        : "Prepare to Jibe"
                }`}
                leftLogo={config ? config.logo : "/img/blue-bell.png"}
                rightLogo={newslineLogo ? newslineLogo : "/img/blue-bell.png"}
            />
            <DatelineBand
                layout={layout}
                pageType={pageType}
                qparams={qparams}
                qstate={qstate}
                session={session}
                user={user}
                channel={channel}
                actions={actions}
                {...other}
            />
            <DesktopNavigation
                url={qparams.url}
                qparams={qparams}
                qstate={qstate}
            />
            <Lowline session={session} />
        </StyledHeader>
    );
};

export default Header;
