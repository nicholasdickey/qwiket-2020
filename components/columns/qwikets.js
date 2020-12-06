//qwikets.js

import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import QwiketContainer from "../qwikets/qwiketContainer";
import u from "../../lib/utils";
const QWIKET_QUERY = gql`
    query qwiketQuery(
        $search: String!
        $silo: Int
        $page: Int
        $qid: Int
        $sortBy: String
        $environment: Int
    ) {
        qwiketQuery(
            search: $search
            silo: $silo
            page: $page
            qid: $qid
            sortBy: $sortBy
            environment: $environment
        ) {
            qid
            total
            qwikets {
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
    }
`;
class Queue extends React.Component {
    componentDidMount = () => {
        //  console.log("Queue:componentDidMount");
        u.registerEvent("topScroll", this.topScroll.bind(this), {
            me: this.props.queueid,
        });
    };
    topScroll = (name, event) => {
        this.props.fetchFirstPage();
    };
    bottomScroll = (name, event) => {
        this.props.fetchNextPage();
    };
    componentWillUnmount = () => {
        u.unregisterEvents("topScroll", this.props.queueid);
    };
    render = () => {
        let { queueid, qid, items, border, qparams, qstate } = this.props;

        //  console.log("show items:", queueid, items);
        return (
            <div>
                {items.map(p => (
                    <QwiketContainer
                        key={`${queueid}-${p.slug}`}
                        id={`${queueid}-${p.slug}`}
                        qid={qid}
                        qparams={qparams}
                        qstate={qstate}
                        border={border}
                        qwiket={p}
                        fetchNextPage={this.bottomScroll.bind(this)}
                        queueid={queueid}
                    />
                ))}
            </div>
        );
    };
}
const QwiketsColumn = ({ qparams, qstate, selector, queueid }) => {
    const [pageState, setPage] = React.useState(0);
    const [lastPage, setLastPage] = React.useState(false);
    const [qid, setQid] = React.useState(0);
    console.log("RENDER QwiketsColumn ", selector, queueid);
    let page = pageState ? pageState : 0;

    let silo = 3;
    let sortBy = "published_time";
    if (selector == "newsviews") sortBy = "shared_time";
    let border = selector == "feed" ? true : false;
    let search = "@reshare:{0|100}";
    switch (selector) {
        case "newsviews":
            sortBy = "shared_time";
            search = "@reshare:{2|100}";
            break;
    }
    if (selector.indexOf("$") == 0) search = selector.substr(1);
    const { error, data, fetchMore } = useQuery(QWIKET_QUERY, {
        variables: { search, page, sortBy, silo, qid, environment: 0 },
        onCompleted: data => {
            if (!data) return;
            // console.log("completed QWIKET_QUERY", queueid, page, data);
            let nqid = +(data.qwiketQuery ? data.qwiketQuery.qid : 0);
            if (nqid != qid) setQid(nqid);
            //setItems(data.qwiketQuery.qwikets);

            if (data.qwiketQuery && data.qwiketQuery.length == 6) {
                // setLastPage(false);
                //  console.log("setLastPage(false)", queueid);
            } else {
                //setLastPage(true);
                //  console.log("setLastPage(true)", queueid);
            }
            /* if (page == 0) {
                //  setItems(data.qwiketQuery);
                console.log(
                    "completed setItems ",
                    queueid,
                    page,
                    data.qwiketQuery
                );
            } else {
                //tems = itemsState;
                // oldItems.push(...data.qwiketQuery);
                //  setItems(oldItems);
                console.log("completed setItems", queueid, page);
            }*/
        },
    });

    const fetchNextPage = () => {
        let nextPage = page;
        if (!lastPage) nextPage += 1;
        fetchPage(nextPage);
    };
    const fetchPage = page => {
        setPage(page);
        /* console.log("handle fetchNextPage", {
            page,
            qid,
            queueid,
        }); */
        fetchMore({
            variables: {
                search,
                page,
                sortBy,
                silo,
                qid: page ? qid : 0,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return data;
                /* console.log("updateQuery ", {
                    page,
                    qid,
                    queueid,
                    data,
                    prev,
                    fetchMoreResult,
                }); */
                /*   console.log("before merged", {
                    queueid,
                    data,
                    fetchMoreResult,
                });*/
                let ma =
                    page > 0
                        ? [
                              ...data.qwiketQuery.qwikets,
                              ...fetchMoreResult.qwiketQuery.qwikets,
                          ]
                        : +data.qwiketQuery.qid !=
                          +fetchMoreResult.qwiketQuery.qid
                        ? fetchMoreResult.qwiketQuery.qwikets
                        : data.qwiketQuery.qwikets;
                //   console.log("merged array:", { queueid, ma });
                let qwiketQuery = Object.assign({}, data.qwiketQuery, {
                    total: +fetchMoreResult.qwiketQuery.total,
                    qid: +fetchMoreResult.qwiketQuery.qid,
                    qwikets: ma,
                });
                let merged = Object.assign({}, data, {
                    qwiketQuery,
                });
                //  console.log("merged", { queueid, merged });
                setItems(ma);
                if (merged.qwiketQuery.qid != qid)
                    setQid(merged.qwiketQuery.qid);
                return merged;
                //return prev.qwiketQuery.push(...fetchMoreResult.qwiketQuery);
                //return prev.qwiketQuery.concat(fetchMoreResult.qwiketQuery);
            },
        });
    };

    const fetchFirstPage = () => {
        const nextPage = 0;
        setPage(nextPage);
        // setItems([]);
        //   console.log("completed fetchFirstPage", queueid);
        /*refetch({
            search,
            page: nextPage,
            sortBy,
            silo,
            qid: 0,
        });
        */
        fetchPage(0);
    };
    /* let items =
        itemsState && itemsState.length > 0
            ? itemsState
            : data
            ? data.qwiketQuery
            : [];*/
    let itemsData = data ? data.qwiketQuery.qwikets : [];
    const [items, setItems] = React.useState(itemsData);

    //let qid = data?.qwiketQuery.qid;
    //  console.log("DATA:", JSON.stringify(items));
    /*  React.useEffect(() => {
        // Update the document title using the browser API
        // document.title = `You clicked ${count} times`;
        const fp = fetchFirstPage;
        u.registerEvent("topScroll", fp, { me: queueid });
        return () => {
            console.log("handle Effect Cleanup unregisterEvents");
            u.unregisterEvents("topScroll", queueid);
        };
    });*/
    //  console.log({ items: items ? items : data?.qwiketQuery });
    return (
        <Queue
            qid={qid}
            qparams={qparams}
            qstate={qstate}
            border={border}
            fetchNextPage={fetchNextPage}
            fetchFirstPage={fetchFirstPage}
            queueid={queueid}
            items={items}
        />
    );
    //return <div>QWIKETS222:{JSON.stringify(data, null, 4)}</div>;

    /*
    return (
        <Queue
            qparams={qparams}
            qstate={qstate}
            items={
                items
                    ? items.map(p => (
                          <QwiketContainer
                              qparams={qparams}
                              qstate={qstate}
                              border={border}
                              qwiket={p}
                              fetchNextPage={fetchNextPage}
                              queueid={queueid}
                          />
                      ))
                    : null
            }
            fetchNextPage={fetchNextPage}
            fetchFirstPage={fetchFirstPage}
        />
    );
    */
};

export default QwiketsColumn;
