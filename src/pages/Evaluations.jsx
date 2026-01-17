import { useState } from "react";
import {
  Search,
  Filter,
  ClipboardEdit,
  CheckCircle,
  PenLine,
  Eye,
} from "lucide-react";
import "../styles/evaluations.css";

export default function Evaluations() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const [submissions, setSubmissions] = useState([
    { id: 1, name: "Arjun Sharma", exam: "Math - Mid Term", status: "Pending", score: null, comments: "" },
    { id: 2, name: "Meera N", exam: "Science - Unit Test", status: "In Progress", score: 46, comments: "Needs improvement." },
    { id: 3, name: "Rahul Dev", exam: "History - Final", status: "Completed", score: 92, comments: "Excellent." },
  ]);

  const filtered = submissions.filter((s) => {
    const q =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.exam.toLowerCase().includes(search.toLowerCase());
    const f = filter === "All" || s.status === filter;
    return q && f;
  });

  const saveReview = () => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === selected.id ? selected : s))
    );
    setSelected(null);
  };

  return (
    <div className="eval-root">
      {/* HEADER */}
      <div className="eval-header">
        <div>
          <div className="eval-title">Evaluations</div>
          <div className="eval-subtitle">
            Review exams and assign scores
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="eval-toolbar">
        <div className="eval-search">
          <Search size={14} />
          <input
            placeholder="Search student or exam"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="eval-filter">
          <Filter size={14} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="eval-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Exam</th>
              <th>Status</th>
              <th>Score</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.exam}</td>
                <td>
                  <span className={`eval-badge ${s.status.toLowerCase().replace(" ", "-")}`}>
                    {s.status}
                  </span>
                </td>
                <td>{s.score ?? "—"}</td>
                <td className="eval-actions">
                  <button onClick={() => setSelected(s)}>
                    {s.status === "Completed" ? <PenLine size={15} /> :
                     s.status === "In Progress" ? <ClipboardEdit size={15} /> :
                     <Eye size={15} />}
                    {s.status === "Completed" ? "Edit" :
                     s.status === "In Progress" ? "Continue" : "Review"}
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="eval-empty">
                  No submissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* REVIEW MODAL */}
      {selected && (
        <div className="eval-overlay">
          <div className="eval-modal">
            <div className="eval-modal-title">
              Review — {selected.name}
            </div>

            <div className="eval-modal-sub">
              {selected.exam}
            </div>

            <label>Score: {selected.score ?? 0}/100</label>
            <input
              type="range"
              min="0"
              max="100"
              value={selected.score ?? 0}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  score: Number(e.target.value),
                  status: "In Progress",
                })
              }
            />

            <textarea
              placeholder="Correction notes"
              value={selected.comments}
              onChange={(e) =>
                setSelected({ ...selected, comments: e.target.value })
              }
            />

            <div className="eval-modal-actions">
              <button onClick={() => setSelected(null)}>Cancel</button>
              <button className="primary" onClick={() => {
                setSelected({ ...selected, status: "Completed" });
                saveReview();
              }}>
                <CheckCircle size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
