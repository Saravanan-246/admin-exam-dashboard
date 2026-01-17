import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  FileQuestion,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { apiFetch } from "../services/api";
import "../styles/question-bank.css";

 
export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const emptyForm = {
    question: "",
    type: "MCQ",
    answer: "",
    image: null,
  };

  const [form, setForm] = useState(emptyForm);

  // 🔗 GET examId FROM URL
  const [params] = useSearchParams();
  const examId = params.get("examId");

  /* LOAD QUESTIONS FROM BACKEND */
  useEffect(() => {
    if (!examId) return;

    const loadQuestions = async () => {
      try {
        const res = await apiFetch(`/exams/${examId}`);
        setQuestions(res.exam.questions || []);
      } catch (err) {
        alert("Failed to load questions");
      }
    };

    loadQuestions();
  }, [examId]);

  /* IMAGE UPLOAD (BASE64 – OK TO KEEP) */
  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  /* RESET FORM */
  const closeModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModal(false);
  };

  /* SAVE QUESTION → BACKEND */
  const saveQuestion = async () => {
    if (!form.question.trim()) return;

    try {
      if (editingId) {
        await apiFetch(`/exams/${examId}/questions/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch(`/exams/${examId}/questions`, {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      const updated = await apiFetch(`/exams/${examId}`);
      setQuestions(updated.exam.questions);
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to save question");
    }
  };

  /* DELETE QUESTION → BACKEND */
  const confirmDelete = async () => {
    try {
      await apiFetch(`/exams/${examId}/questions/${deleteId}`, {
        method: "DELETE",
      });

      setQuestions((prev) => prev.filter((q) => q._id !== deleteId));
      setDeleteId(null);
    } catch {
      alert("Delete failed");
    }
  };

  /* FILTER (UNCHANGED) */
  const filtered = questions.filter((q) => {
    const matchSearch = q.question
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType = filter === "All" || q.type === filter;
    return matchSearch && matchType;
  });

  return (
    <div className="qb-root">
      {/* HEADER */}
      <div className="qb-header">
        <div>
          <div className="qb-title">Question Bank</div>
          <div className="qb-subtitle">
            Create and reuse questions across exams
          </div>
        </div>

        <button className="qb-btn" onClick={() => setModal(true)}>
          <Plus size={14} /> Add Question
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="qb-toolbar">
        <div className="qb-search">
          <Search size={14} />
          <input
            placeholder="Search question"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="qb-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>MCQ</option>
          <option>True/False</option>
          <option>Short Answer</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="qb-table">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Type</th>
              <th>Answer</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
<tbody>
  {filtered.map((q) => (
    <tr key={q._id}>
      <td>
        <div className="qb-qcell">
          <span>{q.question}</span>
          {q.image && (
            <img
              src={q.image}
              alt="question"
              className="qb-img"
            />
          )}
        </div>
      </td>

      <td>
        <span className="qb-badge">{q.type}</span>
      </td>

      <td>{q.answer || "—"}</td>

      <td className="qb-actions">
        <Edit3
          size={16}
          onClick={() => {
            setEditingId(q._id);
            setForm({
              question: q.question,
              type: q.type,
              answer: q.answer,
              image: q.image || null,
            });
            setModal(true);
          }}
        />
        <Trash2
          size={16}
          onClick={() => setDeleteId(q._id)}
        />
      </td>
    </tr>
  ))}

       {filtered.length === 0 && (
  <tr>
    <td colSpan="4" className="qb-empty">
      <FileQuestion size={36} />
      <div>No questions found</div>
    </td>
  </tr>
)}
</tbody>
</table>
</div>

{/* ADD / EDIT MODAL */}
{modal && (
  <div className="qb-overlay">
    <div className="qb-modal">
      <div className="qb-modal-title">
        {editingId ? "Edit Question" : "Add Question"}
      </div>

      <textarea
        className="qb-input"
        rows={3}
        placeholder="Enter question"
        value={form.question}
        onChange={(e) =>
          setForm({ ...form, question: e.target.value })
        }
      />

      <label className="qb-upload">
        <ImageIcon size={14} /> Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => handleImage(e.target.files[0])}
        />
      </label>

      {form.image && (
        <div className="qb-preview">
          <img src={form.image} alt="preview" />
          <button
            onClick={() =>
              setForm((p) => ({ ...p, image: null }))
            }
          >
            <X size={14} />
          </button>
        </div>
      )}

      <select
        className="qb-input"
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
      >
        <option>MCQ</option>
        <option>True/False</option>
        <option>Short Answer</option>
      </select>

      <input
        className="qb-input"
        placeholder="Answer (optional)"
        value={form.answer}
        onChange={(e) =>
          setForm({ ...form, answer: e.target.value })
        }
      />

      <div className="qb-modal-actions">
        <button className="qb-btn" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="qb-btn primary"
          onClick={saveQuestion}
          disabled={!form.question.trim()}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

{/* DELETE CONFIRM */}
{deleteId && (
  <div className="qb-overlay">
    <div className="qb-modal">
      <div className="qb-modal-title">Delete Question?</div>
      <p className="qb-subtitle">
        This action cannot be undone.
      </p>

      <div className="qb-modal-actions">
        <button
          className="qb-btn"
          onClick={() => setDeleteId(null)}
        >
          Cancel
        </button>
        <button
          className="qb-btn primary"
          onClick={confirmDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
</div>
);
}
