import { Outlet } from "react-router-dom";
import AdminNavbar from "src/components/Navbar/AdminNavbar";

export const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
};
