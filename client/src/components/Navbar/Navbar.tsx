import * as React from 'react';
import useScreenSize from 'use-screen-size';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';

interface Props {
  handleThemeChange: () => void;
}

function Navbar({ handleThemeChange }: Props) {
  const screenSize = useScreenSize();

  return screenSize.width <= 768 ? (
    <MobileNavbar handleThemeChange={handleThemeChange} />
  ) : (
    <DesktopNavbar handleThemeChange={handleThemeChange} />
  );
}

export default Navbar;
