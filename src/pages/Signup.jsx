import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../services/api.js";
import "../styles/signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const displayName = form.displayName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirm = form.confirm;

    // ✅ VALIDATION
    if (!displayName || !email || !password || !confirm) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // ✅ FIXED: NO /api HERE
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: displayName,
          email,
          password,
          role: "admin", // 🔐 FORCE ADMIN
        }),
      });

      if (!data?.token || !data?.user) {
        throw new Error("Invalid server response");
      }

      // 🔥 STORE ADMIN SESSION
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      login(data.user);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-root">
      <div className="signup-card">
        {/* HEADER */}
        <div className="signup-header">
          <h1>Create account</h1>
          <p>Join the admin panel</p>
        </div>

        {/* ERROR */}
        {error && <div className="signup-error">{error}</div>}

        {/* FORM */}
        <form className="signup-form" onSubmit={handleSignup}>
          <div className="signup-field">
            <label>Display name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.displayName}
              onChange={(e) => updateField("displayName", e.target.value)}
            />
          </div>

          <div className="signup-field">
            <label>Email address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="signup-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </div>

          <div className="signup-field">
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => updateField("confirm", e.target.value)}
            />
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="signup-footer">
          Already have an account? <Link to="/admin/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
