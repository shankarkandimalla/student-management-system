import { Navigate } from "react-router-dom";
import authService from "../services/authService";

function ProtectedRoute({
  children,
  allowedRole,
}) {
  const user = authService.getCurrentUser();

  if (user === null) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;