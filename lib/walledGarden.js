import React, { useState } from "react";
import PropTypes from "prop-types";
import Router from "next/router";

//import "../styles/normalize.css";

//MUI
import { withTheme } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";

import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import ImageIcon from "mdi-material-ui/Image";
import CancelIcon from "mdi-material-ui/Close";
//import u from "../lib/utils";

import Button from "@material-ui/core/Button";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import SelectInput from "@material-ui/core/Select/SelectInput";

//--------------------------------->

//import u from './utils'
//import MediaQuery from 'react-responsive';

export class WalledGarden extends React.Component {
    constructor(props, context) {
        super(props, context);
        if (window && window.location.href.indexOf("xcode") > 0)
            this.state = {
                loading: 1,
            };
        else
            this.state = {
                loading: 0,
            };
    }
    render() {
        console.log(
            "WallGarden ENTER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
        );
        const props = this.props;
        const state = this.state;
        const {
            fullScreen,
            login,
            userName,
            children,
            style,
            className,
            history,
            theme,
        } = props;
        // console.log("userName:",userName)
        if (login || (userName && userName.indexOf("anon") >= 0)) {
            return (
                <Dialog
                    fullScreen={fullScreen}
                    open={true}
                    scroll="paper"
                    onClose={() => Router.back()}>
                    <Paper elevation={0}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 0,
                            }}>
                            <DialogTitle id="responsive-dialog-title">
                                <div style={{ fontSize: "1.8rem" }}>
                                    Qwiket Login Required:
                                </div>
                            </DialogTitle>
                            <IconButton
                                onClick={() => Router.back()}
                                variant="contained"
                                color="secondary"
                                style={{ marginLeft: 10 }}>
                                <CancelIcon />
                            </IconButton>
                        </div>
                    </Paper>

                    <DialogContent style={{ minHeight: 120 }}>
                        <div style={{ width: "100%", height: "100%" }}>
                            <div
                                style={{
                                    fontSize: "1.4rem",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    textAlign: "center",
                                }}>
                                {state.loading ? (
                                    <span>
                                        Please wait while we are communicating
                                        with Disqus on your behalf.
                                    </span>
                                ) : (
                                    <div>
                                        This functionality requires you to sign
                                        in to Qwiket with your Disqus account.{" "}
                                        <p style={{ margin: 20 }}></p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                    {state.loading == 0 ? (
                        <DialogActions>
                            <Button
                                aria-label="Image"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    this.setState({ loading: 1 });
                                    actions.updateOnlineState(
                                        { mask: true },
                                        true
                                    );
                                    window.location =
                                        window.location.href.indexOf("?") >= 0
                                            ? window.location.href + "&login=1"
                                            : window.location.href + "?login=1";
                                }}
                                bsStyle="primary">
                                Login
                            </Button>
                        </DialogActions>
                    ) : null}
                </Dialog>
            );
        } else {
            return (
                <div
                    data-id="walled-garden"
                    style={style}
                    className={className}>
                    {children}
                </div>
            );
        }
    }
}
WalledGarden.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    login: PropTypes.number,
    userName: PropTypes.string,
};

WalledGarden = withMobileDialog()(withTheme(WalledGarden));
const LoginDialog = ({
    theme,
    fullScreen,
    creatingNumberedAccount,
    createdNumberedAccount,
    open,
    setOpen,
    actions,
    logginIn,
    reason,
    remainingAttempts,
    remainingTime,
    reqValidateState,
    reqValidateStatus,
}) => {
    let [loading, setLoading] = useState(0);
    let [type, setType] = useState(0);
    let [uValid, setUValid] = useState(true);
    let [p1, setP1] = useState(null);
    let [p2, setP2] = useState(null);
    let [uname, setUname] = useState("");
    let [user_name, setUser_name] = useState("");
    let [number, setNumber] = useState("");
    let [pMatched, setPMatched] = useState(false);

    const muiTheme = theme;
    const backgroundColor = muiTheme.palette.background.default;
    const color = muiTheme.palette.text.primary;
    let frontEndValidateUsername = uname => {
        let letters = /^[0-9a-zA-Z_-]+$/;
        setUname(uname);
        setUValid(
            uname &&
                uname.match(letters) &&
                uname.length > 2 &&
                uname.length <= 30
        );
    };

    if (createdNumberedAccount == "success" && type == 0) setType(1);
    /* if (
        !loading &&
        typeof window !== "undefined" &&
        window.location.href.indexOf("xcode") > 0
    )
        setLoading(1);
    else if (
        typeof window !== "undefined" &&
        window.location.href.indexOf("xcode") < 0
    )
        setLoading(0);
*/
    return (
        <div data-id="click-walled-garden">
            <Dialog
                fullScreen={fullScreen}
                open={open}
                scroll="paper"
                onClose={() => setOpen(false)}
                aria-labelledby="responsive-dialog-title"
                className="q-walled-garden-outer">
                <Paper elevation={0} className="q-walled-garden-inner">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 0,
                        }}>
                        <DialogTitle id="responsive-dialog-title">
                            <div style={{ fontSize: "1.8rem" }}>
                                {type == 4 ? "Create Account" : "Qwiket Login"}:
                            </div>
                        </DialogTitle>
                        <IconButton
                            onClick={() => setOpen(false)}
                            variant="contained"
                            color="secondary">
                            <CancelIcon />
                        </IconButton>
                    </div>

                    {type == 0 ? (
                        <div className="q-wg-login-buttons">
                            <Button
                                aria-label="Image"
                                variant="outlined"
                                color="primary"
                                onClick={async () => {
                                    // window.sessionStorage.setItem("loginRedirect", window.location.pathname);
                                    actions.setIsLoggingIn(1);
                                    actions.updateSessionState({
                                        logginIn: { $set: 1 },
                                        loginRedirect: {
                                            $set: window.location.pathname,
                                        },
                                        loginTimestapm: {
                                            $set: (Date.now() / 1000) | 0,
                                        },
                                    });

                                    setTimeout(
                                        () =>
                                            (window.location = `/disqus-login?home=${encodeURIComponent(
                                                window.location.href
                                            )}`),
                                        1
                                    ); /*window.location = window.location.href.indexOf(' ? ') >= 0 ? window.location.href + ' & login=1' : window.location.href + '?login=1' */
                                }}>
                                Disqus Login
                            </Button>
                            <div className="q-wg-sub-help">
                                If you are using Disqus for comments, login via
                                Disqus.{" "}
                            </div>
                            {loading ? (
                                <LinearProgress variant="query" />
                            ) : null}
                            {type == 0 ? (
                                <div className="q-wg-help">
                                    {loading ? (
                                        <span>
                                            Please wait while we are
                                            communicating with Disqus on your
                                            behalf.
                                        </span>
                                    ) : null}
                                </div>
                            ) : null}
                            <Button
                                onClick={() => this.setType(1)}
                                aria-label="Direct Login"
                                variant="outlined"
                                color="primary">
                                Direct Login
                            </Button>
                            <div
                                onClick={() => this.setType(2)}
                                className="q-wg-sub-help">
                                Qwiket supports anonymous numbered accounts. Use
                                this button to login or to create an account.
                            </div>
                            {false ? (
                                <Button
                                    aria-label="Direct Login"
                                    variant="outlined"
                                    color="primary">
                                    Social Login
                                </Button>
                            ) : null}
                            {false ? (
                                <div
                                    onClick={() => this.setType(3)}
                                    className="q-wg-sub-help">
                                    You can login via Facebook, Twitter,
                                    Instagram, Google, etc social media.{" "}
                                </div>
                            ) : null}
                        </div>
                    ) : type == 1 ? (
                        <form className="q-wg-login-form">
                            <TextField
                                id="numbered-password"
                                label="Account Number"
                                className="q-wg-password"
                                type="password"
                                autoComplete="current-password"
                                margin="normal"
                                error={Boolean(number && number.length < 20)}
                                onChange={e => setNumber(e.target.value)}
                            />
                            <Button
                                disabled={logginIn}
                                onClick={() => actions.numberedLogin(number)}
                                aria-label="Direct Login"
                                variant="outlined"
                                color="primary">
                                Login
                            </Button>
                            {logginIn ? (
                                <LinearProgress variant="query" />
                            ) : null}
                            {reason ? (
                                <div className="q-wg-invalid">{`The login failed: ${
                                    reason == "invalid"
                                        ? "Invalid Account Number"
                                        : "Too Many Attempts"
                                }`}</div>
                            ) : null}
                            {reason == "invalid" ? (
                                <div className="q-wg-invalid">
                                    Remaining Attempts:{remainingAttempts}
                                </div>
                            ) : reason == "cooloff" ? (
                                <div className="q-wg-invalid">
                                    Please wait:{remainingTime}
                                </div>
                            ) : null}

                            <div className="q-wg-login-field">OR</div>
                            <Button
                                disabled={
                                    logginIn ||
                                    Boolean(number && number.length < 20)
                                }
                                onClick={() => this.setState({ type: 4 })}
                                aria-label="Direct Login"
                                variant="outlined"
                                color="primary">
                                Create New Account
                            </Button>
                        </form>
                    ) : type == 4 ? (
                        <form className="q-wg-login-form">
                            <TextField
                                id="text-field-username"
                                label="Select a unique username"
                                onChange={e =>
                                    frontEndValidateUsername(e.target.value)
                                }
                                error={Boolean(!uValid && uname)}
                            />
                            <div className="q-wg-login-field">
                                {!p1 || p1.length < 20
                                    ? "Should be a single word, only alphanumeric characters and _- allowed. At least 3, at most 30 characters long. Has to be unique across Qwiket and Disqus. Once the account is created, the username can't be changed."
                                    : ""}
                            </div>
                            <Button
                                onClick={() => actions.validateUsername(uname)}
                                aria-label="Validate"
                                variant="outlined"
                                color="primary"
                                disabled={
                                    !uValid ||
                                    !uname ||
                                    reqValidateState == "pending" ||
                                    reqValidateStatus
                                }>
                                Validate
                            </Button>
                            {reqValidateState == "pending" ||
                            reqValidateState == "retrying" ? (
                                <LinearProgress variant="query" />
                            ) : null}
                            {reqValidateState == "received" ? (
                                reqValidateStatus ? (
                                    <div className="q-wg-validated">
                                        VALIDATED
                                    </div>
                                ) : reqValidateState == "retrying" ? (
                                    <div className="q-wg-warning">
                                        RETRYING...
                                    </div>
                                ) : (
                                    <div className="q-wg-invalid">
                                        NOT AVAILABLE
                                    </div>
                                )
                            ) : null}
                            <TextField
                                label="Select a display name"
                                onChange={e => setUser_name(e.target.value)}
                            />
                            <div className="q-wg-login-field">
                                Please, choose a display name. It can be changed
                                later.
                            </div>

                            <Divider />
                            <div className="q-wg-subheader">
                                Account Number:
                            </div>
                            <div className="q-wg-login-field">
                                Please, choose at least 20 digit long account
                                number. You will use it to login onto the site.
                                Keep in mind, that in order to protect your
                                anonymity, we do not keep any identifying
                                information and would be unable to assist you
                                with a recovery of a forgotten number. It is a
                                100% your responsibility to keep it in a safe
                                place. If you forget or lose the account number,
                                your account and all associated assets will be
                                lost.
                            </div>
                            <TextField
                                label="Account Number"
                                className={
                                    pMatched
                                        ? "q-wg-password- matched"
                                        : "q-wg-password"
                                }
                                type="password"
                                autoComplete="current-password"
                                margin="normal"
                                error={Boolean(p1 && p1.length < 20)}
                                onChange={e => setP1(e.target.value)}
                                helperText={
                                    !p1 || p1.length < 20
                                        ? "Should be at least 20 digits, up to 256."
                                        : "Looks good"
                                }
                            />
                            <TextField
                                label="Repeat Account Number"
                                className={
                                    pMatched
                                        ? "q-wg-password-matched"
                                        : "q-wg-password"
                                }
                                type="password"
                                autoComplete="current-password"
                                margin="normal"
                                error={p2 && p2 != p1}
                                onChange={e => {
                                    setP2(e.target.value);
                                    setPMatched(e.target.value == state.p1);
                                }}
                                helperText={
                                    pMatched ? "Matched" : "Should match"
                                }
                            />
                            <br />
                            <br />
                            <Button
                                onClick={() =>
                                    actions.createNumberedAccount({
                                        username: uname,
                                        user_name,
                                        number: p1,
                                    })
                                }
                                aria-label="Direct Login"
                                variant="outlined"
                                color="primary"
                                disabled={
                                    !pMatched || !uValid || !uname || !user_name
                                }>
                                Create Account
                            </Button>
                            {creatingNumberedAccount ? (
                                <LinearProgress variant="query" />
                            ) : null}
                            {createdNumberedAccount == "failed" ? (
                                <div className="q-wg-invalid">
                                    CREATION OF NUMBERED ACCOUNT FAILED:{" "}
                                    {createdNumberedAccoungMsg}
                                </div>
                            ) : createdNumberedAccount == "success" ? (
                                <div className="q-wg-valid">
                                    SUCCESS CREATING A NUMBERED ACCOUNT
                                </div>
                            ) : null}
                        </form>
                    ) : null}
                </Paper>
            </Dialog>

            <style global jsx>{`
                .q-wg-warning {
                    color: yellow;
                    font-size: 1.6rem;
                    font-weight: 500;
                    margin-top: 4px;
                    margin-bottom: 20px;
                }
                .q-wg-validated {
                    color: green;
                    font-size: 1.6rem;
                    font-weight: 500;
                    margin-top: 4px;
                    margin-bottom: 20px;
                }
                .q-wg-invalid {
                    color: red;
                    font-size: 1.6rem;
                    font-weight: 500;
                    margin-top: 4px;
                    margin-bottom: 20px;
                }
                .q-wg-subheader {
                    font-size: 1.5rem;
                    font-weight: 500;
                    margin-top: 20px;
                    color: ${color};
                }
                .q-wg-password-matched {
                    color: green;
                }
                .q-wg-login-form {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 20px;
                }
                .q-wg-login-field {
                    text-align: center;
                    margin: 20px;
                    color: ${color};
                }
                .q-walled-garden-outer {
                    border-radius: 25px !important;
                    padding: 4px 20px 20px 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .q-walled-garden-inner {
                    padding: 4px 20px 20px 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .q-wg-login-buttons {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: ${color};
                }
                .q-wg-help {
                    text-align: center;
                    font-size: 1.3rem;
                }
                .q-wg-sub-help {
                    font-size: 1.2rem;
                    max-width: 60%;
                    margin-bottom: 40px;
                    margin-top: 10px;
                    color: ${color};
                }
            `}</style>
        </div>
    );
};
export let ClickWalledGarden = ({
    login,
    placeHolder,
    qparams,
    qstate,
    style,
    className,
    children,
    ...rest
}) => {
    let [open, setOpen] = useState(false);

    login = +login;

    let validatedUsernames = []; //app.get("validatedUsernames");
    let reqValidateState = 0;
    let reqValidateStatus = false;
    let vu = false;
    /* if (validatedUsernames) {
        vu = validatedUsernames[uname];
        if (vu) {
            reqValidateState = vu.state;
            reqValidateStatus = vu.success;
            if (reqValidateState == "pending") {
                let timestamp = vu.timestamp;
                let now = (Date.now() / 1000) | 0;
                if (now - timestamp > 7) {
                    reqValidateState = "retrying";
                    actions.validateUsername(uname);
                }
            }
        }
    }*/
    // console.log("ClickWalledGarden render :", { login, userName, reason, remainingAttempts, remainingTime, placeHolder, reqValidateState, reqValidateStatus, validatedUsernames: validatedUsernames ? validatedUsernames.toJS() : {}, vu })

    if (!open && login) {
        // console.log("walled garden render placeholder");
        return (
            <span
                data-id="wrap-place-holder "
                onClick={() => {
                    console.log("WALLED GARDEN CLICK");
                    setOpen(true);
                }}>
                {placeHolder}
            </span>
        );
    }
    if (login) {
        return (
            <LoginDialog
                login={login}
                open={open}
                setOpen={setOpen}
                actions={qstate.actions}
                reqValidateState={reqValidateState}
                reqValidateStatus={reqValidateStatus}
                {...rest}
            />
        );
    } else {
        return (
            <div
                data-id="click-walled-garden"
                style={style}
                className={className}>
                {children}
            </div>
        );
    }
};

ClickWalledGarden = withTheme(ClickWalledGarden);
