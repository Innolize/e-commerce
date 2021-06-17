import CssBaseline from "@material-ui/core/CssBaseline";
import CustomThemeProvider from "./contexts/customThemeContext";
import Routes from "./routes/Routes";
import { QueryClient, QueryClientProvider } from "react-query";
import UserProvider from "./contexts/UserContext";
import WithAxios from "./services/WithAxios";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CustomThemeProvider>
          <CssBaseline />
          <WithAxios>
            <Routes />
          </WithAxios>
        </CustomThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
