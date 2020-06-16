import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = ({ dark }) => {
    dark = dark ? 1 : 0;
    //console.log("createMuiTheme", { dark });
    let theme = createMuiTheme({
        palette: {
            primary: {
                main: "#556cd6",
            },
            secondary: {
                main: "#19857b",
            },
            error: {
                main: red.A400,
            },
            /* background: {
                 default: '#fff',
             },*/
            linkColor: dark == 0 ? red[900] : red[200],
            type: dark === 0 ? "light" : "dark",
            borderColor: dark == 0 ? "#444" : "#CCC",
        },
    });
    //  console.log("CREATED THEME", theme);
    return theme;
};

export default theme;
