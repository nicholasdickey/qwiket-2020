import React from "react";
import PropTypes from "prop-types";
//import "../styles/normalize.css";

//MUI
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import List from "@material-ui/core/List";
//import {List, ListItem} from 'material-ui/List';
import Avatar from "@material-ui/core/Avatar";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
//--------------------------------->
const FETCH_ALL_CHANNELS_QL = gql`
    query channelFetchAllChannels {
        channelFetchAllChannels {
            slug
            displayName
            description
            logo
        }
    }
`;
let NewEditionSwitch = props => {
    let { onSelect, onClose, channelSlug } = props;
    const [channel, setChannel] = React.useState(channelSlug);
    const { loading, error, data: channelsData } = useQuery(
        FETCH_ALL_CHANNELS_QL,
        {
            notifyOnNetworkStatusChange: true,
            onCompleted: data => {
                console.log("saonCompletedve FETCH_ALL_CHANNELS_QL", data);
            },
        }
    );
    if (!channelsData) return <div>{JSON.stringify(error)}</div>;
    let channels = channelsData.channelFetchAllChannels;
    var editions = [];
    console.log("channels:", channels ? channels : "");
    channels.forEach((o, i) => {
        console.log("Adding o=", o);

        var { displayName: name, description, slug: homeChannel, logo } = o;
        console.log({ name, description, homeChannel, logo });
        let target = "/channel/" + homeChannel;
        /*else
          target='/';*/
        const row = (
            <ListItem
                button
                component="nav"
                // leftAvatar={<Avatar src={o.get("logo")} />}
                selected={homeChannel == channel}
                key={"editionsListItem" + i}
                // primaryText={name}
                // secondaryText={<div style={{ color: '#222' }}>{description}</div>}
                // secondaryTextLines={2}
                onClick={() => {
                    console.log("calling onSelect");
                    onSelect(target, homeChannel); /* onClose();*/
                }}
                // innerDivStyle={props.textStyle ? props.textStyle : null}
                //  style={props.textStyle ? props.textStyle : null}
            >
                <ListItemAvatar>
                    <Avatar src={logo} />
                </ListItemAvatar>
                <ListItemText primary={name} secondary={description} />
            </ListItem>
        );
        editions.push(row);
    });
    return (
        <div>
            <List> {editions}</List>
        </div>
    );
};

export class Editions extends React.Component {
    constructor(props, context) {
        super(props);
        this.escFunction = this.escFunction.bind(this);
    }
    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.onClose();
        }
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    render() {
        let props = this.props;
        const { channelSlug, open, onSelect, fullScreen } = props;
        console.log("editions: ", { open, fullScreen });
        return (
            <div>
                <Dialog
                    open={open}
                    // title="Select a Qwiket Edition"
                    fullScreen={fullScreen}
                    autoScrollBodyContent={true}
                    maxWidth="md">
                    <DialogTitle>Most Popular Qwiket Channels</DialogTitle>

                    <NewEditionSwitch
                        channelSlug={channelSlug}
                        onSelect={onSelect}
                    />
                </Dialog>
            </div>
        );
    }
}
Editions.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    open: PropTypes.bool,
};

Editions = withMobileDialog()(Editions);
