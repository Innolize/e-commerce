import { Route } from "react-router";
import Build from "src/pages/Build";
import Cart from "src/pages/Cart";
import Home from "src/pages/Home";
import Login from "src/pages/Login";
import Products from "src/pages/Products";
import Register from "src/pages/Register";
import { DefaultLayout } from "../components/layouts/DefaultLayout";
import NoMatch from "src/pages/NoMatch";
import { Switch } from "react-router-dom";
import IndividualProduct from "src/pages/IndividualProduct";

const DefaultRoutes = () => {
  return (
    <DefaultLayout>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/build" component={Build} />
        <Route path="/products/:id" component={IndividualProduct} />
        <Route path="/products" component={Products} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/cart" component={Cart} />
        <Route path="*" component={NoMatch} />
      </Switch>
    </DefaultLayout>
  );
};

export default DefaultRoutes;
