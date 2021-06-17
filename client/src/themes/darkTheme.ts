import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#151725",
      dark: "#0E1019",
      contrastText: "#fff",
    },
    background: {
      default: "#303030",
    },
    secondary: {
      main: "#FFAA33",
    },
    error: {
      main: "#F70000",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "#root": {
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      },
    },
  },
});

export default theme;
