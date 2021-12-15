import { useContext } from "react";
import { Route, RouteProps, Navigate } from "react-router-dom";
import { UserContext } from "src/contexts/UserContext";
import { isAdmin } from "src/utils/isAdmin";

const AdminRoute = ({ ...routeProps }: RouteProps) => {
  const { user } = useContext(UserContext);

  if (isAdmin(user)) {
    return <Route {...routeProps} />;
  } else if (!user) {
    return <Navigate to="/dashboard" replace={true} />;
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

export default AdminRoute;
