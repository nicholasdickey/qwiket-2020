//band.js

import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

//import QwiketContainer from "../qwikets/qwiketContainer";
import u from "../../lib/utils";
import { HotItem, Hotlist } from "./hotlist";
import { QWIKET_QUERY } from "../../gql/queries";
const Band = ({
    spaces,
    singleWidth,
    dark,
    qparams,
    qstate,
    selector,
    loud,
    queueid,
}) => {
    // const [pageState, setPage] = React.useState(0);
    //const [lastPage, setLastPage] = React.useState(false);
    //const [qid, setQid] = React.useState(0);
    console.log("RENDER Band ", { spaces, selector, queueid });
    //let page = pageState ? pageState : 0;

    let silo = 3;
    let sortBy = "shared_time";
    let search = "@reshare:{0|100}";
    let page = 0;
    let size = spaces + 4;
    let qid = 0;
    queueid = "theband";
    const { error, data, refetch } = useQuery(QWIKET_QUERY, {
        variables: { search, page, size, sortBy, silo, qid, environment: 0 },
        onCompleted: data => {
            console.log("Completed Band initial query", data);
        },
    });

    React.useEffect(() => {
        // Update the document title using the browser API
        // document.title = `You clicked ${count} times`;
        let topScroll = () => {
            refetch();
        };
        console.log("register topScroll", queueid);
        u.registerEvent("topScroll", topScroll, { me: queueid });
        return () => {
            console.log("handle Effect Cleanup unregisterEvents");
            u.unregisterEvents("topScroll", queueid);
        };
    });
    let items = data ? data.qwiketQuery.qwikets : [];
    let rows = items.map((item, index) => {
        return (
            <HotItem
                key={`hot-item-${index}`}
                width={singleWidth}
                item={item}
                loud={loud}
                dark={dark}
                channel={qparams.channel}
            />
        );
    });
    //  console.log({ BandItems: items ? items : data?.qwiketQuery });
    return (
        <Hotlist spaces={spaces} qparams={qparams} loud={loud} rows={rows} />
    );
};
export default Band;
