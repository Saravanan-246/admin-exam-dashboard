import { useState } from "react";
import { Search, Filter, ClipboardEdit, CheckCircle, PenLine, Eye } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Evaluations() {
  const { darkMode } = useTheme();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const [submissions, setSubmissions] = useState([
    { id: 1, name: "Arjun Sharma", exam: "Math - Mid Term", status: "Pending", score: null, comments: "" },
    { id: 2, name: "Meera N", exam: "Science - Unit Test", status: "In Progress", score: 46, comments: "Needs improvement in diagrams." },
    { id: 3, name: "Rahul Dev", exam: "History - Final Exam", status: "Completed", score: 92, comments: "Excellent work." },
  ]);

  const filtered = submissions.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                        s.exam.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || s.status === filter;
    return matchSearch && matchFilter;
  });

  const updateSubmission = () => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === selected.id ? selected : sub))
    );
    setSelected(null);
  };

  const uiSurface = darkMode
    ? "bg-[#111827] border-[#374151] text-gray-100"
    : "bg-white border-gray-300";

  const StatusBadge = ({ status }) => {
    const colors = {
      Pending: "bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-white",
      "In Progress": "bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-white",
      Completed: "bg-green-200 text-green-900 dark:bg-green-700 dark:text-white",
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const ActionButton = ({ status }) => {
    if (status === "Completed") return <PenLine size={16} />;
    if (status === "In Progress") return <ClipboardEdit size={16} />;
    return <Eye size={16} />;
  };

  const ActionLabel = (status) => {
    if (status === "Completed") return "Edit Marks";
    if (status === "In Progress") return "Continue";
    return "Review";
  };

  return (
    <div className="p-6 space-y-9">

      {/* Header Section */}
      <div className="space-y-1">
        <h1 className={`text-3xl font-semibold ${darkMode ? "text-white" : "text-[#0A66C2]"}`}>
          Evaluations
        </h1>
        <p className="opacity-60 text-sm">Review completed exams and assign scores.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-4">

        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border max-w-md w-full ${uiSurface}`}>
          <Search size={18} className="opacity-60" />
          <input
            placeholder="Search student / exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 opacity-70 text-sm">
          <Filter size={16} /> Filter
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`px-4 py-2 rounded-xl border cursor-pointer ${uiSurface}`}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className={`rounded-xl border shadow-sm overflow-hidden transition ${uiSurface}`}>
        <table className="w-full text-sm">
          <thead className={`${darkMode ? "bg-[#1e2535]" : "bg-gray-100"} text-gray-500`}>
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Exam</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Score</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr 
                key={s.id}
                className={`border-b hover:scale-[1.01] hover:shadow-sm transition cursor-pointer ${
                  darkMode ? "hover:bg-[#182133]" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4">{s.exam}</td>
                <td className="p-4 text-center">
                  <StatusBadge status={s.status} />
                </td>
                <td className="p-4 text-center font-semibold">{s.score ?? "—"}</td>
                <td className="p-4 text-right">
                  
                  <button
                    onClick={() => setSelected(s)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition ${
                      s.status === "Completed"
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <ActionButton status={s.status} /> {ActionLabel(s.status)}
                  </button>

                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center opacity-50">
                  No matched submissions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center transition z-50">
          <div className={`p-6 w-full max-w-lg rounded-2xl border shadow-xl ${uiSurface}`}>

            <h2 className="text-xl font-semibold mb-2">Review Submission</h2>
            <p className="opacity-60 text-sm mb-6">{selected.name} — {selected.exam}</p>

            <label className="text-sm opacity-70">Score: {selected.score ?? 0}/100</label>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full mt-2 mb-4"
              value={selected.score ?? 0}
              onChange={(e) =>
                setSelected({ ...selected, score: Number(e.target.value), status: "In Progress" })
              }
            />

            <textarea
              placeholder="Correction notes..."
              rows={4}
              value={selected.comments}
              onChange={(e) => setSelected({ ...selected, comments: e.target.value })}
              className={`w-full p-3 rounded-xl border outline-none mb-4 ${uiSurface}`}
            />

            <div className="flex justify-end gap-3">
              <button className="opacity-60 hover:opacity-100" onClick={() => setSelected(null)}>
                Cancel
              </button>

              <button
                className="flex gap-2 items-center bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
                onClick={() => {
                  setSelected({ ...selected, status: "Completed" });
                  updateSubmission();
                }}
              >
                <CheckCircle size={18} /> Save Result
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
