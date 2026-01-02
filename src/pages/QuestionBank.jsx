import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit3, FileQuestion, Filter } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function QuestionBank() {
  const { darkMode } = useTheme();

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    question: "",
    type: "MCQ",
    answer: "",
  });

  // Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("questionBank");
    if (stored) setQuestions(JSON.parse(stored));
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem("questionBank", JSON.stringify(questions));
  }, [questions]);

  const saveQuestion = () => {
    if (!form.question.trim()) return alert("⚠ Question cannot be empty.");

    if (editing) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editing.id ? { ...editing, ...form } : q))
      );
      setEditing(null);
    } else {
      setQuestions([...questions, { id: Date.now(), ...form }]);
    }

    setForm({ question: "", type: "MCQ", answer: "" });
    setModalOpen(false);
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const filteredQuestions = questions.filter((q) => {
    const matchSearch = q.question.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || q.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-semibold ${darkMode ? "text-white" : "text-[#0A66C2]"}`}>
            Question Bank
          </h1>
          <p className="opacity-60 text-sm mt-1">
            Store, organize and reuse questions across exams.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#0A66C2] text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-[#0952a5] transition"
        >
          <Plus size={18} /> Add Question
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4 items-center">

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border max-w-sm w-full ${
            darkMode ? "bg-[#0d1324] border-[#334155] text-white" : "bg-white border-gray-300"
          }`}
        >
          <Search size={18} className="opacity-60" />
          <input
            placeholder="Search questions..."
            className="bg-transparent outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 opacity-70">
          <Filter size={18} /> Type:
        </div>

        <select
          className={`px-4 py-2 rounded-xl border cursor-pointer ${
            darkMode ? "bg-[#141d31] border-[#374151] text-gray-200" : "bg-white border-gray-300"
          }`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>MCQ</option>
          <option>True/False</option>
          <option>Short Answer</option>
        </select>
      </div>

      {/* Question List */}
      <div
        className={`rounded-xl border shadow-sm overflow-hidden ${
          darkMode ? "bg-[#111827] border-[#374151]" : "bg-white border-[#e2e8f0]"
        }`}
      >
        <table className="w-full text-sm">
          <thead
            className={`${darkMode ? "bg-[#1e2535] text-gray-300" : "bg-gray-100 text-gray-600"}`}
          >
            <tr>
              <th className="p-4 text-left">Question</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Answer</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredQuestions.map((q) => (
              <tr
                key={q.id}
                className={`border-b ${
                  darkMode ? "border-[#374151] hover:bg-[#182133]" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-4">{q.question}</td>
                <td className="p-4 font-medium">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      darkMode
                        ? "bg-[#243044] text-gray-200"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {q.type}
                  </span>
                </td>
                <td className="p-4 opacity-75">{q.answer || "—"}</td>

                <td className="p-4 text-right flex justify-end gap-3">
                  <Edit3
                    size={18}
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      setEditing(q);
                      setForm(q);
                      setModalOpen(true);
                    }}
                  />
                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-500 hover:scale-110 transition"
                    onClick={() => deleteQuestion(q.id)}
                  />
                </td>
              </tr>
            ))}

            {filteredQuestions.length === 0 && (
              <tr>
                <td colSpan="4" className="py-12 text-center opacity-50 text-sm">
                  <FileQuestion size={40} className="mx-auto mb-2 opacity-40" />
                  No matching questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Modal Component */
function Modal({ children, darkMode, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
      <div
        className={`p-6 w-full max-w-md rounded-2xl border shadow-lg relative animate-fade ${
          darkMode ? "bg-[#0f172a] border-[#374151] text-white" : "bg-white"
        }`}
      >
        {children}
        <button className="absolute top-3 right-3 text-gray-400 hover:text-red-400" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}
