import CssBaseline from "@material-ui/core/CssBaseline";
import Routes from "./routes/Routes";
import { QueryClient, QueryClientProvider } from "react-query";
import MainContextProvider from "./contexts/MainContext";
import { SnackbarProvider } from "notistack";
import WithAxios from "./services/WithAxios";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainContextProvider>
        <SnackbarProvider autoHideDuration={2500}>
          <CssBaseline />
          <WithAxios>
            <Routes />
          </WithAxios>
        </SnackbarProvider>
      </MainContextProvider>
    </QueryClientProvider>
  );
};

export default App;
