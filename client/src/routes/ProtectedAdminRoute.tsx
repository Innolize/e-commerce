import { useContext } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";
import { UserContext } from "src/contexts/UserContext";
import { isAdmin } from "src/utils/isAdmin";

const ProtectedAdminRoute = ({ ...routeProps }: RouteProps) => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  if (isAdmin(user)) {
    return <Route {...routeProps} />;
  } else if (!user) {
    return <Redirect to={{ pathname: "/login", state: { from: location.pathname } }} />;
  } else {
    return <Redirect to={{ pathname: "/" }} />;
  }
};

export default ProtectedAdminRoute;
