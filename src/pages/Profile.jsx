import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* SAVE DISPLAY NAME */
  const saveProfile = () => {
    if (!name.trim()) return;

    const updatedUser = { ...user, displayName: name.trim() };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    login(updatedUser);

    setSuccess("Profile updated successfully");
    setTimeout(() => setSuccess(""), 2000);
  };

  /* CHANGE PASSWORD */
  const changePassword = () => {
    setError("");
    setSuccess("");

    if (!oldPass || !newPass || !confirmPass) {
      setError("All password fields are required");
      return;
    }

    if (newPass !== confirmPass) {
      setError("New passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex(u => u.email === user.email);

    if (users[index].password !== oldPass) {
      setError("Old password is incorrect");
      return;
    }

    users[index].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));

    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    setSuccess("Password changed successfully");
  };

  return (
    <div className="profile-root">
      {/* BACK */}
      <button className="profile-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="profile-title">👤 Profile</h1>

      {/* PROFILE INFO */}
      <div className="profile-card">
        <div className="profile-row">
          <label>Display Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="profile-row">
          <label>Email</label>
          <input value={user?.email} disabled />
        </div>

        <div className="profile-row">
          <label>Role</label>
          <input value="Admin" disabled />
        </div>

        <button className="profile-btn" onClick={saveProfile}>
          Save Profile
        </button>
      </div>

      {/* PASSWORD */}
      <div className="profile-card">
        <h2 className="profile-subtitle">🔒 Change Password</h2>

        <input
          type="password"
          placeholder="Old password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        <button className="profile-btn" onClick={changePassword}>
          Update Password
        </button>

        {error && <div className="profile-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}
      </div>
    </div>
  );
}
