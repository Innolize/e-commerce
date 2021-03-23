import AdminNavbar from '../AdminNavbar';

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

export default AdminLayout;
