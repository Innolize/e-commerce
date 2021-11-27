import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedAdminRoute from "src/routes/ProtectedAdminRoute";
import AdminRoutes from "./AdminRoutes";
import DefaultRoutes from "./DefaultRoutes";
import ScrollToTop from "./ScrollToTop";

const Routes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <ProtectedAdminRoute path="/admin" component={AdminRoutes} />
        <Route path="/" component={DefaultRoutes} />
      </Switch>
    </Router>
  );
};

export default Routes;
