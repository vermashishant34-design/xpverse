import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname, authRequired: true }} />;
  }

  return <>{children}</>;
}
