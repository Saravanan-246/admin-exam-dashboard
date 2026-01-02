import { useState, useEffect } from "react";
import { Plus, Copy, Trash2, Pencil, Users } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Classes() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [classes, setClasses] = useState([]);

  const [newClass, setNewClass] = useState({
    name: "",
    teacher: "",
  });

  const generateCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  // Load Saved Classes
  useEffect(() => {
    const saved = localStorage.getItem("classes");
    if (saved) setClasses(JSON.parse(saved));
  }, []);

  // Save Automatically
  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  const createClass = () => {
    if (!newClass.name.trim()) return;

    setClasses([
      ...classes,
      {
        id: Date.now(),
        name: newClass.name,
        teacher: newClass.teacher || "Unknown",
        code: generateCode(),
        students: Math.floor(Math.random() * 25),
      },
    ]);

    setNewClass({ name: "", teacher: "" });
    setModalOpen(false);
  };

  const deleteClass = (id) => {
    setClasses((prev) => prev.filter((cls) => cls.id !== id));
  };

  const saveEdit = () => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === editData.id ? editData : cls))
    );
    setEditData(null);
  };

  const copyCode = (code) => navigator.clipboard.writeText(code);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className={`text-3xl font-semibold ${
            darkMode ? "text-white" : "text-[#0A66C2]"
          }`}
        >
          Classes
        </h1>

        <button
          onClick={() => setModalOpen(true)}
          className="wave-btn bg-[#0A66C2] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow hover:bg-[#0d5ccf] active:scale-[0.98] transition-all"
        >
          <Plus size={18} /> Create Class
        </button>
      </div>

      {/* EMPTY VIEW */}
      {classes.length === 0 && (
        <div className="text-center py-16 opacity-60 text-sm">
          🚀 No classes yet — click <b>Create Class</b> to begin.
        </div>
      )}

      {/* CLASS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`p-6 rounded-2xl shadow-md cursor-pointer border transition hover:-translate-y-1 hover:shadow-lg relative
              ${
                darkMode
                  ? "bg-[#111827] border-[#374151]"
                  : "bg-white border-[#E2E8F0]"
              }`}
            onClick={() => navigate(`/class/${cls.id}`, { state: cls })}
          >
            {/* ACTION BUTTONS */}
            <div className="absolute top-3 right-3 flex gap-3">
              <Pencil
                size={18}
                className="cursor-pointer hover:text-blue-500 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditData(cls);
                }}
              />
              <Trash2
                size={18}
                className="cursor-pointer text-red-500 hover:scale-110 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteClass(cls.id);
                }}
              />
            </div>

            {/* CLASS DETAILS */}
            <h2 className="text-lg font-semibold">{cls.name}</h2>
            <p className="text-sm opacity-70">👨‍🏫 {cls.teacher}</p>

            {/* FOOTER */}
            <div className="mt-5 flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2
                ${
                  darkMode
                    ? "bg-[#1f2a3a] text-gray-200"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {cls.code}
                <Copy
                  size={14}
                  className="cursor-pointer hover:scale-125 transition"
                  onClick={() => copyCode(cls.code)}
                />
              </span>

              <span className="text-sm opacity-80 flex items-center gap-1">
                <Users size={16} /> {cls.students}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {modalOpen && (
        <Modal
          title="Create Class"
          darkMode={darkMode}
          onClose={() => setModalOpen(false)}
        >
          <input
            placeholder="Class Name"
            className={`w-full p-3 rounded-xl mb-4 border outline-none ${
              darkMode
                ? "bg-[#0B1221] border-[#374151] text-white"
                : "bg-gray-100 border-gray-300"
            }`}
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          />

          <input
            placeholder="Teacher Name"
            className={`w-full p-3 rounded-xl border outline-none ${
              darkMode
                ? "bg-[#0B1221] border-[#374151] text-white"
                : "bg-gray-100 border-gray-300"
            }`}
            value={newClass.teacher}
            onChange={(e) =>
              setNewClass({ ...newClass, teacher: e.target.value })
            }
          />

          <ModalActions onSubmit={createClass} onClose={() => setModalOpen(false)} />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editData && (
        <Modal
          title="Edit Class"
          darkMode={darkMode}
          onClose={() => setEditData(null)}
        >
          <input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className={`w-full p-3 rounded-xl mb-4 border outline-none ${
              darkMode ? "bg-[#0B1221] border-[#374151] text-white" : "bg-gray-100 border-gray-300"
            }`}
          />

          <input
            value={editData.teacher}
            onChange={(e) =>
              setEditData({ ...editData, teacher: e.target.value })
            }
            className={`w-full p-3 rounded-xl border outline-none ${
              darkMode ? "bg-[#0B1221] border-[#374151] text-white" : "bg-gray-100 border-gray-300"
            }`}
          />

          <ModalActions onSubmit={saveEdit} onClose={() => setEditData(null)} />
        </Modal>
      )}
    </div>
  );
}

/* MODAL COMPONENT */
function Modal({ children, title, darkMode, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className={`p-6 w-full max-w-md rounded-2xl border relative shadow-xl ${
          darkMode ? "bg-[#111827] border-[#374151] text-white" : "bg-white"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <button className="absolute top-4 right-4 opacity-70 hover:opacity-100" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}

/* FOOTER BUTTONS */
function ModalActions({ onSubmit, onClose }) {
  return (
    <div className="flex justify-end gap-3 mt-4">
      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        Cancel
      </button>
      <button
        onClick={onSubmit}
        className="bg-[#0A66C2] text-white px-5 py-2 rounded-xl hover:bg-[#0d5ccf] active:scale-[0.98] transition"
      >
        Save
      </button>
    </div>
  );
}
