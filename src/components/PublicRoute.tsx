import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import { Navigate, Outlet } from "react-router-dom";
import { ReactNode } from "react";

interface PublicRouteProps {
  children?: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
