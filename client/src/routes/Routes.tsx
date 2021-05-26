import { BrowserRouter as Router, Switch } from "react-router-dom";
import Categories from "../pages/backoffice/Categories";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Register from "../pages/Register";
import AdminProducts from "../pages/backoffice/Products";
import Home from "../pages/Home";
import Build from "../pages/Build";
import Dashboard from "../pages/backoffice/Dashboard";
import Cart from "../pages/Cart";
import Brands from "../pages/backoffice/Brands";
import CreateBrand from "../pages/backoffice/CreateBrand";
import EditBrand from "../pages/backoffice/EditBrand";
import MainLayoutRoute from "../layouts/MainLayout";
import AdminLayoutRoute from "../layouts/AdminLayout";
import EditCategory from "src/pages/backoffice/EditCategory";
import CreateCategory from "src/pages/backoffice/CreateCategory";
import CreateProduct from "src/pages/backoffice/CreateProduct";
import EditProduct from "src/pages/backoffice/EditProduct";

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

        <AdminLayoutRoute path="/admin" exact component={Dashboard} />
        <AdminLayoutRoute
          path="/admin/products"
          exact
          component={AdminProducts}
        />
        <AdminLayoutRoute
          path="/admin/products/create"
          component={CreateProduct}
        />
        <AdminLayoutRoute
          path="/admin/products/edit/:id"
          component={EditProduct}
        />
        <AdminLayoutRoute
          path="/admin/categories"
          exact
          component={Categories}
        />
        <AdminLayoutRoute
          path="/admin/categories/create"
          component={CreateCategory}
        />
        <AdminLayoutRoute
          path="/admin/categories/edit/:id"
          component={EditCategory}
        />
        <AdminLayoutRoute path="/admin/brands" exact component={Brands} />
        <AdminLayoutRoute path="/admin/brands/create" component={CreateBrand} />
        <AdminLayoutRoute path="/admin/brands/edit/:id" component={EditBrand} />
      </Switch>
    </Router>
  );
};

export default Routes;
