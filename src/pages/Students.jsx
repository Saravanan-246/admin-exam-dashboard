import { useState, useEffect } from "react";
import { Search, Trophy, Trash2 } from "lucide-react";
import "../styles/students.css";

/* ================= PAGE ================= */
export default function Students() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);

  /* LOAD (mock now, API later) */
  useEffect(() => {
    setStudents([
      { id: 1, name: "Arjun Sharma", className: "Grade 10 - A", email: "arjun@mail.com", score: 92 },
      { id: 2, name: "Rahul Dev", className: "Grade 9 - B", email: "rahul@mail.com", score: 88 },
      { id: 3, name: "Meera N", className: "Grade 10 - A", email: "meera@mail.com", score: 46 },
      { id: 4, name: "Sanjay G", className: "Grade 8 - C", email: "sanjay@mail.com", score: 79 },
      { id: 5, name: "Pooja R", className: "Grade 12 - C", email: "pooja@mail.com", score: 95 },
      { id: 6, name: "Harini K", className: "Grade 11 - B", email: "harini@mail.com", score: 91 },
    ]);
  }, []);

  /* TOPPERS */
  const toppers = students
    .filter(
      (s) =>
        s.score >= 85 &&
        (s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.className.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => b.score - a.score);

  const removeStudent = (id) =>
    setStudents((p) => p.filter((s) => s.id !== id));

  const badge = (i) =>
    i === 0 ? "🥇 Gold" : i === 1 ? "🥈 Silver" : i === 2 ? "🥉 Bronze" : "⭐ Topper";

  return (
    <div className="students-root">
      {/* HEADER */}
      <div className="students-header">
        <div className="students-title-wrap">
          <Trophy size={26} />
          <div>
            <div className="students-title">Top Students</div>
            <div className="students-subtitle">
              Leaderboard (score ≥ 85%)
            </div>
          </div>
        </div>

        <div className="students-search">
          <Search size={14} />
          <input
            placeholder="Search name or class"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Class</th>
              <th>Score</th>
              <th>Badge</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {toppers.map((s, i) => (
              <tr key={s.id}>
                <td className="rank">{i + 1}</td>
                <td className="name">{s.name}</td>
                <td className="class">{s.className}</td>
                <td className="score">{s.score}%</td>
                <td className="badge">{badge(i)}</td>
                <td className="actions">
                  <Trash2
                    size={16}
                    onClick={() => removeStudent(s.id)}
                  />
                </td>
              </tr>
            ))}

            {toppers.length === 0 && (
              <tr>
                <td colSpan="6" className="students-empty">
                  No students above 85%
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
