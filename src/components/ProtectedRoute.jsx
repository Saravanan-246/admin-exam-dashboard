import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // Read user safely
  const storedUser = localStorage.getItem("user");

  // ✅ If user exists → allow
  if (storedUser) {
    return children;
  }

  // ✅ If already on login page → allow (prevents loop)
  if (location.pathname === "/admin/login") {
    return children;
  }

  // ❌ Otherwise redirect once
  return <Navigate to="/admin/login" replace />;
}
