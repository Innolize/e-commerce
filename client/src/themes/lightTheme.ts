import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#2196F3",
      contrastText: "#000",
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
