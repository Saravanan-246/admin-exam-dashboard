import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Copy, RefreshCcw, ArrowLeft, Trash2, Plus, Users, Pencil } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function WorkClass() {
  const { darkMode } = useTheme();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });

  /* ---- Load Class Data ---- */
  useEffect(() => {
    if (location.state) {
      setClassInfo({
        ...location.state,
        students: Array.isArray(location.state.students) ? location.state.students : []
      });
    } else {
      // fallback mode so no crash
      setClassInfo({
        id,
        name: "Untitled Class",
        teacher: "Unknown",
        code: "------",
        students: []
      });
    }
  }, [id, location.state]);


  /* ---- Actions ---- */
  const copyCode = () => navigator.clipboard.writeText(classInfo.code);

  const regenerateCode = () => {
    setClassInfo((prev) => ({
      ...prev,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    }));
  };

  const removeStudent = (sid) => {
    setClassInfo((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== sid),
    }));
  };

  const addStudent = () => {
    if (!newStudent.name.trim() || !newStudent.email.trim()) return;

    setClassInfo((prev) => ({
      ...prev,
      students: [
        ...prev.students,
        { id: Date.now(), name: newStudent.name, email: newStudent.email },
      ],
    }));

    setNewStudent({ name: "", email: "" });
    setShowAddModal(false);
  };

  const saveEditStudent = () => {
    setClassInfo((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === showEditModal.id ? showEditModal : s)),
    }));
    setShowEditModal(null);
  };


  if (!classInfo)
    return <p className="p-10 text-center opacity-50 animate-pulse">Loading...</p>;


  return (
    <div className="p-6 space-y-10">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">{classInfo.name}</h1>
        <p className="opacity-70 mt-1 text-sm">👨‍🏫 {classInfo.teacher}</p>
      </div>

      {/* Class Code Card */}
      <div
        className={`p-6 rounded-2xl border shadow-sm flex justify-between items-center transition
        hover:shadow-lg hover:-translate-y-1
        ${darkMode ? "bg-[#111827] border-[#374151]" : "bg-white border-[#E2E8F0]"}`}
      >
        <div>
          <p className="text-xs opacity-50">Class Code</p>
          <h2 className="text-2xl font-semibold tracking-widest">{classInfo.code}</h2>
        </div>

        <div className="flex gap-4">
          <Copy
            size={20}
            className="cursor-pointer hover:scale-110 transition"
            onClick={copyCode}
          />
          <RefreshCcw
            size={20}
            className="cursor-pointer hover:rotate-180 transition"
            onClick={regenerateCode}
          />
        </div>
      </div>

      {/* Students Section Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Users size={20} /> People ({classInfo.students.length})
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#0A66C2] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#005fd8] transition"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* Table */}
      <div
        className={`rounded-xl border overflow-hidden shadow-sm transition
        ${darkMode ? "bg-[#111827] border-[#374151]" : "bg-white border-[#E2E8F0]"}`}
      >
        <table className="w-full">
          <thead className={`${darkMode ? "bg-[#1f2937] text-gray-300" : "bg-gray-100"}`}>
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {classInfo.students.length === 0 && (
              <tr>
                <td colSpan="3" className="p-6 text-center opacity-50 text-sm">
                  No students here yet 👀
                </td>
              </tr>
            )}

            {classInfo.students.map((stu) => (
              <tr
                key={stu.id}
                className={`border-b transition
                ${darkMode ? "border-[#374151] hover:bg-[#1e2532]" : "hover:bg-gray-50"}`}
              >
                <td className="p-4">{stu.name}</td>
                <td className="p-4 opacity-70">{stu.email}</td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <Pencil
                    size={18}
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => setShowEditModal(stu)}
                  />
                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-500 hover:scale-110"
                    onClick={() => removeStudent(stu.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Add Student Modal */}
      {showAddModal && (
        <Modal title="Add Student" darkMode={darkMode} onClose={() => setShowAddModal(false)}>
          <input
            className={`w-full p-3 rounded-xl border mb-4 outline-none transition
            ${darkMode ? "bg-[#0B1221] border-[#374151] text-white" : "bg-gray-100 border-gray-300"}`}
            placeholder="Student Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className={`w-full p-3 rounded-xl border outline-none transition
            ${darkMode ? "bg-[#0B1221] border-[#374151] text-white" : "bg-gray-100 border-gray-300"}`}
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent((prev) => ({ ...prev, email: e.target.value }))}
          />

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="bg-[#0A66C2] text-white px-5 py-2 rounded-xl" onClick={addStudent}>
              Add
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <Modal title="Edit Student" darkMode={darkMode} onClose={() => setShowEditModal(null)}>
          <input
            className={`w-full p-3 rounded-xl border mb-4
            ${darkMode ? "bg-[#0B1221] border-[#374151] text-white" : "bg-gray-100 border-gray-300"}`}
            value={showEditModal.name}
            onChange={(e) => setShowEditModal({ ...showEditModal, name: e.target.value })}
          />
          <input
            className={`w-full p-3 rounded-xl border
            ${darkMode ? "bg-[#0B1221] border-[#374151] text-white" : "bg-gray-100 border-gray-300"}`}
            value={showEditModal.email}
            onChange={(e) => setShowEditModal({ ...showEditModal, email: e.target.value })}
          />

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowEditModal(null)}>Cancel</button>
            <button className="bg-[#0A66C2] text-white px-5 py-2 rounded-xl" onClick={saveEditStudent}>
              Save
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}

/* Modal Component */
function Modal({ children, title, darkMode, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className={`p-6 w-full max-w-md rounded-2xl border relative transition shadow-xl
        ${darkMode ? "bg-[#111827] border-[#374151] text-white" : "bg-white"}`}
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
        <button className="absolute top-4 right-4 opacity-50 hover:opacity-100" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}
