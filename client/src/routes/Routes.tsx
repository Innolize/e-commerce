import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedAdminRoute from "src/routes/ProtectedAdminRoute";
import AdminRoutes from "./AdminRoutes";
import DefaultRoutes from "./DefaultRoutes";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <ProtectedAdminRoute path="/admin" component={AdminRoutes} />
        <Route path="/" component={DefaultRoutes} />
      </Switch>
    </Router>
  );
};

export default Routes;
