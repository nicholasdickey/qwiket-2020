import React, { useState } from "react";

import styled from "styled-components";
import Link from "next/link";

import FormControl from "@material-ui/core/FormControl";
import SelectField from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import NavigationClose from "mdi-material-ui/CloseCircleOutline";
import NavigationOk from "mdi-material-ui/Check";
import { changeUserLayout } from "../lib/layout";

export let ColHeader = ({
    qparams,
    layoutNumber,
    selector,
    selectors,
    colIndex,
    res,
    pageType,
    density,
    updateUserLayout,
    userLayout,
    colType,
    chanConfig,
    isMsc,
}) => {
    const [isTag, setIsTag] = useState(false);
    const [open, setOpen] = useState(false);
    const [tag, setTag] = useState("#");
    // return <div>{`${layoutNumber},${selector},${colIndex},${res},${pageType},${density}`}</div>
    const selects = [...selectors];
    //  console.log("ColHeader", { chanConfig, qparams, layoutNumber, selector, selectors, colIndex, res, pageType, density, updateUserLayout, userLayout, colType })
    const submit = selector => {
        console.log("submit:", {
            updateUserLayout,
            userLayout,
            pageType,
            colIndex,
            colType,
            layoutNumber,
            selector: selector,
        });
        changeUserLayout({
            qparams,
            updateUserLayout,
            userLayout,
            pageType,
            colIndex,
            colType,
            layoutNumber,
            selector: selector,
            isMsc,
            res,
            density,
            chanConfig,
        });
        // refresh({ qparams });
    };
    const handleChange = event => {
        // setCurrency(event.target.value);
        let value = event.target.value;
        console.log("handleChange", value);
        if (!isTag) {
            if (value == "tag") {
                setIsTag(true);
            } else {
                submit(value);
            }
        } else {
            setTag(value);
        }
    };
    if (selector && selector.indexOf("#") == 0)
        selects.push({ name: selector, value: selector });

    selects.push({ name: "tag", value: "#..." });
    let StyledForm = styled.div`
        margin: 4px;
        & .selector-root {
            width: 100%;
        }
    `;
    let SelectField = styled.div`
        display: flex;
        justify-content: space-between;
    `;
    let SelectedFieldControls = styled.div`
        display: flex;
    `;
    return (
        <StyledForm>
            <SelectField>
                <TextField
                    id="standard-select-currency"
                    select={!isTag}
                    value={!isTag ? selector : tag}
                    onChange={handleChange}
                    className="selector-root"
                    autoFocus={isTag}
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onKeyPress={e => {
                        // console.log("onKey", e.key, e.target.value)
                        if (e.key == "Enter") {
                            console.log("ENTER");
                            submit(e.target.value);
                        }
                    }}>
                    {selects.map(option => (
                        <MenuItem key={option.name} value={option.name}>
                            {option.value}
                        </MenuItem>
                    ))}
                </TextField>
                {isTag ? (
                    <SelectedFieldControls>
                        <IconButton onClick={() => submit(tag)}>
                            <NavigationOk />
                        </IconButton>
                        <IconButton>
                            <NavigationClose />
                        </IconButton>
                    </SelectedFieldControls>
                ) : null}
            </SelectField>
        </StyledForm>
    );
};
