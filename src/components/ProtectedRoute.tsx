import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "./Loading";

interface ProtectedRouteProps {
  allowedRoles?: ("mentor" | "user")[]; // Optional: If undefined, both roles can access
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  if (!user?.gender && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role!)) {
    return <Navigate to="/access-denied" replace />; // Redirect unauthorized users
  }

  return <Outlet />;
};

export default ProtectedRoute;
