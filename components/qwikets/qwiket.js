//qwiket.js
import React, { useState } from "react";
import styled from "styled-components";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import QwiketRenderer from "./qwiketRenderer";
const GET_TAG = gql`
    query getTag($slug: ID!) {
        storeGetTag(slug: $slug) {
            slug
            name
            description
            image
        }
    }
`;
const Qwiket = ({ qwiket, queueid, qid }) => {
    let tags = qwiket.tags;
    let tagsArray = tags ? tags.split(",") : [];
    let tag = tagsArray[0];
    if (qwiket.title.indexOf("Veritas") >= 0) {
        console.log("VERITAS", qwiket);
    }
    //  console.log("AQWIKET with tag", queueid, qwiket.slug, tag);
    const { error, data } = useQuery(GET_TAG, {
        variables: { slug: tag },
        onCompleted: function onCompleted(data) {
            console.log("agetTag ", tag, data);
        },
    });
    // if (!data) return <div />;
    let tagData = data ? data.storeGetTag : {};
    if (qwiket.reshare == 100) qwiket.topLevel = true;
    let tagImage = tagData ? tagData.image : "";
    let tagName = tagData ? tagData.name : "";
    let topQwiket;
    if (qwiket.reshare == 2) {
        let {
            authorAvatar,
            subscr_status,
            threadTagImage,
            threadPublished_time,
            userRole,
            threadDescription,
            threadTag,
            threadImage,
            threadAuthor,
            threadSlug,
            threadTitle,
            threadTagName,
            threadUrl,
            children_summary,
            parent_summary,
        } = qwiket;
        tagImage = qwiket.authorAvatar;

        topQwiket = {
            tags: threadTag,
            image: threadImage,
            author: threadAuthor,
            published_time: threadPublished_time,
            tagImage: threadTagImage,
            slug: threadSlug,
            title: threadTitle,
            site_name: threadTagName,
            tagName: threadTagName,
            url: threadUrl,
            description: threadDescription,
            topLevel: true,
            reshare: 3,
        };
    }
    //  console.log({ qwiket, topQwiket, tagImage });

    return (
        <OuterWrap>
            {topQwiket ? (
                <QwiketRenderer
                    qwiket={topQwiket}
                    subtype={"level"}
                    showImage={false}
                    showTagImage={true}
                    showLapsed={true}
                    showDescription={false}
                    tagImage={topQwiket.tagImage}
                    tagName={topQwiket.tagName}
                    tag={tag}
                    state={{}}
                />
            ) : null}
            <QwiketRenderer
                qwiket={qwiket}
                subtype={"level"}
                showImage={true}
                showTagImage={true}
                showDescription={true}
                showLapsed={true}
                tagImage={tagImage}
                tagName={tagName}
                tag={tag}
                state={{}}
            />
        </OuterWrap>
    );
};
const OuterWrap = styled.div`
    width: 100%;
`;
export default Qwiket;
