import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from 'routes/Routes';
import Navbar from 'components/Navbar/Navbar';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes />
      </BrowserRouter>
    </>
  );
}

export default App;
