import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: "adellesans, sans-serif",
    h6: {
      fontSize: "16px",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  },
  palette: {
    primary: {
      main: "#ED1C24",
    },
    secondary: {
      main: "#fff",
    },
  },
});

export default theme;
