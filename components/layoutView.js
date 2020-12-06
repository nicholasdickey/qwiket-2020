import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";

import Topline from "./topline";
import Header from "./header";
import { ColHeader } from "./colHeader";
import { useMediaQuery } from "react-responsive";
import Qwikets from "./columns/qwikets";
import { getColumnsMap } from "../lib/layout";
let HotlistRow = React.memo(({ layres, qparams, loud, theme, channel }) => {
    // return <div>HOTLIST {spaces}</div>
    let spaces = layres.spaces;
    let singleWidth = layres.singleWidth;
    //console.log('HotlistRow', { singleWidth, spaces, layres, channel, qparams })
    const listRenderer = ({ rows }) => {
        //   console.log("render listRenderer", { type, selector })
        /* return (
            <Hotlist
                spaces={spaces}
                qparams={qparams}
                loud={loud}
                rows={rows}
            />
        ); ---*/
    };
    const renderer = ({ item, channel, wrapper }) => {
        // console.log('HotItem renderer', { channel })
        /*return (
            <HotItem
                wrapper={wrapper}
                width={singleWidth}
                item={item}
                loud={loud}
                theme={theme}
                qparams={qparams}
                channel={channel}
            />
        ); ---*/
    };
    //console.log("HotlistRow", { qparams })
    /* return (
        <Queue
            tag={"hot"}
            spaces={spaces}
            renderer={renderer}
            qparams={qparams}
            listRenderer={listRenderer}
        />
    ); ---*/
    return <div />;
});
let Column = React.memo(
    ({
        layoutNumber,
        column,
        qparams,
        qstate,
        selectors,
        mscSelectors,
        colIndex,
        pageType,
        res,
        density,
        updateUserConfig,
        userLayout,
        chanConfig,
    }) => {
        // console.log("render Column", { pageType, colIndex });
        // if (!qparams && Root.qparams) qparams = Root.qparams;
        // console.log(`COLUMN:${column.selector}`, { qparams, column, colIndex, selectors, mscSelectors, density, res })
        let tag = qparams.tag || qparams.shortname;
        let width = column.percentWidth;
        const StyledColumn = styled.div`
            width: ${width};
        `;
        const InnerStyledColumn = styled.div`
            width: 100%;
        `;
        let type = column.type;
        let selector = column.selector || "";
        let msc = column.msc
            ? column.msc
            : pageType == "newsline"
            ? "navigator"
            : "feed";
        // console.log("COLUMN LAYOUT NUMBER", layoutNumber)
        const listRenderer = ({ rows }) => {
            // console.log("render listRenderer", { type, selector });
            return (
                <InnerStyledColumn
                    data-id="inner-styled-column"
                    className="q-column">
                    {rows}
                </InnerStyledColumn>
            );
        };
        switch (selector) {
            case "twitter1": {
                /* return (
                    <StyledColumn data-id="styled-column">
                        <ColHeader
                            chanConfig={chanConfig}
                            qparams={qparams}
                            colType={type}
                            updateUserConfig={updateUserConfig}
                            userLayout={userLayout}
                            layoutNumber={layoutNumber}
                            selector={selector}
                            selectors={selectors}
                            colIndex={colIndex}
                            pageType={pageType}
                            res={res}
                            density={density}
                        />
                        <Twitter height={49600} />
                    </StyledColumn>); ---*/
                return <div />;
            }
            case "topic": {
                // console.log("dbb Column:topic ", { qwiketid: qparams.threadid, time: Date.now() })
                // console.log("Column:feed", { tag })
                const renderer = ({ item, channel, wrapper }) => {
                    //const [ref, setRef] = useState(false);
                    // console.log("ITEM RENDERER:", tag)

                    /* return (
                        <QwiketItem
                            wrapper={wrapper}
                            qparams={qparams}
                            columnType={"feed"}
                            topic={item}
                            channel={channel}
                            forceShow={false}
                            approver={false}
                            test={false}
                        />
                    ); ---*/
                    return <div style={{ border: "thin solid green" }} />;
                };
                /* return (
                    <StyledColumn data-id="styled-column">
                        <Context
                            qparams={qparams}
                            renderer={renderer}
                            listRenderer={listRenderer}
                        />
                    </StyledColumn>
                ); */
                return <div style={{ border: "thin solid green" }} />;
            }
            case "newsline": {
                {
                    // console.log(`Column: ${selector}`)
                    const renderer = ({ item, channel, wrapper }) => {
                        //const [ref, setRef] = useState(false);
                        //console.log("ITEM RENDERER:", { channel, item })

                        /* return (
                            <QwiketItem
                                wrapper={wrapper}
                                qparams={qparams}
                                columnType={selector}
                                topic={item}
                                channel={channel}
                                forceShow={false}
                                approver={false}
                                test={false}
                            />
                        ); ---*/
                        return (
                            <div
                                style={{
                                    height: 600,
                                    border: "thin solid blue",
                                }}
                            />
                        );
                    };
                    let GoldenRatioContainer = styled.div`
                        display: flex;
                        width: ${width};
                        position: relative;
                    `;
                    let GoldenRatioLeft = styled.div`
                        width: 61.8%;
                    `;
                    let GoldenRatioRight = styled.div`
                        width: 38.2%;
                    `;
                    return (
                        <GoldenRatioContainer data-id="newsline-container">
                            <GoldenRatioLeft>
                                <ColHeader
                                    chanConfig={chanConfig}
                                    qparams={qparams}
                                    colType={type}
                                    updateUserConfig={updateUserConfig}
                                    userLayout={userLayout}
                                    layoutNumber={layoutNumber}
                                    selector={selector}
                                    selectors={selectors}
                                    colIndex={colIndex}
                                    pageType={pageType}
                                    res={res}
                                    density={density}
                                />
                                <Qwikets
                                    qparams={qparams}
                                    qstate={qstate}
                                    selector={selector}
                                    queueid={pageType + "-" + colIndex}
                                />
                            </GoldenRatioLeft>
                            <GoldenRatioRight>
                                <ColHeader
                                    chanConfig={chanConfig}
                                    qparams={qparams}
                                    colType={type}
                                    updateUserConfig={updateUserConfig}
                                    userLayout={userLayout}
                                    layoutNumber={layoutNumber}
                                    isMsc={1}
                                    selector={msc}
                                    selectors={mscSelectors}
                                    colIndex={colIndex}
                                    pageType={pageType}
                                    res={res}
                                    density={density}
                                />
                                {msc == "navigator" ? (
                                    <div qparams={qparams} />
                                ) : (
                                    <Qwikets
                                        qparams={qparams}
                                        qstate={qstate}
                                        selector={selector}
                                        queueid={pageType + "-" + colIndex}
                                    />
                                )}
                            </GoldenRatioRight>
                        </GoldenRatioContainer>
                    );
                    /*  return (
                        <div
                            style={{ height: 600, border: "thin solid blue" }}
                        />
                    );*/
                }
            }
            case "newsviews":
            case "topics":
            case "stickies":
            case "reacts":
            default: {
                // console.log(`Column: ${selector}`)
                const renderer = ({ item, channel, wrapper }) => {
                    //const [ref, setRef] = useState(false);
                    //console.log("ITEM RENDERER:", { channel, item })

                    /* return (
                        <QwiketItem
                            wrapper={wrapper}
                            qparams={qparams}
                            columnType={selector}
                            topic={item}
                            channel={channel}
                            forceShow={false}
                            approver={false}
                            test={false}
                        />
                    ); ---*/
                    return (
                        <div
                            style={{ height: 600, border: "thin solid red" }}
                        />
                    );
                };
                return (
                    <StyledColumn data-id="styled-column">
                        <ColHeader
                            chanConfig={chanConfig}
                            qparams={qparams}
                            colType={type}
                            updateUserConfig={updateUserConfig}
                            userLayout={userLayout}
                            layoutNumber={layoutNumber}
                            selector={selector}
                            selectors={selectors}
                            colIndex={colIndex}
                            pageType={pageType}
                            res={res}
                            density={density}
                        />
                        <Qwikets
                            qparams={qparams}
                            qstate={qstate}
                            selector={selector}
                            queueid={pageType + "-" + colIndex}
                        />
                    </StyledColumn>
                );
            }
            case "feed": {
                // console.log("Column:feed")
                const renderer = ({ item, channel, wrapper }) => {
                    //const [ref, setRef] = useState(false);
                    //  console.log("RENDERER:", item)

                    /* return (
                        <QwiketItem
                            wrapper={wrapper}
                            columnType={"feed"}
                            topic={item}
                            channel={channel}
                            qparams={qparams}
                            forceShow={false}
                            approver={false}
                            test={false}
                        />
                    );---*/
                    return <div />;
                };
                /* return (
                    <div>
                        <Queue
                            tag={tag}
                            renderer={renderer}
                            qparams={qparams}
                            listRenderer={listRenderer}
                        />
                    </div>
                ); ---*/
                <StyledColumn data-id="styled-column">
                    <Qwikets
                        qparams={qparams}
                        qstate={qstate}
                        selector={selector}
                        queueid={pageType + "-" + colIndex}
                    />
                    ;
                </StyledColumn>;
            }
        }
        return (
            <StyledColumn>
                <Qwikets
                    qparams={qparams}
                    qstate={qstate}
                    selector={selector}
                    queueid={pageType + "-" + colIndex}
                />
            </StyledColumn>
        );
    }
);
const LayoutView = ({
    qparams,
    qstate,
    layout,
    selectors,
    density,
    pageType,
    width,
}) => {
    let hpads = layout.hpads;
    let { channel, user, session, actions } = qstate;
    let chanConfig = channel?.config;
    let userConfig = user?.config;
    // console.log("chanConfig:", chanConfig);
    let { dark, cover: hot, loud } = session ? session.options : {};
    console.log("render layoutview ", { width, density, userConfig, layout });
    const PageWrap = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    /*  opacity: ${user.get("mask") ? 0.5 : 1.0};*/
    const Grid = styled.div`
        padding-left: ${hpads.w0};
        padding-right: ${hpads.w0};
        width: "100%" @media (min-width: 750px) {
            padding-left: ${hpads.w750};
            padding-right: ${hpads.w750};
        }
        @media (min-width: 900px) {
            padding-left: ${hpads.w900};
            padding-right: ${hpads.w900};
        }
        @media (min-width: 1200px) {
            padding-left: ${hpads.w1200};
            padding-right: ${hpads.w1200};
        }
        @media (min-width: 1600px) {
            padding-left: ${hpads.w1600};
            padding-right: ${hpads.w1600};
        }
        @media (min-width: 1800px) {
            padding-left: ${hpads.w1800};
            padding-right: ${hpads.w1800};
        }
        @media (min-width: 1950px) {
            padding-left: ${hpads.w1950};
            padding-right: ${hpads.w1950};
        }
        @media (min-width: 2100px) {
            padding-left: ${hpads.w2100};
            padding-right: ${hpads.w2100};
        }
        @media (min-width: 2400px) {
            padding-left: ${hpads.w2400};
            padding-right: ${hpads.w2400};
        }
    `;
    const InnerWrapper = ({ layout, selectors, density, width }) => (
        <div>
            <Topline layout={layout} qparams={qparams} qstate={qstate} />
            <Grid>
                <PageWrap>
                    <Header
                        width={width}
                        pageType={pageType}
                        layout={layout}
                        density={density}
                        qparams={qparams}
                        qstate={qstate}
                    />
                    <InnerLayoutView
                        chanConfig={chanConfig}
                        layout={layout}
                        selectors={selectors}
                        density={density}
                        updateUserConfig={actions.updateUserConfig}
                        userLayout={userConfig?.userLayout}
                        channel={channel}
                        width={width}
                        hot={hot}
                        loud={loud}
                        dark={dark}
                        pageType={pageType}
                        layout={layout}
                        selectors={selectors}
                        density={density}
                        qparams={qparams}
                    />
                </PageWrap>
            </Grid>
        </div>
    );
    return (
        <InnerWrapper
            layout={layout}
            selectors={selectors}
            density={density}
            qparams={qparams}
            qstate={qstate}
            width={width}
        />
    );
    /* return (
        <div>
            <p>Layout: {JSON.stringify(layout)}</p>
            <p>
                Selectors:
                {JSON.stringify(selectors)}
            </p>
            <p>
                Density:
                {JSON.stringify(density)}
            </p>
            -------------------------------------------
            <div>
                qparams:
                {JSON.stringify(qparams)}
            </div>
            <div>
                qstate:
                {JSON.stringify(qstate)}
            </div>
        </div>
    );*/
};
let LayoutRes = React.memo(
    ({ layoutNumber, layout, selectors, res, hot, density, ...other }) => {
        // if (Root.qparams)
        //    qparams = Root.qparams;

        let layres = layout[res];
        //  console.log("LAYRES", res, layres);
        let columns = layres ? layres.columns : [];
        console.log({ columns });
        let cols = columns.map((c, i) => {
            console.log("column", res, c);
            let type = c.type;
            let s = selectors[type];
            let msc = selectors["msc"];
            // console.log("column", s)

            return (
                <Column
                    layoutNumber={layoutNumber}
                    column={c}
                    selectors={s}
                    mscSelectors={msc}
                    colIndex={i}
                    res={res}
                    density={density}
                    {...other}
                />
            );
        });
        let View = styled.div`
            width: 100%;
            display: flex;
        `;
        let OuterWrap = styled.div`
            width: 100%;
        `;
        // console.log({ layres })
        return (
            <OuterWrap>
                {hot ? <HotlistRow layres={layres} {...other} /> : null}
                <View>{cols}</View>
            </OuterWrap>
        );
    }
);
const Q000 = ({ children }) => {
    const is = useMediaQuery({ maxWidth: 899 });
    return is ? children : null;
};
const Q900 = ({ children }) => {
    const is = useMediaQuery({ minWidth: 900, maxWidth: 1199 });
    return is ? children : null;
};
const Q1200 = ({ children }) => {
    const is = useMediaQuery({ minWidth: 1200, maxWidth: 1799 });
    return is ? children : null;
};
const Q1800 = ({ children }) => {
    const is = useMediaQuery({ minWidth: 1800, maxWidth: 2099 });
    return is ? children : null;
};
const Q2100 = ({ children }) => {
    const is = useMediaQuery({ minWidth: 2100 });
    return is ? children : null;
};
class InnerLayoutView extends React.Component {
    constructor(props, context) {
        super(props, context);
        // console.log("LayoutView constructor")
    }
    shouldComponentUpdate(nextProps) {
        let props = this.props;
        let widthChanged = props.width != nextProps.width;
        let layoutChanged = props.layout != nextProps.layout;
        let selChanged =
            !props.qparams ||
            !nextProps.qparams ||
            props.qparams.sel != nextProps.qparams.sel ||
            props.qparams.channel != nextProps.qparams.channel;
        //  console.log("shouldComponentUpdate LayoutView ", { widthChanged, layoutChanged, selChanged });
        return widthChanged || layoutChanged || selChanged;
    }
    render() {
        let { layout, width, density, ...other } = this.props;
        let layoutView = layout.layoutView;
        //   console.log("init layoutVIew", width, density);
        if (!layoutView.w900) return <div />;
        if (!layoutView.w900) {
            layoutView.w900 = { singleWidth: "25%", spaces: 4 };
        }
        if (!layoutView.w1200) {
            layoutView.w1200 = { singleWidth: "25%", spaces: 4 };
        }
        if (!layoutView.w1800) {
            layoutView.w1800 = { singleWidth: "25%", spaces: 4 };
        }
        if (!layoutView.w2100) {
            layoutView.w2100 = { singleWidth: "25%", spaces: 4 };
        }
        let layoutNumber = layout.layoutNumber;
        let res = `w${width}`;
        let totalWidth = 1;
        if (res != "w000") {
            totalWidth = getColumnsMap()[res][density];
        }

        console.log(" RENDER LAYOUTVIEW:", {
            width,
            totalWidth,
            colMap: getColumnsMap()["w900"][density].toFixed(2),
            perc: (
                (100 * layoutView.w1200.spaces) /
                getColumnsMap()["w1200"][density]
            ).toFixed(2),
            spaces: layoutView.w1200.spaces,
            density,
            layoutNumber,
            layoutView,
            percentWidhth:
                layoutView.w1200.singleWidth.split("%")[0] *
                layoutView.w1200.spaces,
        });

        // let columns = layout.columns;
        // let defaultWidth = session.get("defaultWidth");
        //  console.log("defaultWidth:", +defaultWidth, +session.get("width"))

        let W000 = styled.div`
            //  display:none;
            width: 100%;
            @media only screen and (min-width: 1px) and (max-width: 899px) {
                display: flex;
            }
        `;
        let W900 = styled.div`
            //  display:none;
            width: ${(
                (100 * layoutView.w900.spaces) /
                getColumnsMap()["w900"][density]
            ).toFixed(2)}%;
            @media only screen and (min-width: 900px) and (max-width: 1199px) {
                display: flex;
            }
        `;
        let W1200 = styled.div`
            // display:none;
            // margin-top: 4px;
            width: ${(
                (100 * layoutView.w1200.spaces) /
                getColumnsMap()["w1200"][density]
            ).toFixed(2)}%;
            @media only screen and (min-width: 1200px) and (max-width: 1799px) {
                display: flex;
            }
        `;
        let W1800 = styled.div`
            width: ${(
                (100 * layoutView.w1800.spaces) /
                getColumnsMap()["w900"][density]
            ).toFixed(2)}%;
            //  display:none;
            @media only screen and (min-width: 1800px) and (max-width: 2099px) {
                display: flex;
            }
        `;
        let W2100 = styled.div`
            width: ${(
                (100 * layoutView.w2100.spaces) /
                getColumnsMap()["w2100"][density]
            ).toFixed(2)}%;
            // display:none;
            @media only screen and (min-width: 2100px) {
                display: flex;
            }
        `;
        const OuterWrapper = styled.div`
            width: 100%;
            display: flex;
            justify-content: center;
        `;
        // console.log("LAYOUTVIEW ", { width })
        return (
            <OuterWrapper>
                <Q000>
                    <W000>
                        <LayoutRes
                            layout={layoutView}
                            layoutNumber={layoutNumber}
                            density={density}
                            {...other}
                            res="w900"
                        />
                    </W000>
                </Q000>
                <Q900>
                    <W900>
                        <LayoutRes
                            layout={layoutView}
                            layoutNumber={layoutNumber}
                            density={density}
                            {...other}
                            res="w900"
                        />
                    </W900>
                </Q900>
                <Q1200 id="q1200">
                    <W1200 id="w1200">
                        <LayoutRes
                            layout={layoutView}
                            layoutNumber={layoutNumber}
                            density={density}
                            {...other}
                            res="w1200"
                        />
                    </W1200>
                </Q1200>
                <Q1800>
                    <W1800>
                        <LayoutRes
                            layout={layoutView}
                            layoutNumber={layoutNumber}
                            density={density}
                            {...other}
                            res="w1800"
                        />
                    </W1800>
                </Q1800>
                <Q2100>
                    <W2100>
                        <LayoutRes
                            layout={layoutView}
                            layoutNumber={layoutNumber}
                            density={density}
                            {...other}
                            res="w2100"
                        />
                    </W2100>
                </Q2100>
            </OuterWrapper>
        );
        // return <div>{JSON.stringify(layout, null, 4)}</div>
    }
}
export default LayoutView;
