import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useTheme();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Clear previous logged-in session when user reaches login page
  useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    // Get registered users list from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = storedUsers.find(
      (u) => u.email === form.email.trim() && u.password === form.password.trim()
    );

    if (!userExists) {
      setError("Invalid email or password.");
      return;
    }

    // Store session
    localStorage.setItem("user", JSON.stringify({ email: form.email }));

    login({ email: form.email });

    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-700 ${
        darkMode ? "bg-[#0b0f1a]" : "login-gradient"
      }`}
    >

      {/* 🔥 New Modern Background Animation */}
      <style>{`
        .login-gradient {
          background: radial-gradient(circle at top left, #ffffff, #dbe7ff, #c9dbff, #b9ceff);
          animation: fadeBackground 14s ease-in-out infinite alternate;
        }

        @keyframes fadeBackground {
          0% { background-position: 0% 50%; opacity: 1; }
          100% { background-position: 100% 50%; opacity: 0.95; }
        }
      `}</style>

      {/* CARD UI unchanged */}
      <div
        className={`w-full max-w-md px-10 py-12 rounded-3xl border shadow-xl backdrop-blur-md transition-all duration-300
        ${
          darkMode
            ? "bg-[#1E293B] border-[#334155] text-white"
            : "bg-white/70 border-white/40 text-gray-900"
        }`}
      >

        <h1 className="text-3xl font-semibold text-center text-[#0A66FF]">
          Welcome Back 👋
        </h1>

        <p className={`text-center text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Login to continue
        </p>

        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          
          <div>
            <label className="text-sm font-medium opacity-80">Email</label>
            <input
              type="email"
              autoComplete="off"
              value={form.email}
              placeholder="Enter your email"
              className={`w-full p-3 mt-1 rounded-xl border transition-all outline-none ${
                darkMode
                  ? "bg-[#0F172A] text-white border-[#334155] focus:border-[#0A66FF]"
                  : "bg-gray-50 border-gray-300 focus:ring-[#0A66FF]/25"
              }`}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium opacity-80">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={form.password}
              placeholder="Enter password"
              className={`w-full p-3 mt-1 rounded-xl border transition-all outline-none ${
                darkMode
                  ? "bg-[#0F172A] text-white border-[#334155] focus:border-[#0A66FF]"
                  : "bg-gray-50 border-gray-300 focus:ring-[#0A66FF]/25"
              }`}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0A66FF] text-white font-medium text-lg hover:bg-[#0057E0] active:scale-95 transition-all shadow-md hover:shadow-xl"
          >
            Login
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          New here?{" "}
          <Link to="/admin/signup" className="text-[#0A66FF] font-medium hover:underline">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
