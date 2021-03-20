import useScreenSize from 'use-screen-size';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';

const Navbar = () => {
  const screenSize = useScreenSize();

  return screenSize.width <= 768 ? <MobileNavbar /> : <DesktopNavbar />;
};

export default Navbar;
