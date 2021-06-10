import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainLayoutRoute from "src/layouts/MainLayout";
import Build from "src/pages/Build";
import Cart from "src/pages/Cart";
import Home from "src/pages/Home";
import Login from "src/pages/Login";
import Products from "src/pages/Products";
import Register from "src/pages/Register";
import AdminRoutes from "./AdminRoutes";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <MainLayoutRoute path="/" exact component={Home} />
        <MainLayoutRoute path="/build" component={Build} />
        <MainLayoutRoute path="/products" component={Products} />
        <MainLayoutRoute path="/login" component={Login} />
        <MainLayoutRoute path="/register" component={Register} />
        <MainLayoutRoute path="/cart" component={Cart} />

        <Route path="/admin">
          <AdminRoutes />
        </Route>

        <Route path="*">
          <p>No match</p>
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
