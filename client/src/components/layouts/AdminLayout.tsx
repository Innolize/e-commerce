import { ReactNode } from "react";
import AdminNavbar from "src/components/AdminNavbar";

interface Props {
  children: ReactNode;
}

export const AdminLayout = ({ children }: Props) => {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
};
