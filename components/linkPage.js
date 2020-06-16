/*
 * This is a version 6 rewrite of the Qwiket platform
 *
 */

import React, { Component } from "react";

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "mdi-material-ui/Close";
import Button from "@material-ui/core/Button";
function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

const LinkPopup = ({ shortname, open, onClose, fullScreen }) => {
    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            //scroll='paper'
            onClose={onClose}
            aria-labelledby="responsive-dialog-title"
            maxWidth="lg"
            classes={{ root: "q-dialog-root" }}>
            <Paper elevation={0}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 0,
                    }}>
                    <DialogTitle id="responsive-dialog-title">
                        Share Link
                    </DialogTitle>
                    <IconButton
                        onClick={onClose}
                        variant="contained"
                        color="secondary"
                        style={{ marginLeft: 10 }}>
                        <CancelIcon />
                    </IconButton>
                </div>
            </Paper>
            <DialogContent>
                <TextField
                    id="outlined-find-input"
                    label="Link URL"
                    // value={this.state.find}
                    inputRef={ref => {
                        this.input = ref;
                    }}
                    name="url"
                    margin="dense"
                    variant="outlined"
                />

                <DialogContentText className="q-form-label">
                    Share a story on Qwiket
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={e => {
                        e.preventDefault();
                        //console.log("LOG input=",this.input.value);
                        //this.setState({page:0});
                        if (!this.input.value) return false;
                        //var api=`http://${window.location.host}${contextUrl}/topic/${props.params.shortname}/url/${encodeURIComponent(this.input.value)}`
                        const api = `https://${
                            window.location.host
                        }/api?task=submit_link&shortname=${shortname}&link=${encodeURIComponent(
                            this.input.value
                        )}`;

                        fetch(api, { credentials: "same-origin" }).then(
                            response => {
                                console.log("response:", response);
                                onClose();
                            }
                        );
                    }}>
                    Submit
                </Button>
            </DialogActions>
            <style global jsx>{`
                .q-dialog-root {
                }
            `}</style>
        </Dialog>
    );
};
export default React.memo(withMobileDialog()(LinkPopup));
