import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

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
        "*::-webkit-scrollbar": {
          width: "10px",
        },
        "*::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
          borderRadius: "10px",
        },
        "*::-webkit-scrollbar-thumb": {
          borderRadius: "10px",
          backgroundColor: "#555",
        },
      },
    },
  },
});

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
