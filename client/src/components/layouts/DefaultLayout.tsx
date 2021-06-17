import { ReactNode } from "react";
import Footer from "src/components/Footer/Footer";
import Navbar from "src/components/Navbar/Navbar";

interface Props {
  children: ReactNode;
}

export const DefaultLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};
