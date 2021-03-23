import CssBaseline from '@material-ui/core/CssBaseline';
import CustomThemeProvider from './contexts/customThemeContext';
import Routes from './routes/Routes';

const App = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Routes />
    </CustomThemeProvider>
  );
};

export default App;
