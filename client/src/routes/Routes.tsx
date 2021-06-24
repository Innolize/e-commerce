import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loading from "src/pages/Loading";
import ProtectedAdminRoute from "src/routes/ProtectedAdminRoute";
import DefaultRoutes from "./DefaultRoutes";

const AdminRoutes = lazy(() => import("./AdminRoutes"));

const Routes = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          <ProtectedAdminRoute path="/admin" component={AdminRoutes} />
          <Route path="/" component={DefaultRoutes} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default Routes;
