import * as UI from "@material-ui/core";

const useStyles = UI.makeStyles((customTheme:UI.Theme) => {
  return UI.createStyles({
    root: {
      maxWidth: 345,
      height: "100%",
    },
    header: {
      height: "5em",
    },
    media: {
      height: 0,
      paddingTop: "56.25%",
    },
    registerBtn: {
      margin: customTheme.spacing(1),
      display: "inline-block",
      paddingLeft: customTheme.spacing(3),
      paddingRight: customTheme.spacing(3),

    },
    unregisterBtn: {
      margin: customTheme.spacing(1),
    },
    buttonGroup: {
      justifyContent: "center",
    }
  });
});

export default useStyles;
