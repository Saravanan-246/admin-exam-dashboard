import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../services/api.js";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ If already logged in as admin → redirect
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const user = JSON.parse(localStorage.getItem("adminUser"));
    if (token && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!data?.token || !data?.user) {
        throw new Error("Invalid login response");
      }

      if (data.user.role !== "admin") {
        throw new Error("Not authorized as admin");
      }

      // 🔐 STORE ADMIN SESSION
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      login(data.user); // sync context
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        {/* HEADER */}
        <div className="login-header">
          <h1>Sign in</h1>
          <p>Continue to Admin Panel</p>
        </div>

        {/* ERROR */}
        {error && <div className="login-error">{error}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Email address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="login-footer">
          New here? <Link to="/admin/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
