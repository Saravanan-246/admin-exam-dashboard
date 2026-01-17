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
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "../styles/sidebar.css";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  const menu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Classes", path: "/admin/classes", icon: School },
    { label: "Create Exam", path: "/admin/create-exam", icon: ClipboardEdit },
    { label: "Question Bank", path: "/admin/questions", icon: FileText },
    { label: "Evaluations", path: "/admin/evaluate", icon: CheckCircle },
    { label: "Students", path: "/admin/students", icon: Users },
  ];

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""}`}
      >
        {/* HEADER */}
        <div className="sidebar-header">
          {!collapsed && <span className="sidebar-title">Admin</span>}
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* MENU */}
        <nav className="sidebar-nav">
          {menu.map((item, i) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={i}
                to={item.path}
                className="sidebar-link"
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="sidebar-footer">
          <button
            className="sidebar-logout"
            onClick={() => setConfirm(true)}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      {confirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Confirm logout</h3>
            <p className="modal-text">
              Are you sure you want to logout?
            </p>

            <div className="modal-actions">
              <button onClick={() => setConfirm(false)} className="btn-muted">
                Cancel
              </button>
              <button onClick={handleLogout} className="btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
