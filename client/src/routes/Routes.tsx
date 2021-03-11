import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from 'pages/Home';
import Error from 'pages/Error';
import Register from 'pages/Register';
import Login from 'pages/Login';
import Build from 'pages/Build';
import Products from 'pages/Products';
import Dashboard from 'pages/backoffice/Dashboard';
import Categories from 'pages/backoffice/Categories';
import AdminProducts from 'pages/backoffice/Products';

// Rename products

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/build" exact component={Build} />
      <Route path="/products" exact component={Products} />
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <Route path="/admin" exact component={Dashboard} />
      <Route path="/admin/products" exact component={AdminProducts} />
      <Route path="/admin/categories" exact component={Categories} />
      <Route path="/" component={Error} />
    </Switch>
  );
};

export default Routes;
