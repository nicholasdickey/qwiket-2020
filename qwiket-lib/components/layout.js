import React from "react";

import styled from "styled-components";
import { parseLayout } from "../lib/layout";
//import u from "../lib/utils";
export class Layout extends React.Component {
    shouldComponentUpdate(nextProps) {
        let props = this.props;
        let pageTypeChanged = props.pageType != nextProps.pageType;
        let nextSession = nextProps.session;
        let session = props.session;
        let sessionChanged = session != nextSession;
        //  let width = u.getLayoutWidth({ session });
        // let nextWidth = u.getLayoutWidth({ session: nextSession });
        // console.log("Layout WIDTH EVAL", { width, nextWidth, sWidth: session.get("width"), nsWidth: nextSession.get("width") })
        let widthChanged = width != nextWidth;

        console.log("shouldComponentUpdate layout", {
            pageTypeChanged,
            sessionChanged,
        });
        return pageTypeChanged || sessionChanged;
    }
    render() {
        console.log("RENDER Layout layoutview");
        let { children, app, session, pageType, user, ...rest } = this.props;
        if (!session) return <div />;
        let { layout, selectors, density } = parseLayout({
            app,
            session,
            pageType,
            user,
        });
        console.log("Rlayoutview", layout);
        return (
            <div data-id="layout">
                {React.cloneElement(children, {
                    layout,
                    selectors,
                    density,
                    ...rest,
                })}
            </div>
        );
    }
}
export let InnerGrid = ({ children, layout, ...rest }) => {
    let hpads = layout.hpads;
    console.log("InnerGrid render layoutview 000");
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
    return <Grid>{React.cloneElement(children, { layout, ...rest })}</Grid>;
};
