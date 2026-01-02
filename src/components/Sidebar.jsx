import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  School,
  ClipboardEdit,
  FileText,
  CheckCircle,
  Users,
  LogOut,
  Menu,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { darkMode } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      {/* Sidebar CSS - unchanged */}
      <style>{`
        .sidebar { transition: width .28s ease; }
        .sidebar-item { position: relative; overflow: hidden; }
        .sidebar-item:hover { transform: translateX(4px); }
        .active-menu { background:#0A66C2 !important; color:white !important; font-weight:500; }
        .indicator {
          position:absolute;
          left:0;
          width:4px;
          height:100%;
          background:#0A66C2;
          border-radius:0 6px 6px 0;
        }
      `}</style>

      {/* SIDEBAR */}
      <aside
        className={`sidebar fixed top-0 left-0 h-full flex flex-col py-6 px-3 shadow-sm border-r z-50
        ${darkMode ? "bg-[#101827] border-[#1E293B]" : "bg-white border-[#E2E8F0]"}
        `}
        style={{ width: collapsed ? "80px" : "256px" }}
      >
        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`wave-btn mb-8 p-2 rounded-lg border shadow-sm transition
            ${darkMode ? "bg-[#1E293B] border-[#334155] text-white" : "bg-white border-gray-300"}
          `}
        >
          <Menu size={19} />
        </button>

        {/* Logo */}
        <div className="mb-10 flex justify-center">
          {!collapsed ? (
            <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-[#0A66C2]"}`}>
              Exam Admin
            </h1>
          ) : <span className="text-xl"></span>}
        </div>

        {/* Menus (FIXED PATHS) */}
        <nav className="space-y-2">
          {[
            { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
            { label: "Classes", path: "/admin/classes", icon: <School size={18} /> },
            { label: "Create Exam", path: "/admin/create-exam", icon: <ClipboardEdit size={18} /> },
            { label: "Question Bank", path: "/admin/questions", icon: <FileText size={18} /> },
            { label: "Evaluations", path: "/admin/evaluate", icon: <CheckCircle size={18} /> },
            { label: "Students", path: "/admin/students", icon: <Users size={18} /> },
          ].map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-item flex items-center gap-3 p-3 rounded-xl relative
                ${darkMode ? "text-gray-300 hover:bg-[#162236]" : "text-gray-600 hover:bg-[#E8F2FF]"}
                ${isActive ? "active-menu" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="indicator"></div>}
                  <span className="w-6 flex justify-center">{item.icon}</span>
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`sidebar-item mt-auto flex items-center gap-3 p-3 rounded-xl transition cursor-pointer
            ${darkMode ? "text-red-400 hover:bg-[#2A3346]" : "text-red-500 hover:bg-red-50"}
          `}
        >
          <LogOut size={18} /> {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]">
          <div
            className={`p-6 rounded-xl shadow-xl w-full max-w-sm 
            ${darkMode ? "bg-[#1E293B] text-white" : "bg-white text-black"}`}
          >
            <h2 className="text-lg font-semibold mb-3">Confirm Logout</h2>
            <p className="text-sm opacity-70 mb-6">Are you sure you want to logout?</p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg opacity-70 hover:opacity-100"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
