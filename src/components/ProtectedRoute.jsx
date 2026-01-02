import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const storedUser = localStorage.getItem("user");

  // If no active logged-in user → redirect to login
  if (!storedUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
