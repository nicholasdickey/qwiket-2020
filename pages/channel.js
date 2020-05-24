import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import withApollo from "../lib/apollo";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import Landing from "../components/landing";

const GET_CHANNEL = gql`
    query storeGetChannel($ns: String) {
        storeGetChannel(newslineSlug: $ns) {
            channelSlug
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
        }
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

const Channel = ({ query }) => {
    let { channel: newsline } = query;
    const { error: channelError, data: channelData } = useQuery(GET_CHANNEL, {
        variables: { ns: query ? query.channel : "q" },
        notifyOnNetworkStatusChange: true,
        onCompleted: data => {
            console.log("save GET_CHANNEL", data);
        },
    });
    const { error: userError, data: userData } = useQuery(GET_USER, {
        variables: { ns: query ? query.channel : "q" },
        notifyOnNetworkStatusChange: true,
        onCompleted: data => {
            console.log("save GET_USERL", data);
        },
    });
    console.log({ newsline, query, channelData, userData });
    const classes = useStyles();

    return (
        <div>
            {newsline != "landing" ? (
                <Container></Container>
            ) : (
                <Landing channel={channelData ? channelData.channelSlug : ""} />
            )}
        </div>
    );
};
const Container = styled.div`
    width: 960px;
    height: 100vh;
    margin: 2rem auto;
    padding: 2rem;
    background: #f2f2f2;
`;
Channel.getInitialProps = ({ query }) => {
    return { query };
};
export default withApollo({ ssr: true })(Channel);
