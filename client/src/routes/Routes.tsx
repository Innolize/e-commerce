import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AdminLayout from '../components/Layouts/AdminLayout';
import MainLayout from '../components/Layouts/MainLayout';
import Categories from '../pages/backoffice/Categories';
import Login from '../pages/Login';
import Products from '../pages/Products';
import Register from '../pages/Register';
import AdminProducts from '../pages/backoffice/Products';
import Home from '../pages/Home';
import Build from '../pages/Build';
import Dashboard from '../pages/backoffice/Dashboard';
import Cart from '../pages/Cart';
import Brands from '../pages/backoffice/Brands';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={['/', '/build', '/products', '/login', '/register', '/cart']}>
          <MainLayout>
            <Route path="/" exact component={Home} />
            <Route path="/build" exact component={Build} />
            <Route path="/products" exact component={Products} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/cart" exact component={Cart} />
          </MainLayout>
        </Route>

        <Route path={['/admin', '/admin/products', '/admin/categories', '/admin/brands']}>
          <AdminLayout>
            <Route path="/admin" exact component={Dashboard} />
            <Route path="/admin/products" exact component={AdminProducts} />
            <Route path="/admin/categories" exact component={Categories} />
            <Route path="/admin/brands" exact component={Brands} />
          </AdminLayout>
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
