import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#fff",
      dark: "#fff",
      contrastText: "#000",
    },
    background: {
      default: "#F3F5F7",
    },
    text: {
      primary: "#000",
    },
    secondary: {
      main: "#0079D3",
    },
    error: {
      main: "#F70000",
    },
  },
  typography: {
    fontSize: 14,
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
    MuiButton: {
      label: {
        color: "#000",
      },
    },
  },
});

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
