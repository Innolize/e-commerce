import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Build from "src/pages/Build";
import Cart from "src/pages/Cart";
import Checkout from "src/pages/Checkout";
import Home from "src/pages/Home";
import IndividualProduct from "src/pages/IndividualProduct";
import Login from "src/pages/Login";
import NoMatch from "src/pages/NoMatch";
import Orders from "src/pages/Orders";
import Products from "src/pages/Products";
import Register from "src/pages/Register";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { DefaultLayout } from "../components/layouts/DefaultLayout";
import ScrollToTop from "./ScrollToTop";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin/build/:category" element={<BuildProducts />} />
          <Route path="/admin/build/create/:category" element={<CreateBuildProduct />} />
          <Route path="/admin/build/edit/:category/:id" element={<EditBuildProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/create" element={<CreateProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          <Route path="/admin/categories" element={<CategoryTable />} />
          <Route path="/admin/categories/create" element={<CreateCategory />} />
          <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
          <Route path="/admin/brands" element={<Brands />} />
          <Route path="/admin/brands/create" element={<CreateBrand />} />
          <Route path="/admin/brands/edit/:id" element={<EditBrand />} />
          <Route path="*" element={<NoMatch />} />
        </Route>

        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<IndividualProduct />} />
          <Route path="/build" element={<Build />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
