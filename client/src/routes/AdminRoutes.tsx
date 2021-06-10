import { Redirect, Route } from "react-router";
import AdminLayoutRoute from "src/layouts/AdminLayout";
import Brands from "src/pages/backoffice/brand/Brands";
import CreateBrand from "src/pages/backoffice/brand/CreateBrand";
import EditBrand from "src/pages/backoffice/brand/EditBrand";
import BuildProducts from "src/pages/backoffice/build-product/BuildProducts";
import CreateBuildProduct from "src/pages/backoffice/build-product/CreateBuildProduct";
import EditBuildProduct from "src/pages/backoffice/build-product/EditBuildProduct";
import Categories from "src/pages/backoffice/category/Categories";
import CreateCategory from "src/pages/backoffice/category/CreateCategory";
import EditCategory from "src/pages/backoffice/category/EditCategory";
import CreateProduct from "src/pages/backoffice/general-product/CreateProduct";
import EditProduct from "src/pages/backoffice/general-product/EditProduct";
import AdminProducts from "src/pages/backoffice/general-product/Products";

const AdminRoutes = () => {
  return (
    <>
      <Route path={["/admin", "/admin/build"]} exact>
        <Redirect to="/admin/build/ram"></Redirect>
      </Route>
      <AdminLayoutRoute
        path="/admin/build/:category"
        exact
        component={BuildProducts}
      />
      <AdminLayoutRoute
        path="/admin/build/create/:category"
        exact
        component={CreateBuildProduct}
      />
      <AdminLayoutRoute
        path="/admin/build/edit/:category/:id"
        exact
        component={EditBuildProduct}
      />
      <AdminLayoutRoute
        path="/admin/products"
        exact
        component={AdminProducts}
      />
      <AdminLayoutRoute
        path="/admin/products/create"
        exact
        component={CreateProduct}
      />
      <AdminLayoutRoute
        path="/admin/products/edit/:id"
        exact
        component={EditProduct}
      />
      <AdminLayoutRoute path="/admin/categories" exact component={Categories} />
      <AdminLayoutRoute
        path="/admin/categories/create"
        exact
        component={CreateCategory}
      />
      <AdminLayoutRoute
        path="/admin/categories/edit/:id"
        exact
        component={EditCategory}
      />
      <AdminLayoutRoute path="/admin/brands" exact component={Brands} />
      <AdminLayoutRoute
        path="/admin/brands/create"
        exact
        component={CreateBrand}
      />
      <AdminLayoutRoute
        path="/admin/brands/edit/:id"
        exact
        component={EditBrand}
      />
    </>
  );
};

export default AdminRoutes;
