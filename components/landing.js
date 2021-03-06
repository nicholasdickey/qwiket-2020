import React from "react";

import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
//import { Image } from "react-bootstrap";
import { Editions } from "./editions";
const StyledCheckbox = styled(({ ...other }) => (
    <Checkbox
        classes={{ checked: "checked", disabled: "disabled" }}
        {...other}
    />
))`
  color: #eee !important;
  width:200px%;
  & .label {
    #color: ${props => props.color};
    color: #ddd;
    font-size: 14px; 
    font-family: Asap Condensed;
    font-weight:bold;
  }
   & .checked {
    color: #eee !important;
   
  }
  & .disabled {
    color:  #aff; !important;
  }
`;
const StyledVerticalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 40px;
    padding-bottom: 40px;
    justify-content: center;
    width: 100%;
    height: 100%;
`;
const StyledHorizontalWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
`;
let Landing = ({ ...props }) => {
    console.log("RENDER LANDING");
    return (
        <div>
            <StyledVerticalWrapper>
                <StyledHorizontalWrapper>
                    <Typography variant="h1">Qwiket 20/20</Typography>
                </StyledHorizontalWrapper>
                <StyledHorizontalWrapper>
                    <img
                        style={{ width: 200 }}
                        src="/img/qwiket-top-logo.png"
                    />
                </StyledHorizontalWrapper>
            </StyledVerticalWrapper>

            <Editions
                onSelect={v => (window.location = v)}
                open={true}
                {...props}
            />
        </div>
    );
};

export default Landing;
