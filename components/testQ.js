import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
const QWIKET_QUERY = gql`
    query qwiketQuery(
        $search: String!
        $silo: Int
        $page: Int
        $sortBy: String
    ) {
        qwiketQuery(
            search: $search
            silo: $silo
            page: $page
            sortBy: $sortBy
        ) {
            slug
            title
            description
            author
            site_name
            body
            image
            tags
            type
            reshare
            published_time
            shared_time
            authorAvatar
            subscr_status
            threadTagImage
            threadPublished_time
            userRole
            threadDescription
            threadTag
            threadImage
            threadAuthor
            threadSlug
            threadTitle
            threadTagName
            threadUrl
            children_summary
            parent_summary
            url
        }
    }
`;

const QwiketsColumn = ({ qparams, qstate, selector, queueid }) => {
    let search = "@reshare:{2|100}";
    let page = 0;
    let sortBy = "published_time";
    let silo = 3;
    const { error, data, refetch } = useQuery(QWIKET_QUERY, {
        variables: { search, page, sortBy, silo },
        notifyOnNetworkStatusChange: true,
        onCompleted: data => {
            console.log("completed QWIKET_QUERY", queueid, page, data);
        },
    });
    return <div>QWIKETS:{JSON.stringify(data, null, 4)}</div>;
};
export default QwiketsColumn;
