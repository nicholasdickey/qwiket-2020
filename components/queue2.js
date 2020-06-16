//queue2.js

/**
 A generic Queue component, responsible for infinite scrolling
 
 
 */
import InfiniteScroll from "react-infinite-scroll-component";

const Queue = ({ items, fetchNextPage, fetchFirstPage }) => {
    return (
        <InfiniteScroll
            dataLength={items.length} //This is important field to render the next data
            next={fetchNextPage}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={
                <p style={{ textAlign: "center" }}>
                    <b>Yay! You have seen it all</b>
                </p>
            }
            // below props only if you need pull down functionality
            refreshFunction={fetchFirstPage}
            pullDownToRefresh
            pullDownToRefreshContent={
                <h3 style={{ textAlign: "center" }}>
                    &#8595; Pull down to refresh
                </h3>
            }
            releaseToRefreshContent={
                <h3 style={{ textAlign: "center" }}>
                    &#8593; Release to refresh
                </h3>
            }>
            {items}
        </InfiniteScroll>
    );
};
export default Queue;
