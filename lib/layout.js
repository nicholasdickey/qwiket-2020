import React from "react";
function processLayout({
    channelLayout,
    userLayout,
    pageType,
    density,
    layoutNumber,
}) {
    let layoutView = {};
    if (typeof userLayout === "string") {
        userLayout = JSON.parse(userLayout);
    }
    console.log(
        "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
        { pageType, density, layoutNumber }
    );
    if (!channelLayout) channelLayout = {};
    //   console.log({ pageType, density, channelLayout, userLayout, layoutNumber })
    //colW[x,y]  x: how many columns you need widh for. y: how many columns in the grid. For example, to find out the width of three column block in a 5 column layout colW[3,5]
    const colW = [
        null,
        [
            null,
            "100%",
            "50%",
            "33.3333%",
            "25%",
            "20%",
            "16.6666%",
            "14.2857%",
            "12.5%",
        ],
        [
            null,
            "100%",
            "100%",
            "66.6666%",
            "50%",
            "40%",
            "33.3333%",
            "28.5714%",
            "25%",
        ],
        [
            null,
            "100%",
            "100%",
            "100%",
            "75%",
            "60%",
            "50%",
            "42.8571%",
            "37.5%",
        ],
        [
            null,
            "100%",
            "100%",
            "100%",
            "100%",
            "80%",
            "66.6666%",
            "57.1429%",
            "50%",
        ],
        [
            null,
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "83.3333%",
            "71.4286%",
            "62.5%",
        ],
        [
            null,
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "85.7142%",
            "75%",
        ],
    ];
    let common;

    let numPages = 0;
    if (
        userLayout &&
        userLayout.layout &&
        userLayout.layout[pageType] &&
        userLayout.layout[pageType][layoutNumber]
    ) {
        let userTypeKeys = Object.keys(userLayout.layout);
        //   console.log("<<<>>>>", { pageType, userTypeKeys, userLayout })
        userTypeKeys.forEach(key => {
            if (key == pageType) {
                //  console.log("user match", { key, channelLayout })
                let chanTypeObject = channelLayout[key];
                let userTypeObject = userLayout.layout[key];
                let userNumKeys = Object.keys(userTypeObject);
                numPages = userNumKeys.length;
                //  console.log({ chanTypeObject, userTypeObject, userNumKeys })
                userNumKeys.forEach(numKey => {
                    //    console.log("forEach", { numKey })
                    if (numKey == layoutNumber) {
                        //      console.log("layoutNumber matched", numKey)
                        let userNumObject = userTypeObject[numKey];
                        let chanNumObject = chanTypeObject[numKey];
                        let chanResKeys = chanNumObject
                            ? Object.keys(chanNumObject)
                            : null;
                        //  console.log({ chanResKeys, userNumObject, chanNumObject })
                        if (!chanResKeys) {
                            //console.log("no chanResKeys, using user", Object.keys(userNumObject))
                            chanNumObject = userNumObject;
                            chanResKeys = Object.keys(userNumObject);
                        }
                        chanResKeys.forEach(resKey => {
                            if (resKey == "common") return;
                            // console.log("process ", resKey)
                            let densityChanObject = chanNumObject[resKey];
                            // console.log({ densityChanObject })
                            let densityUserObject = userNumObject
                                ? userNumObject[resKey]
                                : null;
                            if (!densityUserObject) {
                                // console.log("getting densityChanObject", { resKey })
                                densityUserObject = densityChanObject;
                            } else {
                                // console.log("user densityChanObject", { resKey })
                                if (!densityUserObject[density])
                                    densityUserObject = densityChanObject;
                            }
                            let columns = densityUserObject[density];
                            //  console.log({ columns })
                            let spaces = 0;
                            if (columns) {
                                columns.forEach(col => {
                                    spaces += col.width;
                                });
                            }
                            layoutView[resKey] = {
                                columns:
                                    densityUserObject &&
                                    densityUserObject[density]
                                        ? densityUserObject[density]
                                        : densityChanObject[density],
                                spaces,
                            };
                        });
                    }
                });
            }
        });
    } else {
        console.log({ channelLayout });
        let chanTypeKeys = Object.keys(channelLayout);
        //  let userLayout = { layout: {} };
        console.log("NO USER LAYOUT", { chanTypeKeys });
        chanTypeKeys.forEach(key => {
            //console.log("iterating types", { key, pageType });
            if (key == pageType) {
                console.log("match");
                // userLayout[pageType] = {}
                let chanTypeObject = channelLayout[key];
                let chanNumKeys = Object.keys(chanTypeObject);
                numPages = chanNumKeys.length;
                chanNumKeys.forEach(numKey => {
                    console.log("iterating layout numbers", {
                        numKey,
                        layoutNumber,
                    });
                    if (numKey == layoutNumber) {
                        //  userLayout[pageType][layoutNumber] = {};
                        let chanNumObject = chanTypeObject[numKey];
                        let chanResKeys = Object.keys(chanNumObject);
                        chanResKeys.forEach(resKey => {
                            console.log("iterating resolutions", resKey);
                            let densityChanObject = chanNumObject[resKey];
                            // console.log({ densityChanObject })
                            let columns = densityChanObject[density];
                            // console.log({ columns })
                            let spaces = 0;

                            if (columns)
                                columns.forEach(col => {
                                    spaces += col.width;
                                });
                            layoutView[resKey] = {
                                columns: densityChanObject[density],
                                spaces,
                            };

                            //  userLayout[pageType][layoutNumber][resKey] = { density: densityChanObject }; // userLayout object in case user wants to change it
                        });
                    }
                });
            }
        });
    }

    //now that we have the total number of spaces, we can calculate the percentWidth of each column
    let resKeys = Object.keys(layoutView);
    console.log(">>>>>>>>>>>>>", { layoutView, resKeys });
    resKeys.forEach(key => {
        if (key == "common") return;
        let resObject = layoutView[key];
        //  console.log({ key, resObject })
        let spaces = resObject.spaces;
        let columns = resObject.columns;
        columns.map(c => {
            // console.log("PROCESS LAYOUT", c.width, spaces, colW[c.width][spaces])
            c.percentWidth = colW[c.width][spaces];
        });
        layoutView[key] = { spaces, columns, singleWidth: colW[1][spaces] };
    });
    //last, we will add for reference the margin percentages (hpad) for the grid at each resolution (note,there are more hpad resolutions than layout versiona):
    let hpads = {
        w0: "5px",
        w750: "2.5%",
        w900: "1%",
        w1200: "1%",
        w1600: "6%",
        w1800: "6%",
        w1950: "8%",
        w2100: "9%",
        w2400: "10%",
    };
    /* layoutView.density = density;
     layoutView.pageType = pageType;
     layoutView.layoutNumber = layoutNumber;
     layoutView.hpads = hpads*/
    return { layoutView, density, pageType, layoutNumber, hpads, numPages };
}

export function changeUserLayout({
    qparams,
    updateUserLayout,
    userLayout,
    pageType,
    colIndex,
    colType,
    layoutNumber,
    selector,
    res,
    density,
    chanConfig,
    isMsc,
}) {
    const ui = userLayout; //? Immutable.fromJS(userLayout) : null;
    console.log("changeUserLayout1:", {
        colType,
        selector,
        isMsc,
        pageType,
        userLayout: ui,
        chanConfig,
    });
    //if (Root.qparams) qparams = Root.qparams;
    if (!userLayout) userLayout = { layout: {} };
    else {
        try {
            if (typeof userLayout === "string")
                userLayout = JSON.parse(userLayout);
        } catch (x) {
            console.log(x);
            userLayout = { layout: {} };
        }
    }
    const ui2 = userLayout;
    //  console.log("changeUserLayout2:", { userLayout0: userLayout, userLayout: ui2.toJS(), pageType, layoutNumber, res, density, colIndex })

    //   userLayout.layout[pageType][`l${layoutNumber}`][res][density] = Immutable.fromJS(densityLayout).toJS();

    if (!userLayout.layout) {
        // console.log("new layout")
        userLayout.layout = {};
    }
    if (!userLayout.layout[pageType]) {
        // console.log("new pageType")
        userLayout.layout[pageType] = {};
    }
    if (!userLayout.layout[pageType][layoutNumber]) {
        userLayout.layout[pageType][layoutNumber] = {};
        // console.log("new layout number", { userLayout, pageType, layoutNumber })
    }
    if (!userLayout.layout[pageType][layoutNumber][res]) {
        userLayout.layout[pageType][layoutNumber][res] = {};
        //  console.log("new res", { res })
    }
    if (!userLayout.layout[pageType][layoutNumber][res][density]) {
        userLayout.layout[pageType][layoutNumber][res][density] =
            chanConfig["layout"][pageType][layoutNumber][res][density]; // init from channel
        // console.log("new density", { density })
    }
    if (!userLayout.layout[pageType][layoutNumber][res][density][colIndex]) {
        userLayout.layout[pageType][layoutNumber][res][density][colIndex] = {};
        //  console.log("new colIndex", { userLayout, colIndex })
    }
    const ui3 = userLayout;
    //  console.log("changeUserLayout3:", { userLayout0: userLayout, userLayout: ui3.toJS(), pageType, layoutNumber, res, density, colIndex })

    if (colType == "mp" && isMsc) {
        userLayout.layout[pageType][layoutNumber][res][density][
            colIndex
        ].msc = selector;
    } else if (selector) {
        userLayout.layout[pageType][layoutNumber][res][density][
            colIndex
        ].selector = selector;
    }

    userLayout.layout[pageType][layoutNumber][res][density][
        colIndex
    ].type = colType;
    const ui4 = userLayout;
    // console.log("changeUserLayout4:", { userLayout0: userLayout, userLayout: ui4.toJS(), pageType, layoutNumber, res, density, colIndex })

    let update = {
        userLayout: JSON.stringify(userLayout),
    };
    // console.log("changeUserLayout", { update })
    updateUserLayout(update);
    refresh({ qparams });
    // let link = route({ sel: pageType, qparams, nextParams: {} });
    // link.href.query.add = '1';
    // console.log("changeUserLayout link:", { qparams, link });
    // setTimeout(() => Router.replace(link.href, link.as), 400);
}
export function parseLayout({ qparams, qstate }) {
    let pageType = qparams.sel ? qparams.sel : "newsline";

    // if (Root.qparams) qparams = Root.qparams;
    //  console.log('parseLayout:', { qparams })
    let { session, user, channel } = qstate;
    console.log("PArseLayout", {
        pageType,
        session,
        qparams,
    });
    // console.log("userLayout:", session.get("userLayout"))
    let ul = user?.config?.userLayout; //get("user_layout");
    //  console.log({ userLayout: ul })
    let userLayout;
    try {
        userLayout = ul
            ? typeof ul === "string"
                ? JSON.parse(ul)
                : ul
            : { layout: {} };
    } catch (x) {
        console.log(x);
        userLayout = { layout: {} };
    }
    //  console.log("parseLayout:", { userLayout })

    let channelConfig = channel?.config;
    let channelLayout = channelConfig?.layout;
    if (typeof channelLayout === "string") {
        channelLayout = JSON.parse(channelLayout);
    }

    let density = +session?.options?.thick
        ? +session.options.dense
            ? "dense"
            : "thick"
        : "normal";
    let layoutNumber = qparams.layout ? qparams.layout : 1; //session.get("layoutNumber") ? session.get("layoutNumber") : "l1";
    /* console.log({
        channelConfig,
        channelLayout,
        userLayout,
        pageType,
        density,
        layoutNumber,
    });*/
    let layout = processLayout({
        channelLayout,
        userLayout,
        pageType,
        density,
        layoutNumber: `l${layoutNumber}`,
    });

    let channelSelectors = channelConfig?.selectors;
    if (typeof channelSelectors === "string") {
        channelSelectors = JSON.parse(channelSelectors);
    }

    let selectors = channelSelectors ? channelSelectors[pageType] : [];

    //console.log("PARSE LAYOUT", { layout, selectors, density });
    return { layout, selectors, density, pageType };
}
const Layout = props => {
    // console.log("props:", props);
    let { qparams, qstate, children, ...rest } = props;
    if (!qparams) qparams = {};

    let { channel, session, user } = qstate;
    let chanConfig, userLayout;
    //console.log("Layout:", { channel, session, user });
    if (channel && session && user) {
        chanConfig = channel?.config;
        userLayout = user?.userConfig?.userLayout;
    }
    //if (!chanConfig || !userLayout) return <div />;

    let { layout, selectors, density, pageType } = parseLayout({
        qparams,
        qstate,
    });
    return React.cloneElement(children, {
        qparams,
        qstate,
        layout,
        selectors,
        density,
        pageType,
        ...rest,
    });
};
export default Layout;
