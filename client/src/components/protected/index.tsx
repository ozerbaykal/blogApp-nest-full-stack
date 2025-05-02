import { FC } from "react";
import { useAuth } from "../../providers/auth-provider";
import Loader from "../loader";
import { Navigate, Outlet } from "react-router-dom";

const Protected: FC = () => {
  const { user, loading } = useAuth();
  if (loading || user === undefined) {
    return <Loader />;
  }
  if (user === null) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default Protected;
