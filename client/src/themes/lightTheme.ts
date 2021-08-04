import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      dark: "#EEE844",
      main: "#EEE844",
      contrastText: "#000",
    },
    background: {
      default: "#EBEBEB",
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
        "*::-webkit-scrollbar": {
          width: "0.6rem",
        },
        "*::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
          borderRadius: "10px",
        },
        "*::-webkit-scrollbar-thumb": {
          borderRadius: "10px",
          backgroundColor: "#999",
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
