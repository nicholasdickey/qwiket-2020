import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import yellow from "@material-ui/core/colors/yellow";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";
import indigo from "@material-ui/core/colors/indigo";
import grey from "@material-ui/core/colors/grey";
import blueGrey from "@material-ui/core/colors/blueGrey";
import blue from "@material-ui/core/colors/blue";
import $ from "jquery";
import Dots from "mdi-material-ui/DotsHorizontal";
import u from "../../lib/utils";
import Qwiket from "./qwiket";
class QwiketContainer extends Component {
    componentDidMount = () => {
        // console.log("componentDidMount Enter", this.props.id);
        let el = ReactDOM.findDOMNode(this);
        let domRect = el.getBoundingClientRect();
        /*  console.log("handle componentDidMount", {
            queueid: this.props.queueid,
        });*/
        let j = $(el);
        let offset = j.offset();
        u.unregisterEvents("bottomScroll", this.props.queueid);
        u.registerEvent("bottomScroll", this.props.fetchNextPage, {
            me: this.props.queueid,
            y: offset ? offset.top : 0,
        });
        /*  console.log("registerEvent bottomSCroll", this.props.id, {
            queueid: this.props.queueid,
            y: offset.top,
        });*/
    };
    componentWillUnmount = () => {
        u.unregisterEvents("bottomScroll", this.props.queueid);
    };
    render = () => {
        let {
            key,
            id,
            qparams,
            qstate,
            qwiket,
            border,
            queueid,
            qid,
            theme,
        } = this.props;
        //  console.log("QwiketContainer render", id, qwiket.slug);
        let hasBorder = false;
        let borderColor;
        const now = (Date.now() / 1000) | 0;
        const { shared_time } = qwiket;
        const timeDiff = now - shared_time;
        const defaultBorderColor = theme.palette.borderColor;
        hasBorder = true;
        if (timeDiff < 3600) {
            borderColor = border ? green[500] : defaultBorderColor;
        } else if (timeDiff < 4 * 3600) {
            borderColor = border ? amber[500] : defaultBorderColor;
        } else if (timeDiff < 8 * 3600) {
            borderColor = border ? yellow[500] : defaultBorderColor;
        } else borderColor = theme.palette.borderColor;
        //console.log("theme:", theme);
        const Container = styled.div`
            position: relative;
            display: flex;
            width: 97%;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 8px;
            margin-right: 4px;
            margin-left: 4px;
            margin-top: 4px;
            font-size: 1.1rem;
            overflow: hidden;
            border-bottom: ${hasBorder ? `solid thin ${borderColor}` : "none"};
            border-left: ${hasBorder ? `solid thin ${borderColor}` : "none"};
            border-top: ${hasBorder ? `solid thin ${borderColor}` : "none"};
            border-right: ${hasBorder
                ? `solid thin ${defaultBorderColor}`
                : "none"};
            & .html-body {
                font-size: 1rem;
            }
        `;
        //  console.log("RENTER QCont", { id });
        return (
            <Container key={id}>
                <Qwiket
                    qwiket={qwiket}
                    queueid={queueid}
                    qid={qid}
                    qparams={qparams}
                    qstate={qstate}
                />

                <a href={qwiket.url}>{qwiket.url}</a>
            </Container>
        );
    };
}

export default withTheme(QwiketContainer);
