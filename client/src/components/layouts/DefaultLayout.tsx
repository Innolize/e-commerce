import { Outlet } from "react-router-dom";
import Footer from "src/components/Footer/Footer";
import Navbar from "src/components/Navbar/Navbar";

export const DefaultLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
