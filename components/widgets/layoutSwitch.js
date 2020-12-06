import React from "react";
import chalk from "chalk";
import styled from "styled-components";
import Router from "next/router";
import update from "immutability-helper";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Box1 from "mdi-material-ui/Numeric1Box";
import Box2 from "mdi-material-ui/Numeric2Box";
import Box3 from "mdi-material-ui/Numeric3Box";
import Box4 from "mdi-material-ui/Numeric4Box";
import Box5 from "mdi-material-ui/Numeric5Box";
import Box6 from "mdi-material-ui/Numeric6Box";
import Box7 from "mdi-material-ui/Numeric7Box";
import Box8 from "mdi-material-ui/Numeric8Box";
import Box9 from "mdi-material-ui/Numeric9Box";
import Box10 from "mdi-material-ui/Numeric10Box";

import Box1Outline from "mdi-material-ui/Numeric1BoxOutline";
import Box2Outline from "mdi-material-ui/Numeric2BoxOutline";
import Box3Outline from "mdi-material-ui/Numeric3BoxOutline";
import Box4Outline from "mdi-material-ui/Numeric4BoxOutline";
import Box5Outline from "mdi-material-ui/Numeric5BoxOutline";
import Box6Outline from "mdi-material-ui/Numeric6BoxOutline";
import Box7Outline from "mdi-material-ui/Numeric7BoxOutline";
import Box8Outline from "mdi-material-ui/Numeric8BoxOutline";
import Box9Outline from "mdi-material-ui/Numeric9BoxOutline";
import Box10Outline from "mdi-material-ui/Numeric10BoxOutline";

import Users from "mdi-material-ui/AccountMultiple";

import SmallDesktop from "mdi-material-ui/Laptop";
import LargeDesktop from "mdi-material-ui/DesktopMac";
import TabletVertical from "mdi-material-ui/TabletIpad";
import TabletHorizontal from "mdi-material-ui/Tablet";

import PlusBox from "mdi-material-ui/PlusBoxOutline";
import Dots from "mdi-material-ui/DotsHorizontal";
import Edit from "mdi-material-ui/SquareEditOutline";
import Right from "mdi-material-ui/ChevronRightBoxOutline";
import Left from "mdi-material-ui/ChevronLeftBoxOutline";

import Divider from "@material-ui/core/Divider";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import { refresh, route } from "../../lib/qwiketRouter";
import { getColumnsMap } from "../../lib/layout";
let defaultPage = {
    w900: {
        normal: [{ type: "stc", width: 1, selector: "newsviews" }],
        thick: [{ type: "stc", width: 2, selector: "newsviews" }],
        dense: [
            { type: "stc", width: 1, selector: "newsviews" },
            { type: "stc", width: 1, selector: "topics" },
        ],
    },
    w1200: {
        normal: [{ type: "stc", width: 1, selector: "newsviews" }],
        thick: [{ type: "stc", width: 2, selector: "newsviews" }],
        dense: [
            { type: "stc", width: 1, selector: "newsviews" },
            { type: "stc", width: 1, selector: "topics" },
        ],
    },
    w1800: {
        normal: [{ type: "stc", width: 1, selector: "newsviews" }],
        thick: [{ type: "stc", width: 2, selector: "newsviews" }],
        dense: [
            { type: "stc", width: 1, selector: "newsviews" },
            { type: "stc", width: 1, selector: "topics" },
        ],
    },
    w2100: {
        normal: [{ type: "stc", width: 1, selector: "newsviews" }],
        thick: [{ type: "stc", width: 2, selector: "newsviews" }],
        dense: [
            { type: "stc", width: 1, selector: "newsviews" },
            { type: "stc", width: 1, selector: "topics" },
        ],
    },
};
let selectedIcons = [
    <Box1 className="page" />,
    <Box2 className="page" />,
    <Box3 className="page" />,
    <Box4 className="page" />,
    <Box5 className="page" />,
    <Box6 className="page" />,
    <Box7 className="page" />,
    <Box8 className="page" />,
    <Box9 className="page" />,
    <Box10 className="page" />,
];
let icons = [
    <Box1Outline className="page" />,
    <Box2Outline className="page" />,
    <Box3Outline className="page" />,
    <Box4Outline className="page" />,
    <Box5Outline className="page" />,
    <Box6Outline className="page" />,
    <Box7Outline className="page" />,
    <Box8Outline className="page" />,
    <Box9Outline className="page" />,
    <Box10Outline className="page" />,
];

let selectedResIcons = [
    <TabletVertical className="small-icon-selected" />,
    <TabletHorizontal className="res-icon-selected" />,
    <SmallDesktop className="res-icon-selected" />,
    <LargeDesktop className="res-icon-selected" />,
];
let resIcons = [
    <TabletVertical className="small-res-icon" />,
    <TabletHorizontal className="res-icon" />,
    <SmallDesktop className="res-icon" />,
    <LargeDesktop className="res-icon" />,
];

/**
 * EDITOR
 */
let StyledDiv = styled.div`
    min-width: 600px;
    color: ${props => props.color};
    background-color: ${props => props.backgroundColor};
    & .dialog-root {
        min-width: 600px;
    }
    & .add {
        color: green;
        font-size: 1.5rem;
    }
    & .page {
        font-size: 1.5rem;
        color: ${props => props.color};
    }
    & .densities {
        margin-top: 10px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    & .res-icon {
        color: grey;
        width: 32px;
        height: 32px;
    }
    & .res-icon-selected {
        color: green;
        width: 32px;
        height: 32px;
    }
    & .small-res-icon {
        color: grey;
        margin-top: 4px;
        width: 24px;
        height: 24px;
    }
    & .small-res-icon-selected {
        color: green;
        margin-top: 4px;
        width: 24px;
        height: 24px;
    }
    & .expansion-panel {
        width: 100%;
    }
`;

let FooterButtons = styled.div`
    display: flex;
`;
let Title = styled.div`
    width: 150px;
    height: 24px;
    font-size: 0.9rem;
    text-valign: center;
    padding-top: 10px;
    align-self: flex-end;
    // color:grey;
`;
let Text = styled.div`
    margin-bottom: 20px;
    margin-top: 20px;
    color: grey;
`;
let Layouts = styled.div`
    margin-top: 20px;
`;
let StyledColumn = styled.div`
    background-color: ${props => (props.selected ? "green" : "grey")};
    height: 120px;
`;
let MP = styled.div`
    background-color: ${props => (props.selected ? "green" : "grey")};
    height: 90px;
`;
let MP2 = styled.div`
    background-color: ${props => (props.selected ? "green" : "grey")};
    height: 90px;
    border-left: thin solid white;
`;
let MPHeader = styled.div`
    background-color: ${props => (props.selected ? "green" : "grey")};
    height: 30px;
    border-bottom: thin solid white;
`;
let ColumnType = styled.div`
    font-size: 1.5rem;
    font-weight: 500;
    margin-right: 60px;
    width: 160px;
`;
let ColumnText = styled.div`
    margin-left: 40px;
`;
let ColumnHeader = styled.div`
    display: flex;
    padding: 10px;
    align-items: center;
    font-size: 1.2rem;
    justify-content: space-between;
`;
let ColumnFooter = styled.div`
    display: flex;
    padding: 10px;
    font-size: 0.9rem;
    align-items: center;
    justify-content: space-between;
`;
let ColumnHeaderWrapper = styled.div`
    margin-bottom: 10px;
    margin-top: 40px;
`;
let AddControl = styled.div`
    display: flex;
    align-items: center;
`;
let Num = styled.div`
    font-size: 2rem;
    color: blue;
`;
let LayoutEditor = ({
    width,
    density: defaultDensity,
    pageType: defaultPageType,
    qparams,
    userLayout: defaultUserLayout,
    layoutNumber: defaultLayoutNumber,
    channelConfig,
    openSpec: openSpecDefault,
    setOpen,
    actions,
    numPages: numPagesDefault,
}) => {
    let res = `w${width}`;
    const [userLayout, setUserLayout] = React.useState(defaultUserLayout);

    const [pageType, setPageType] = React.useState(defaultPageType);
    const [layoutNumber, setLayoutNumber] = React.useState(defaultLayoutNumber);
    const [density, setDensity] = React.useState(defaultDensity);
    // const [res, setRes] = React.useState(defaultRes);
    const [expanded, setExpanded] = React.useState("edit-panel");
    const [selectedColumn, setSelectedColumn] = React.useState(0);

    const [numPages, setNumPages] = React.useState(numPagesDefault);
    const [openSpec, setOpenSpec] = React.useState(openSpecDefault);
    const muiTheme = useTheme();
    const fullScreen = useMediaQuery(muiTheme.breakpoints.down("sm"));

    let open = openSpec.open;
    //  if (typeof channelConfig === "string")
    //     channelConfig = JSON.parse(channelConfig);
    console.log("RENDER", { layoutNumber, channelConfig, userLayout });

    let densityOptions = ["Normal", "Thick", "Dense"];
    let densityValues = ["normal", "thick", "dense"];

    let pageTypeOptions = ["Newsline", "Story Context", "User", "My Home"];
    let pageTypeValues = ["newsline", "context", "user", "myhome"];

    let screenValues = ["w900", "w1200", "w1800", "w2100"];
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    // console.log("RENDER LAYOUT EDITOR");
    const backgroundColor = muiTheme.palette.background;
    const color = muiTheme.palette.text.primary;

    let numberLayouts = numPages; // userLayout && userLayout.layout && userLayout.layout.numberLayouts ? userLayout.layout.numberLayouts : 3;
    let items = [];
    let GridItem = styled.div`
        font-size: 1rem;
    `;
    let Filler = styled.div`
        width: 40px;
    `;
    for (var i = 0; i < numberLayouts; i++) {
        let l = i + 1;
        let item = (
            <Grid key={`layout-switch-grid-${i}`} item sm>
                <GridItem>
                    <IconButton onClick={() => setLayoutNumber(l)}>
                        {layoutNumber - 1 == i ? selectedIcons[i] : icons[i]}
                    </IconButton>
                </GridItem>{" "}
            </Grid>
        );
        items.push(item);
    }
    let screens = [];
    for (var i = 0; i < 4; i++) {
        let l = i + 1;
        let item = (
            <Grid key={`layout-switch-grid-${i}`} item sm>
                <GridItem>
                    <IconButton onClick={() => setLayoutNumber(l)}>
                        {res == screenValues[i]
                            ? selectedResIcons[i]
                            : resIcons[i]}
                    </IconButton>
                </GridItem>{" "}
            </Grid>
        );
        screens.push(item);
    }
    let densities = [];
    for (var i = 0; i < 3; i++) {
        let densityOption = densityOptions[i];
        let densityValue = densityValues[i];
        let item = (
            <FormControlLabel
                value={densityValue}
                control={<Radio />}
                label={densityOption}
            />
        );
        densities.push(item);
    }
    let pageTypes = [];
    for (var i = 0; i < 4; i++) {
        let pageTypeOption = pageTypeOptions[i];
        let pageTypeValue = pageTypeValues[i];
        let item = (
            <FormControlLabel
                value={pageTypeValue}
                control={<Radio />}
                label={pageTypeOption}
            />
        );
        pageTypes.push(item);
    }
    let add = (
        <Grid item sm>
            <IconButton onClick={() => addNewPage()}>
                <PlusBox className="add" />
            </IconButton>
        </Grid>
    );

    let layout = userLayout.layout;
    console.log({ userLayout });
    if (!layout) {
        userLayout.layout = {};
        console.log("setUserLayout");
        setUserLayout(userLayout);
        layout = userLayout.layout;
    }
    let pageTypeLayout = layout[pageType];
    if (!pageTypeLayout) {
        //first try to get the default from channel
        pageTypeLayout = channelConfig.layout[pageType];
        console.log({ pageTypeLayout });
        if (!pageTypeLayout) pageTypeLayout = {};
        userLayout.layout[pageType] = pageTypeLayout;
        setUserLayout(userLayout);
    }
    let pageLayout = pageTypeLayout[`l${layoutNumber}`];
    if (!pageLayout) {
        let chanTypeLayout = channelConfig.layout[pageType];
        console.log({ chanTypeLayout });
        if (chanTypeLayout) {
            let chanPageLayout = chanTypeLayout[`l${layoutNumber}`];
            console.log({
                page: `l${layoutNumber}`,
                chanPageLayout: chanPageLayout ? chanPageLayout : "",
            });

            if (chanPageLayout) {
                pageLayout = chanPageLayout;
            }
        }
        if (!pageLayout) {
            pageLayout = {};
        }
        pageTypeLayout[`l${layoutNumber}`] = pageLayout;
        userLayout.layout[pageType] = pageTypeLayout;
        console.log("setUserLayout2");
        setUserLayout(userLayout);
    }
    let resLayout = pageLayout[res];
    if (!resLayout) {
        let chanTypeLayout = channelConfig.layout[pageType];
        console.log({ chanTypeLayout: chanTypeLayout });
        if (chanTypeLayout) {
            let chanPageLayout = chanTypeLayout[`l${layoutNumber}`];
            if (chanPageLayout) {
                let chanResLayout = chanPageLayout[res];
                console.log({
                    res,
                    chanResLayout: chanResLayout ? chanResLayout : "",
                });
                if (chanResLayout) {
                    resLayout = chanResLayout;
                }
            }
        }
        if (!resLayout) {
            resLayout = {};
        }
        pageLayout[res] = resLayout;
        pageTypeLayout[`l${layoutNumber}`] = pageLayout;
        userLayout.layout[pageType] = pageTypeLayout;
        console.log("setUserLayout3");
        setUserLayout(userLayout);
    }
    let densityLayout = resLayout[density];
    if (!densityLayout) {
        let chanTypeLayout = channelConfig.layout[pageType];
        console.log({ layoutNumber, chanTypeLayout });
        if (chanTypeLayout) {
            let chanPageLayout = chanTypeLayout[`l${layoutNumber}`];
            console.log({ chanPageLayout });
            if (chanPageLayout) {
                let chanResLayout = chanPageLayout[res];
                console.log({ chanResLayout });
                if (chanResLayout) {
                    let chanDensityLayout = chanResLayout[density];
                    console.log({ density, chanDensityLayout });
                    if (chanDensityLayout) {
                        densityLayout = chanDensityLayout;
                    }
                }
            }
        }
        if (!densityLayout) {
            densityLayout = {};
        }
        resLayout[density] = densityLayout;
        pageLayout[res] = resLayout;
        pageTypeLayout[`l${layoutNumber}`] = pageLayout;
        userLayout.layout[pageType] = pageTypeLayout;
        console.log("setUserLayout4");
        setUserLayout(userLayout);
    }
    let totalWidth = 1;
    if (res != "w000") {
        totalWidth = getColumnsMap()[res][density];
    }
    console.log("RED1", {
        res,
        density,
        totalWidth,
        columnsMap: getColumnsMap(),
    });
    /*  switch (res) {
        case "w900":
            totalWidth = 4;
            break;
        case "w1200":
            switch (density) {
                case "normal":
                    totalWidth = 5;
                    break;
                default:
                    totalWidth = 6;
            }
            break;
        case "w1800":
            switch (density) {
                case "normal":
                    totalWidth = 6;
                    break;
                default:
                    totalWidth = 7;
            }
            break;
        case "w2100":
            switch (density) {
                case "normal":
                    totalWidth = 7;
                    break;
                default:
                    totalWidth = 8;
            }
    }*/
    let usedWidth = 0;
    let hasMP = false;
    let totalColumns = 0;
    // console.log({ densityLayout });
    let editorColumns = densityLayout
        ? densityLayout.map((column, index) => {
              let type = column.type;
              if (type == "mp") hasMP = true;
              let width = column.width;
              usedWidth += width;
              totalColumns++;
              let selected = index == selectedColumn;
              console.log("render column", { index, width, selected });

              let columnIndex = index;
              let col;
              if (type == "stc")
                  col = (
                      <Grid
                          item
                          xs={width}
                          onClick={() => {
                              setSelectedColumn(columnIndex);
                          }}>
                          {" "}
                          <StyledColumn selected={selected} />
                      </Grid>
                  );
              else
                  col = (
                      <Grid
                          item
                          xs={width}
                          onClick={() => {
                              setSelectedColumn(columnIndex);
                          }}>
                          {" "}
                          <StyledColumn selected={selected}>
                              <MPHeader selected={selected} />
                              <Grid container>
                                  <Grid item xs={9}>
                                      <MP selected={selected} />
                                  </Grid>
                                  <Grid item xs={3}>
                                      <MP2 selected={selected} />
                                  </Grid>
                              </Grid>
                          </StyledColumn>
                      </Grid>
                  );

              return col;
          })
        : {};
    //console.log("cont1");
    let remainingWidth = totalWidth - usedWidth;

    let sel = densityLayout[selectedColumn];
    if (!sel) {
        console.log("setSelectedColumn");
        setSelectedColumn(0);
        sel = densityLayout[0];
    }

    console.log("cont2", sel);
    let columnHeader = (
        <ColumnHeaderWrapper>
            <Paper elevation={8}>
                <ColumnHeader>
                    <ColumnHeader>
                        <ColumnType>
                            {sel.type == "stc" ? "Column" : "Main Panel"}
                        </ColumnType>
                        <AddControl>
                            <ColumnText>width: </ColumnText>
                            <IconButton
                                disabled={
                                    (sel.type == "mp" && sel.width == 3) ||
                                    sel.width == 1
                                }
                                onClick={() =>
                                    changeColumn({ action: "minus" })
                                }>
                                <Left />
                            </IconButton>
                            {sel.width}
                            <IconButton
                                disabled={remainingWidth == 0}
                                onClick={() =>
                                    changeColumn({ action: "plus" })
                                }>
                                <Right />
                            </IconButton>
                        </AddControl>
                    </ColumnHeader>
                    <Button
                        disabled={totalColumns == 1}
                        onClick={() => {
                            changeColumn({ action: "delete" });
                            setSelectedColumn(0);
                        }}
                        color="primary">
                        Delete Column
                    </Button>
                </ColumnHeader>
            </Paper>
        </ColumnHeaderWrapper>
    );

    // console.log("cont3", { totalWidth, usedWidth, remainingWidth });
    let columnFooter = (
        <ColumnHeaderWrapper>
            <Paper elevation={8}>
                <ColumnFooter>
                    <ColumnText>Total width: {totalWidth}</ColumnText>
                    <ColumnText>Used width: {usedWidth}</ColumnText>
                    <ColumnText>Remaiing width: {remainingWidth}</ColumnText>
                    <FooterButtons>
                        <Button
                            disabled={remainingWidth == 0}
                            onClick={() =>
                                changeColumn({ action: "add", type: "stc" })
                            }
                            color="primary">
                            Add Column
                        </Button>
                        <Button
                            disabled={remainingWidth < 3 || hasMP}
                            onClick={() =>
                                changeColumn({ action: "add", type: "mp" })
                            }
                            color="primary">
                            Add Main Panel
                        </Button>
                        <Button
                            onClick={() =>
                                changeColumn({ action: "delete-layout" })
                            }
                            color="primary">
                            Revert Layout
                        </Button>
                    </FooterButtons>
                </ColumnFooter>
            </Paper>
        </ColumnHeaderWrapper>
    );
    // console.log("cont4");
    const addNewPage = () => {
        let pageTypeLayout = userLayout.layout[pageType];
        let numKeys = Object.keys(pageTypeLayout);
        if (numKeys.length == 10) return;
        let newKey = +numKeys.length + 1;
        userLayout.layout[pageType][`l${newKey}`] = defaultPage;
        //console.log("1234 ", { numKeys, newKey, userLayout, pageTypeLayout });
        setNumPages(newKey);
        setLayoutNumber(newKey);
    };
    if (openSpec) {
        if (openSpec.newPage) {
            console.log("openSpec.newPage");
            setOpenSpec({ open: true, newPage: false });
            addNewPage();
        }
    }
    const changeColumn = ({ action, type }) => {
        console.log("userLayout changeColumn", { action, type });
        let newLayout;
        const ul =
            userLayout.layout[pageType][`l${layoutNumber}`][res][density];

        //  console.log('userLayout before:', ul)

        if (action == "delete-layout") {
            let chanTypeLayout = channelConfig["layout"][pageType];
            //  console.log({ chanTypeLayout: chanTypeLayout.toJS() })
            if (chanTypeLayout) {
                let chanPageLayout = chanTypeLayout[`l${layoutNumber}`];
                if (chanPageLayout) {
                    console.log({ chanPageLayout, userLayout });
                    newLayout = update(userLayout, {
                        layout: {
                            [pageType]: {
                                [`l${layoutNumber}`]: { $set: chanPageLayout },
                            },
                        },
                    });
                }
            }
        } else if (action == "add") {
            newLayout = update(userLayout, {
                layout: {
                    [pageType]: {
                        [`l${layoutNumber}`]: ln =>
                            update(ln || {}, {
                                //auto vivification
                                [res]: rs =>
                                    update(rs || {}, {
                                        [density]: dens =>
                                            update(dens || [], {
                                                $push: [
                                                    type == "stc"
                                                        ? {
                                                              type,
                                                              width:
                                                                  type == "stc"
                                                                      ? 1
                                                                      : 4,
                                                          }
                                                        : pageType == "newsline"
                                                        ? {
                                                              type,
                                                              width: 4,
                                                              selector:
                                                                  "newsline",
                                                              msc: "navigator",
                                                          }
                                                        : {
                                                              type,
                                                              width: 4,
                                                              selector: "topic",
                                                              msc: "feed",
                                                          },
                                                ],
                                            }),
                                    }),
                            }),
                    },
                },
            });
            /*
              newLayout = newLayout = update(userLayout, {
                layout: {
                    [pageType]: {
                        [`l${layoutNumber}`]: {
                            [res]: {
                                [density]: {
                                    $push:
                                        type == "stc"
                                            ? {
                                                  type,
                                                  width: type == "stc" ? 1 : 4,
                                              }
                                            : pageType == "newsline"
                                            ? {
                                                  type,
                                                  width: 4,
                                                  selector: "newsline",
                                                  msc: "navigator",
                                              }
                                            : {
                                                  type,
                                                  width: 4,
                                                  selector: "topic",
                                                  msc: "feed",
                                              },
                                },
                            },
                        },
                    },
                },
            });*/
            /* densityLayout.push(
                type == "stc"
                    ? { type, width: type == "stc" ? 1 : 4 }
                    : pageType == "newsline"
                    ? { type, width: 4, selector: "newsline", msc: "navigator" }
                    : { type, width: 4, selector: "topic", msc: "feed" }
            );*/
        } else if (action == "delete") {
            newLayout = update(userLayout, {
                layout: {
                    [pageType]: {
                        [`l${layoutNumber}`]: {
                            [res]: {
                                [density]: {
                                    $splice: [[selectedColumn, 1]],
                                },
                            },
                        },
                    },
                },
            });
            // densityLayout.splice(selectedColumn, 1);
            console.log("userLayout splice", { densityLayout, selectedColumn });
        } else {
            let column = { ...densityLayout[selectedColumn] };
            switch (action) {
                case "plus":
                    column.width += 1;
                    break;
                case "minus":
                    column.width -= 1;
                    console.log("minus", column.width);
                    break;
            }
            // densityLayout[selectedColumn] = column;
            newLayout = update(userLayout, {
                layout: {
                    [pageType]: {
                        [`l${layoutNumber}`]: {
                            [res]: {
                                [density]: {
                                    [selectedColumn]: { $set: column },
                                },
                            },
                        },
                    },
                },
            });
        }
        /* const newLayout = update{ ...userLayout };
        userLayout.layout[pageType][`l${layoutNumber}`][res][
            density
        ] = densityLayout;*/
        /* const newLayout = update(userLayout, {
            layout: {
                [pageType]: {
                    [`l${layoutNumber}`]: {
                        [res]: { [density]: { $set: densityLayout } },
                    },
                },
            },
        });*/
        //  console.log('userLayout after:', { userLayout }, userLayout.layout[pageType][`l${layoutNumber}`][res][density])
        // console.log("111");
        // setUpdate(Math.random(1000));
        console.log("setting ", {
            pageType,
            layoutNumber,
            res,
            density,
            userLayout,
            newLayout,
        });
        setUserLayout(newLayout);
        // console.log("222");
    };
    console.log(
        "userLayout render:",
        userLayout.layout[pageType][`l${layoutNumber}`][res][density]
    );

    return (
        <Dialog
            fullScreen={fullScreen}
            maxWidth={"md"}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title">
            <StyledDiv color={color} backgroundColor={backgroundColor}>
                <DialogTitle id="responsive-dialog-title">{`Layout Editor`}</DialogTitle>

                <DialogContent>
                    <ExpansionPanel
                        expanded={expanded === "selection-panel"}
                        className="expansion-panel"
                        onChange={() => setExpanded("selection-panel")}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="selection-content"
                            id="selection-header">
                            <Typography variant="h6" gutterBottom>{`
        Advanced: Layout Selection for editing
            `}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                <Typography variant="h6" gutterBottom>{`
            `}</Typography>
                                <Text>{`
                     By default, you are all setup to edit the current screen and page configuration.Alternatively, you can edit all possible layout variations here.
                    `}</Text>
                                <Divider />
                                <Text>{`
        Different page types have their own layouts:
        `}</Text>
                                <FormControl
                                    fullWidth
                                    component="fieldset"
                                    className="densities">
                                    <Grid container spacing={3}>
                                        <Grid item sm>
                                            Page Type:
                                        </Grid>
                                        <RadioGroup
                                            aria-label="pageType"
                                            name="pageType"
                                            value={pageType}
                                            onChange={e => {
                                                setPageType(e.target.value);
                                            }}
                                            row>
                                            {pageTypes}
                                        </RadioGroup>
                                    </Grid>
                                </FormControl>
                                <Divider />
                                <Text>{`
        You can define multiple layouts, or layout pages for each page type:
            `}</Text>
                                <Layouts>
                                    <Grid container spacing={0}>
                                        <Grid item sm>
                                            <Title>Layout Pages:</Title>
                                        </Grid>
                                        {items}
                                        <Grid item sm>
                                            <Filler />
                                        </Grid>
                                        {add}
                                    </Grid>
                                </Layouts>
                                <Divider />
                                <Text>{`
        Select a screen size for the following page width breakpoints: 900px, 1200px, 1800px, 2100px.For example - large desktop: > 2100px, small desktop: 1800px <> 2100px, horizontal tablet: 1200px <> 1800px, vertical tablet: 900px <> 1200px.
                    `}</Text>
                                <Layouts>
                                    <Grid container spacing={3}>
                                        <Grid item sm>
                                            <Title>Screen:</Title>
                                        </Grid>
                                        {screens}
                                        <Grid item sm>
                                            <Filler />
                                        </Grid>
                                    </Grid>
                                </Layouts>
                                <Divider />
                                <Text>{`
        We provide different layout versions for different density choices:
            `}</Text>
                                <FormControl
                                    fullWidth
                                    component="fieldset"
                                    className="densities">
                                    <Grid container spacing={3}>
                                        <Grid item sm>
                                            Density:
                                        </Grid>
                                        <RadioGroup
                                            aria-label="density"
                                            name="density"
                                            value={density}
                                            onChange={e => {
                                                setDensity(e.target.value);
                                            }}
                                            row>
                                            {densities}
                                        </RadioGroup>
                                    </Grid>
                                </FormControl>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <Divider />
                    <ExpansionPanel
                        expanded={expanded === "edit-panel"}
                        className="expansion-panel"
                        onChange={() => setExpanded("edit-panel")}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="selection-content"
                            id="selection-header">
                            <Typography
                                variant="h6"
                                gutterBottom>{`Layout Edit`}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                <Text>{`A Layout consists of a combination of columns with a main panel - depending on the page type, it is either a newsline or a story context, a main area with a seconary column.
        Each column or main panel has a property "width" or a number of vertical spaces, which could be '1' or more for a column, or '3' or more for a main panel.Depending on density and page sie, the total number of the vertical spaces is between 3 and 8
        Main panel is optional for secondary views (i.e. views other than #1).  
            `}</Text>
                                {columnHeader}
                                <Paper elevation={8}>
                                    <Grid
                                        alignContent="center"
                                        justify="center"
                                        container
                                        spacing={1}>
                                        {editorColumns}
                                    </Grid>
                                </Paper>
                                {columnFooter}
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            console.log("saving", {
                                userLayout,
                                string: JSON.stringify(userLayout),
                            });
                            actions.updateUserConfig({
                                userLayout: {
                                    $set: userLayout,
                                },
                            }); /*refresh({ qparams })*/
                        }}
                        color="primary"
                        autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </StyledDiv>
        </Dialog>
    );
};
let LSDiv = styled.div`
        height: 58px;
        margin-bottom:-14px;
        display:flex;
        align-items:center;
       & .add{
            color: grey;
            font - size: 1.5rem;

        }
        & .page{
            font - size: 1.5rem;
            color: grey;
        }
        `;
let AddDiv = styled.div`
    // margin-left:40px;
`;
let GridItem = styled.div`
        font - size: 1.0rem;
        `;
let Filler = styled.div`
    width: 40px;
`;
let ResIcon = styled.div`
    display: flex;
    align-items: center;
    height: 48px;
    margin-right: 6px;
    width: 120px;
    color: grey;
`;
// console.log({ countData: countData ? countData.toJS() : '' })
let CountText = styled.div`
    display: flex;
    align-itemd: flex-begin;
`;
export let LayoutSwitch = ({
    layout,
    qparams,
    userLayout,
    actions,
    width,
    countData,
    ...other
}) => {
    //if (Root.qparams) qparams = Root.qparams;

    const [open, setOpen] = React.useState({ open: false, newPage: false });
    const matches = useMediaQuery("(min-width:900px)");
    console.log("RENDER LayoutSwitch", open, actions);
    //  console.log({ matches })
    //if (!matches) return <div />;

    let layoutNumber = qparams.layout;
    if (!layoutNumber) layoutNumber = 1;

    //console.log({ layout, width })
    let numPages = layout.numPages;
    let resIcon = resIcons[[900, 1200, 1800, 2100].indexOf(width)];

    userLayout = userLayout ? userLayout : {};
    //console.log("userLayout 111:", JSON.stringify(userLayout, null, 4))
    let numberLayouts = numPages;
    let items = [];

    for (var i = 0; i < numberLayouts; i++) {
        let k = i + 1;
        let item = (
            <Grid key={`layout -switch-grid - ${i}`} item sm>
                <GridItem>
                    <IconButton
                        onClick={() => {
                            let link = route({
                                sel: qparams.sel,
                                qparams,
                                nextParams: {
                                    layout: "" + k,
                                    comments: false,
                                },
                            });
                            // console.log({ link })
                            Router.push(link.href, link.as);
                        }}>
                        {layoutNumber - 1 == i ? selectedIcons[i] : icons[i]}
                    </IconButton>
                </GridItem>{" "}
            </Grid>
        );
        items.push(item);
    }

    let add = (
        <Grid item sm>
            <IconButton>
                <PlusBox
                    className="add"
                    onClick={() => {
                        setOpen({ open: true, newPage: true });
                    }}
                />
            </IconButton>
        </Grid>
    );
    let edit = (
        <Grid item sm>
            {" "}
            <IconButton>
                <Edit
                    className="add"
                    onClick={() => setOpen({ open: true, newPage: false })}
                />
            </IconButton>
        </Grid>
    );

    let Count = () => (
        <span className="q-count-text">
            {countData ? (
                <CountText>
                    <Users className="q-count" />
                    {`${countData.get("count")}/${countData.get("daycount")}`}
                </CountText>
            ) : null}
        </span>
    );
    //console.log(chalk.red("open", open));
    return (
        <LSDiv>
            {open.open ? (
                <LayoutEditor
                    qparams={qparams}
                    userLayout={userLayout}
                    openSpec={open}
                    setOpen={setOpen}
                    layoutNumber={layoutNumber}
                    numPages={numPages}
                    width={width}
                    actions={actions}
                    {...other}
                />
            ) : null}

            <Grid container spacing={0}>
                <Grid item sm>
                    {" "}
                    <ResIcon>
                        <Count />
                    </ResIcon>{" "}
                </Grid>
                <Grid item sm>
                    {" "}
                    <ResIcon>QWIKET 20/20</ResIcon>{" "}
                </Grid>
                <Grid item sm>
                    {" "}
                    <ResIcon>{resIcon}</ResIcon>{" "}
                </Grid>
                {items}
                <Grid item sm>
                    <Filler />
                </Grid>
                {add}
                {edit}
            </Grid>
        </LSDiv>
    );
};
LayoutEditor.whyDidYouRender = {
    logOnDifferentValues: true,
};
