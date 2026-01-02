import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { login } = useAuth();

  const [form, setForm] = useState({ displayName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!form.displayName || !form.email || !form.password || !form.confirm)
      return setError("All fields are required ❗");

    if (form.password !== form.confirm)
      return setError("Passwords do not match ❌");

    // Get stored users
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Prevent duplicates
    const exists = storedUsers.find(u => u.email === form.email);
    if (exists) return setError("Account already exists ❗");

    // Save new user
    const newUser = { displayName: form.displayName, email: form.email, password: form.password };
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Auto login
    localStorage.setItem("user", JSON.stringify(newUser));
    login(newUser);

    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-700 ${darkMode ? "bg-[#0B0F1A]" : "signup-bg"}`}>

      {/* Background animation (unchanged UI) */}
      <style>{`
        .signup-bg {
          background: radial-gradient(circle at top right, #ffffff, #e4ebff, #d3e1ff, #c4d6ff);
          animation: bgWave 14s ease-in-out infinite alternate;
        }
        @keyframes bgWave {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.95; transform: scale(1.04); }
        }
      `}</style>

      {/* CARD (UI unchanged) */}
      <div className={`w-full max-w-md px-10 py-12 rounded-3xl border shadow-xl backdrop-blur-lg transition-all duration-300 ${darkMode ? "bg-[#1E293B] border-[#334155] text-white" : "bg-white/60 border-white/50 text-gray-900"}`}>

        <h1 className="text-3xl font-semibold text-center text-[#0A66FF] tracking-tight">Create Account ✨</h1>

        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-6 mt-8">

          <div>
            <label className="text-sm font-medium opacity-80">Display Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="w-full p-3 mt-1 rounded-xl border outline-none"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              placeholder="example@gmail.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 mt-1 rounded-xl border outline-none"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 mt-1 rounded-xl border outline-none"
            />
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full p-3 mt-1 rounded-xl border outline-none"
            />
          </div>

          <button className="w-full py-3 rounded-xl bg-[#0A66FF] text-white">Sign Up</button>
        </form>

        <p className="text-center mt-6 text-sm">
          Already have an account? <Link to="/admin/login" className="text-[#0A66FF] font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
