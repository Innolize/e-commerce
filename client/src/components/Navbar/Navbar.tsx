import useScreenSize from "use-screen-size";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";
import React from "react";

const Navbar = React.memo(() => {
  const screenSize = useScreenSize();

  return screenSize.width <= 768 ? <MobileNavbar /> : <DesktopNavbar />;
});

export default Navbar;
