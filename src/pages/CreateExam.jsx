import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, FilePlus, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
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

export default function CreateExam() {
  const navigate = useNavigate();

  // ✅ SAFE ADMIN NAVIGATOR
  const goAdmin = (path) => navigate(`/admin${path}`);

  const [classes, setClasses] = useState([]);
  const [saving, setSaving] = useState(false);

  const [examData, setExamData] = useState({
    title: "",
    subject: "",
    classId: "",
    date: "",
    time: "",
    duration: "",
    marks: "",
  });

useEffect(() => {
  const loadClasses = async () => {
    try {
      const data = await apiFetch("/classes");
      setClasses(data);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  loadClasses();
}, []);


  /* Update field */
  const updateField = useCallback((key, value) => {
    setExamData((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* Save exam */
const saveExam = async () => {
  if (!examData.title.trim() || !examData.classId) return;

  try {
    setSaving(true);

    await apiFetch("/exams", {
      method: "POST",
      body: JSON.stringify({
        title: examData.title,
        subject: examData.subject,
        classId: examData.classId,
        date: examData.date,
        time: examData.time,
        duration: examData.duration,
        marks: examData.marks,
        published: true, // 🔥 important for student visibility
      }),
    });

    goAdmin("/dashboard");
  } catch (err) {
    alert(err.message || "Failed to create exam");
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="admin-root">
      <div className="exam-wrapper">

        {/* HEADER */}
        <div className="exam-header">
          <div className="exam-title">Create Exam</div>
          <div className="exam-subtitle">
            Schedule exams and assign them to classes
          </div>
        </div>

        {/* FORM */}
        <div className="exam-card">
          <div className="exam-section-title">
            <Layers size={18} /> Exam Details
          </div>

          <div className="space-y-4">
            <input
              className="exam-input"
              placeholder="Exam Title"
              value={examData.title}
              onChange={(e) => updateField("title", e.target.value)}
            />

            <input
              className="exam-input"
              placeholder="Subject"
              value={examData.subject}
              onChange={(e) => updateField("subject", e.target.value)}
            />

            <select
              className="exam-input"
              value={examData.classId}
              onChange={(e) => updateField("classId", e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} — {cls.teacher}
                </option>
              ))}
            </select>

            <div className="exam-grid-2">
              <div className="exam-input-icon">
                <Calendar size={16} />
                <input
                  type="date"
                  className="exam-input"
                  value={examData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
              </div>

              <div className="exam-input-icon">
                <Clock size={16} />
                <input
                  type="time"
                  className="exam-input"
                  value={examData.time}
                  onChange={(e) => updateField("time", e.target.value)}
                />
              </div>
            </div>

            <div className="exam-grid-2">
              <input
                className="exam-input"
                placeholder="Duration (minutes)"
                value={examData.duration}
                onChange={(e) => updateField("duration", e.target.value)}
              />

              <input
                className="exam-input"
                placeholder="Total Marks"
                value={examData.marks}
                onChange={(e) => updateField("marks", e.target.value)}
              />
            </div>
          </div>

          <button
            className="exam-submit"
            onClick={saveExam}
            disabled={saving}
          >
            <FilePlus size={16} style={{ marginRight: 6 }} />
            {saving ? "Saving..." : "Create Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}
