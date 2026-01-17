import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  // 🔐 ADMIN AUTH ONLY
  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("adminUser"));

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // ❌ Logged in but NOT admin
  if (user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Admin allowed
  return children;
}
