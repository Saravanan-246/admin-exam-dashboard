import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /* ================= HANDLERS ================= */
  const openProfile = () => {
    setOpen(false);
    navigate("/admin/profile");
  };

  const initials =
    user?.displayName?.charAt(0)?.toUpperCase() || "A";

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="navbar-title">Admin Panel</div>

      {/* RIGHT / PROFILE */}
      <div className="navbar-profile" ref={wrapperRef}>
        <button
          className="avatar"
          onClick={() => setOpen((p) => !p)}
          aria-label="Open profile menu"
        >
          {initials}
        </button>

       {open && (
  <div className="profile-dropdown">
    <div className="profile-header">
      <div className="profile-avatar-lg">
        {initials}
      </div>

      <div className="profile-meta">
        <div className="profile-name">
          {user?.displayName || "Admin"}
        </div>
        <div className="profile-email">
          {user?.email}
        </div>
      </div>
    </div>

    <div className="profile-divider" />

    <button
      className="profile-link"
      onClick={openProfile}
    >
      View Profile
    </button>
  </div>
)}
</div>
    </header>
  );
}
