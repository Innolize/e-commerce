import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "src/contexts/UserContext";
import { isAdmin } from "src/utils/isAdmin";

const RequireAdminAuth = () => {
  const { user } = useContext(UserContext);

  if (!isAdmin(user)) {
    return <Navigate to="/" replace={true} />;
  }

  return <Outlet />;
};

export default RequireAdminAuth;
