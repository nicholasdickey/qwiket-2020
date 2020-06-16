import React, { useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";

import styled from "styled-components";
import { useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import LinkPlus from "mdi-material-ui/LinkPlus";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Toggle from "@material-ui/core/Switch";
import red from "@material-ui/core/colors/red";

var Markdown = require("react-markdown");
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { route } from "../qwiket-lib/lib/qwiketRouter";
i; //mport u from "../qwiket-lib/lib/utils";
let RenderHotlist = React.memo(({ width, layoutView, channel, queue }) => {
    const StyledWrapper = styled.div`
        display: flex;
        width: 100%;
        align-items: center;
        font-family: Playfair Display !important;
        justify-content: center;
        font-size: 0.9rem;
        @media (max-width: 749px) {
            display: none;
        }
    `;
});

export let HotItem = React.memo(
    ({ width, item, loud, theme, wrapper, channel }) => {
        // a.k.a context main panel
        let title = item.get("title");
        let image = item.get("image");
        let site_name = item.get("site_name");

        let empty = "";
        let nextRoute = "context-channel-hub-tag-topic";

        let { qwiketid, hub, tag } = u.parseQwiketid(item);
        let routeParams = hub
            ? {
                  threadid: qwiketid,
                  hub,
                  tag,
                  channel,
              }
            : {
                  threadid: qwiketid,

                  tag,
                  channel,
              };
        if (!hub) nextRoute = "context-channel-tag-topic";
        let link = route({
            nextRoute,
            routeParams,
            sel: "context",
        });
        // console.log("RENDER HOTITEM", { width, title: item.get("title"), routeParams, link })

        const StyledGridListTile = styled(({ ...other }) => (
            <GridListTile {...other} />
        ))`
            width: ${width};
            height: ${loud ? "146px" : "84px"} !important;
            background-color: #000 !important;

            @media (max - width: 749px) {
                display: none;
            }
            & .q-hl-title {
                height: 60px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: normal;
            }
            & .q-hl-image {
                object-fit: cover;
                max-width: 100%;
                max-height: 100%;
                opacity: 0.8;
                background-color: #000;
            }
            & .q-hl-tile-title {
                color: #fff;
                font-size: 1.4rem !important;
                margin-top: 2px;
            }

            & .q-hl-title-bar {
                height: 94px !important;
                padding: 3px !important;
                color: #fff !important;
                background: ${loud
                    ? "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
                    : theme == 1
                    ? "#888"
                    : "#222"} !important;
            }
            & .q-hl-tile-root {
                margin: 0px !important;

                height: ${loud ? "146px" : "94px"} !important;
                background-color: #222 !important;
            }
            u {
                list-style-type: none;
            }
            & .q-hl-color {
                color: #fff !important;
                text-overflow: ellipsis !important;
                overflow: hidden !important;
                white-space: normal !important;
                padding-top: 4px !important;
                font-family: roboto;
                font-size: 0.9rem;
                line-height: 1.5rem;
                font-weight: 400;
                max-height: 58px !important;
            }
            & .q-hl-site {
                border-top: 1px solid white !important;
                color: #fff !important;
                text-overflow: ellipsis !important;
                overflow: hidden !important;
                white-space: normal !important;
                font-family: roboto;
                font-size: 0.9rem !important;
                padding-bottom: 4px !important;
                padding-top: 4px;
                height: 20px;
            }
            & .q-hl-link-wrap {
                color: #fff;

                text-overflow: ellipsis;
                overflow: hidden;
                white-space: normal;
                padding-right: 4px;
                max-height: 48px;
            }

            & .q-hl-subtitle {
                font-size: 0.8rem;

                padding-bottom: 8px;
                margin-bottom: 0px;
                height: 18px;
            }
            & .q-hl-media {
                background-color: #000;
            }
        `;

        return (
            <StyledGridListTile
                key={wrapper.key}
                rowIndex={wrapper.rowIndex}
                ref={wrapper.ref}
                lastRow={wrapper.lastRow}
                firstRow={wrapper.firstRow}
                // style={{backgroundColor:theme?'#222':'#222'}}
                classes={{
                    root: "q-hl-tile-root",
                }}>
                <div className="q-hl-media">
                    {loud ? (
                        <Link href={link.href} as={link.as}>
                            <a>
                                <img
                                    className="q-hl-image"
                                    src={
                                        empty || !loud
                                            ? "/static/css/qwiket-top-logo.png"
                                            : image
                                    }
                                />
                            </a>
                        </Link>
                    ) : null}
                </div>
                <GridListTileBar
                    title={
                        <div className="q-hl-title">
                            <b>
                                <Link href={link.href} as={link.as}>
                                    <a>
                                        <div
                                            variant="caption"
                                            className="q-hl-color">
                                            {title}
                                        </div>
                                    </a>
                                </Link>
                            </b>
                        </div>
                    }
                    subtitle={
                        <div className="q-hl-subtitle">
                            <Link href={link.href} as={link.as}>
                                <a>
                                    <div className="q-hl-site">{site_name}</div>
                                </a>
                            </Link>
                        </div>
                    }
                    classes={{
                        root: "q-hl-title-bar",
                    }}
                />
            </StyledGridListTile>
        );
        // return <div style={{ width, height: 30 }}>{title}</div>
    }
);
export let Hotlist = React.memo(({ rows, spaces, loud }) => {
    // a.k.a context main panel
    const StyledWrapper = styled.div`
        width: 100%;
        padding: 4px;

        margin-bottom: 10px;
        font-size: 0.9rem;
        @media (max-width: 749px) {
            display: none;
        }
        & .q-grid-list {
            width: 100%;
            height: ${loud ? "146px" : "84px"} !important;
        }
    `;
    rows = rows.slice(0, spaces);
    //  console.log("Hotlist render", { rows, spaces })
    return (
        <StyledWrapper>
            {" "}
            <GridList cols={spaces} className="q-grid-list">
                {rows}
            </GridList>
        </StyledWrapper>
    );
});
