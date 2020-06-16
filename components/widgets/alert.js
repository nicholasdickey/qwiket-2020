/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import Immutable from "immutable";
import styled from "styled-components";

import PropTypes from "prop-types";
//import IconButton from 'material-ui/IconButton';
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Notifications from "mdi-material-ui/Bell";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import CancelIcon from "mdi-material-ui/Close";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";

//import AlertsColumn from "../queues/alerts";
export function AlertDialog(props) {
    let {
        onClose,
        open,
        actions,
        alerts,
        unviewedCount,
        user,
        fullScreen,
    } = props;
    //console.log("AlertDialog", { open })
    let page = alerts ? alerts.page : 0;
    let username = user?.user_name;
    let more = alerts ? alerts.more : 0;

    return (
        <Dialog
            scroll="paper"
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
            aria-labelledby="responsive-dialog-title"
            maxWidth="md"
            classes={{ root: "q-dialog-root" }}>
            <Paper elevation={0}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 0,
                    }}>
                    <DialogTitle id="responsive-dialog-title">
                        Alerts
                    </DialogTitle>
                    <IconButton
                        onClick={onClose}
                        variant="contained"
                        color="secondary">
                        {styled(() => <CancelIcon />)`
                            width: 36px;
                            height: 36px;
                        `}
                    </IconButton>
                </div>
            </Paper>
            <DialogContent>
                {unviewedCount ? (
                    <DialogContentText className="q-form-label">
                        {styled(
                            <Button
                                primary={true}
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    actions.resetAlerts({ username });
                                }}>
                                Reset all alerts as viewed...
                            </Button>
                        )`
                            font-size: 1rem;
                        `}
                    </DialogContentText>
                ) : null}
                <div onClick={onClose}>
                    <div {...props} />
                </div>
                {more ? (
                    <DialogContentText className="q-form-label">
                        {styled(
                            <Button
                                primary={true}
                                className="q-alerts-more"
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    actions.fetchAlerts({
                                        username,
                                        page: page + 1,
                                    });
                                }}>
                                More...
                            </Button>
                        )`
                            font-size: 1rem;
                        `}
                    </DialogContentText>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
AlertDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};
AlertDialog = withMobileDialog()(AlertDialog);

const Alert = ({ qparams, qstate }) => {
    let { alerts, user, session, actions } = qstate;
    const [anchorEl, setAnchorEl] = useState(0);
    if (!alerts) alerts = {};
    let unviewedCount = +alerts.unviewedCount || 0;

    const AlertIndicator = styled(({ unviewedCount, ...other }) => (
        <IconButton
            disabled={unviewedCount ? false : true}
            classes={{ root: "alert-button" }}
            {...other}
        />
    ))`
        margin - left: 30px;
        display: flex;
        align - items: flex - begin;
        margin - top: 6px;
        margin - right: 10px;
        & .alert - button {
            width: 24px;
            height: 24px;
            pading: 1px;
        }
    
        & .disabled {
            color: #aff; !important;
        }
    `;
    const AlertBadge = styled(({ ...other }) => <Badge {...other} />)`
        font-size: 0.8rem !important;
    `;
    const StyledNotifications = styled(({ ...other }) => (
        <Notifications fontSize="small" {...other} />
    ))`
        color: red !important;
    `;

    const IB = (
        <div>
            <AlertIndicator
                unviewedCount={unviewedCount}
                tooltip="Alerts"
                onClick={event =>
                    anchorEl ? setAnchorEl(0) : setAnchorEl(event.currentTarget)
                }>
                <AlertBadge badgeContent={unviewedCount} max={99}>
                    <StyledNotifications />
                </AlertBadge>
            </AlertIndicator>
            <AlertDialog
                alerts={alerts}
                unviewedCount={unviewedCount}
                user={user}
                open={anchorEl ? true : false}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(0)}
                qparams={qparams}
                qstate={qstate}
            />
        </div>
    );
    return IB;
};
export default Alert;
