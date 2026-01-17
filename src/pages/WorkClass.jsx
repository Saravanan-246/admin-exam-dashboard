import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Copy,
  RefreshCcw,
  ArrowLeft,
  Trash2,
  Plus,
  Users,
  Pencil,
} from "lucide-react";
import "../styles/admin.css";

/* ================= UTIL ================= */
const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase() +
  Math.random().toString(36).substring(2, 4).toUpperCase();

export default function WorkClass() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });

  /* ================= LOAD (REFRESH SAFE) ================= */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("classes");
      const classes = raw ? JSON.parse(raw) : [];

      const found = classes.find(
        (c) => String(c.id) === String(id)
      );

      if (!found) {
        setNotFound(true);
      } else {
        setClassInfo({
          ...found,
          students: Array.isArray(found.students)
            ? found.students
            : [],
        });
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* ================= PERSIST ================= */
  const persist = (updatedClass) => {
    const raw = localStorage.getItem("classes");
    const classes = raw ? JSON.parse(raw) : [];

    const updated = classes.map((c) =>
      String(c.id) === String(updatedClass.id)
        ? updatedClass
        : c
    );

    localStorage.setItem("classes", JSON.stringify(updated));
    setClassInfo(updatedClass);
  };

  /* ================= ACTIONS ================= */

  const copyCode = () => {
    navigator.clipboard.writeText(classInfo.code);
  };

  const regenerateCode = () => {
    persist({ ...classInfo, code: generateCode() });
  };

  const addStudent = () => {
    if (!newStudent.name.trim() || !newStudent.email.trim()) return;

    persist({
      ...classInfo,
      students: [
        ...classInfo.students,
        {
          id: Date.now(),
          name: newStudent.name.trim(),
          email: newStudent.email.trim(),
        },
      ],
    });

    setNewStudent({ name: "", email: "" });
    setShowAddModal(false);
  };

  const removeStudent = (sid) => {
    persist({
      ...classInfo,
      students: classInfo.students.filter(
        (s) => s.id !== sid
      ),
    });
  };

  const saveEditStudent = () => {
    persist({
      ...classInfo,
      students: classInfo.students.map((s) =>
        s.id === editStudent.id ? editStudent : s
      ),
    });
    setEditStudent(null);
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="admin-root flex items-center justify-center">
        <p className="opacity-60">Loading class...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="admin-root flex flex-col items-center justify-center gap-4">
        <p className="text-lg opacity-70">Class not found</p>
        <button
          className="btn-primary"
          onClick={() => navigate("/admin/classes")}
        >
          Back to Classes
        </button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="admin-root p-6 space-y-10">

      {/* BACK */}
      <button
        onClick={() => navigate("/admin/classes")}
        className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">
          {classInfo.name}
        </h1>
        <p className="opacity-70 text-sm">
          👨‍🏫 {classInfo.teacher}
        </p>
      </div>

      {/* CLASS CODE */}
      <div className="admin-card flex justify-between items-center">
        <div>
          <p className="text-xs opacity-50">Class Code</p>
          <h2 className="text-2xl font-semibold tracking-widest">
            {classInfo.code}
          </h2>
        </div>

        <div className="flex gap-4">
          <Copy size={20} className="cursor-pointer" onClick={copyCode} />
          <RefreshCcw size={20} className="cursor-pointer" onClick={regenerateCode} />
        </div>
      </div>

      {/* PEOPLE HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Users size={20} /> People ({classInfo.students.length})
        </div>

        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* TABLE */}
      <div className="admin-card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {classInfo.students.length === 0 && (
              <tr>
                <td colSpan="3" className="p-6 text-center opacity-50">
                  No students yet
                </td>
              </tr>
            )}

            {classInfo.students.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-4">{s.name}</td>
                <td className="p-4 opacity-70">{s.email}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-3">
                    <Pencil
                      size={18}
                      className="cursor-pointer"
                      onClick={() => setEditStudent(s)}
                    />
                    <Trash2
                      size={18}
                      className="cursor-pointer text-red-500"
                      onClick={() => removeStudent(s.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <Modal title="Add Student" onClose={() => setShowAddModal(false)}>
          <input
            className="modal-input"
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, name: e.target.value })
            }
          />
          <input
            className="modal-input"
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
          />
          <ModalActions
            onClose={() => setShowAddModal(false)}
            onSubmit={addStudent}
            confirmText="Add"
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editStudent && (
        <Modal title="Edit Student" onClose={() => setEditStudent(null)}>
          <input
            className="modal-input"
            value={editStudent.name}
            onChange={(e) =>
              setEditStudent({ ...editStudent, name: e.target.value })
            }
          />
          <input
            className="modal-input"
            value={editStudent.email}
            onChange={(e) =>
              setEditStudent({ ...editStudent, email: e.target.value })
            }
          />
          <ModalActions
            onClose={() => setEditStudent(null)}
            onSubmit={saveEditStudent}
            confirmText="Save"
          />
        </Modal>
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="modal-box">
        <h2 className="modal-title">{title}</h2>
        {children}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

function ModalActions({ onSubmit, onClose, confirmText }) {
  return (
    <div className="modal-actions">
      <button className="btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button className="btn-primary" onClick={onSubmit}>
        {confirmText}
      </button>
    </div>
  );
}
