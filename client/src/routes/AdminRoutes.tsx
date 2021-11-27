import { Redirect, Route } from "react-router";
import Brands from "src/pages/backoffice/brand/BrandTable";
import CreateBrand from "src/pages/backoffice/brand/CreateBrand";
import EditBrand from "src/pages/backoffice/brand/EditBrand";
import BuildProducts from "src/pages/backoffice/build-product/BuildProducts";
import CreateBuildProduct from "src/pages/backoffice/build-product/CreateBuildProduct";
import EditBuildProduct from "src/pages/backoffice/build-product/EditBuildProduct";
import CategoryTable from "src/pages/backoffice/category/CategoryTable";
import CreateCategory from "src/pages/backoffice/category/CreateCategory";
import EditCategory from "src/pages/backoffice/category/EditCategory";
import CreateProduct from "src/pages/backoffice/general-product/CreateProduct";
import EditProduct from "src/pages/backoffice/general-product/EditProduct";
import AdminProducts from "src/pages/backoffice/general-product/ProductTable";
import { AdminLayout } from "../components/layouts/AdminLayout";
import NoMatch from "src/pages/NoMatch";
import { Switch } from "react-router-dom";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Switch>
        <ProtectedAdminRoute path={["/admin", "/admin/build"]} exact>
          <Redirect to="/admin/build/ram"></Redirect>
        </ProtectedAdminRoute>
        <Route path="/admin/build/:category" exact component={BuildProducts} />
        <Route path="/admin/build/create/:category" exact component={CreateBuildProduct} />
        <Route path="/admin/build/edit/:category/:id" exact component={EditBuildProduct} />
        <Route path="/admin/products" exact component={AdminProducts} />
        <Route path="/admin/products/create" exact component={CreateProduct} />
        <Route path="/admin/products/edit/:id" exact component={EditProduct} />
        <Route path="/admin/categories" exact component={CategoryTable} />
        <Route path="/admin/categories/create" exact component={CreateCategory} />
        <Route path="/admin/categories/edit/:id" exact component={EditCategory} />
        <Route path="/admin/brands" exact component={Brands} />
        <Route path="/admin/brands/create" exact component={CreateBrand} />
        <Route path="/admin/brands/edit/:id" exact component={EditBrand} />
        <Route path="*" component={NoMatch} />
      </Switch>
    </AdminLayout>
  );
};

export default AdminRoutes;
