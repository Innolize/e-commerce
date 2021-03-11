import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from 'routes/Routes';
import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { useState } from 'react';

function App() {
  const [darkState, setDarkState] = useState(false);
  const palletType = darkState ? 'dark' : 'light';

  const theme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: '#2D314D',
      },
      secondary: {
        main: '#FFAA33',
      },
      info: {
        light: '#989DC3',
        main: '#656CA4',
      },
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '#root': {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      },
    },
  });

  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar handleThemeChange={handleThemeChange} />
        <Routes />
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
