import CssBaseline from '@material-ui/core/CssBaseline';
import CustomThemeProvider from './contexts/customThemeContext';
import Routes from './routes/Routes';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <CssBaseline />
        <Routes />
      </CustomThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
