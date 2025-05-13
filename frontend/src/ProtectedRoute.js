import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/login" />;

  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
