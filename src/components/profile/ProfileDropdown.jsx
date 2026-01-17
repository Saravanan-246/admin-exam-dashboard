import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import "./profile.css";

export default function ProfileDropdown() {
  const { user, login } = useAuth();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const wrapperRef = useRef(null);

  /* ================= SYNC USER ================= */
  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = () => {
    if (!user) return;

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === user.displayName) {
      setOpen(false);
      return;
    }

    const updatedUser = {
      ...user,
      displayName: trimmedName,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    login(updatedUser);
    setOpen(false);
  };

  /* ================= UI ================= */
  return (
    <div className="profile-wrapper" ref={wrapperRef}>
      {/* AVATAR */}
      <div
        className="profile-avatar"
        onClick={() => setOpen((prev) => !prev)}
        title="Profile"
      >
        {user?.displayName?.charAt(0)?.toUpperCase() || "A"}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="profile-dropdown">
          <div className="profile-section">

            <div className="profile-label">Admin Profile</div>

            {/* DISPLAY NAME */}
            <input
              className="profile-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
              maxLength={32}
            />

            {/* EMAIL (READ ONLY) */}
            <div className="profile-email">
              {user?.email || "admin@mail.com"}
            </div>

            {/* SAVE */}
            <button
              className="profile-save"
              onClick={saveProfile}
            >
              Save changes
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
