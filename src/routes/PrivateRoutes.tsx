import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = () => {
  const { authState } = useAuth();
  console.log(authState);
  if (!authState.user) {
    return <Navigate to="login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
