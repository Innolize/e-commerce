import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Route } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
};

const AdminLayoutRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <AdminLayout>
          <Component {...props} />
        </AdminLayout>
      )}
    />
  );
};

export default AdminLayoutRoute;
