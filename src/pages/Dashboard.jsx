import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, CheckCircle } from "lucide-react";
import { useMemo } from "react";
import "../styles/admin.css";

/* ================= HELPERS ================= */
const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ SAFE ADMIN NAVIGATOR
  const goAdmin = (path) => navigate(`/admin${path}`);

  const displayName = user?.displayName || "Admin";

  const exams = getData("exams");
  const students = getData("students");
  const submissions = getData("evaluations");

  const stats = useMemo(
    () => [
      { label: "Total Exams", value: exams.length, icon: ClipboardList },
      { label: "Students", value: students.length, icon: Users },
      {
        label: "Pending Reviews",
        value: submissions.filter(
          (s) => s.status !== "Completed"
        ).length,
        icon: CheckCircle,
      },
    ],
    [exams.length, students.length, submissions.length]
  );

  return (
    <div className="admin-root">
      <div className="admin-wrapper">

        {/* HEADER */}
        <div className="admin-card admin-header">
          <div>
            <div className="admin-title">Dashboard</div>
            <div className="admin-subtitle">
              Welcome back, <b>{displayName}</b>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => goAdmin("/create-exam")}
          >
            + Create New Exam
          </button>
        </div>

        {/* STATS */}
        <div className="admin-stats">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div className="admin-card" key={i}>
                <div className="flex-between">
                  <span className="stat-label">{s.label}</span>
                  <Icon size={18} color="#8B949E" />
                </div>
                <div className="stat-value">{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div className="admin-card">
          <div className="flex-between mb-4">
            <h2 className="section-title">Quick Actions</h2>
            <span className="admin-subtitle">
              Manage exams faster
            </span>
          </div>

          <div className="admin-actions">
            <button className="btn-primary" onClick={() => goAdmin("/classes")}>
              Create Class
            </button>

            <button className="btn-primary" onClick={() => goAdmin("/questions")}>
              Add Question Bank
            </button>

            <button
              className="btn-primary"
              disabled={!students.length}
              onClick={() => goAdmin("/create-exam")}
            >
              Publish Exam
            </button>

            <button
              className="btn-primary"
              disabled={!submissions.length}
              onClick={() => goAdmin("/evaluate")}
            >
              Evaluate Responses
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
