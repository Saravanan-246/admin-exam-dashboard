import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Copy,
  Trash2,
  Pencil,
  Users,
} from "lucide-react";

import { apiFetch } from "../services/api";

import "../styles/admin.css";

/* ================= UTIL ================= */
const genCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase() +
  Math.random().toString(36).substring(2, 4).toUpperCase();

export default function Classes() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const goAdmin = (path) => navigate(`/admin${path}`);

  const [classes, setClasses] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name: "", teacher: "" });

  /* ================= LOAD FROM MONGO ================= */
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await apiFetch("/classes");
        setClasses(
          data.map((c) => ({
            ...c,
            students: Array.isArray(c.students) ? c.students : [],
          }))
        );
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    };
    loadClasses();
  }, []);

  /* ================= TOAST AUTO HIDE ================= */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ================= CREATE ================= */
  const createClass = async () => {
    if (!form.name.trim()) return;

    try {
      const saved = await apiFetch("/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          teacher: form.teacher.trim() || "Unknown",
          code: genCode(),
        }),
      });

      setClasses((prev) => [...prev, saved]);
      setForm({ name: "", teacher: "" });
      setModal(false);
      setToast("Class created");

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      alert("Failed to create class");
    }
  };

  /* ================= EDIT ================= */
  const saveEdit = async () => {
    try {
      const updated = await apiFetch(`/classes/${edit._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: edit.name,
          teacher: edit.teacher,
        }),
      });

      setClasses((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
      setEdit(null);
      setToast("Class updated");
    } catch {
      alert("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const deleteClass = async () => {
    try {
      await apiFetch(`/classes/${confirmDelete._id}`, {
        method: "DELETE",
      });

      setClasses((prev) =>
        prev.filter((c) => c._id !== confirmDelete._id)
      );
      setConfirmDelete(null);
      setToast("Class deleted");
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= COPY ================= */
  const copyCode = (e, code) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setToast("Code copied");
  };

  /* ================= JSX CONTINUES BELOW ================= */
  return (
    <div className="admin-root">
      <div className="admin-wrapper">

        {/* HEADER */}
        <div className="admin-card classes-header">
          <div>
            <div className="classes-title">Classes</div>
            <div className="classes-subtitle">
              Manage classrooms and access codes
            </div>
          </div>

          <button className="btn-primary" onClick={() => setModal(true)}>
            <Plus size={14} /> Create Class
          </button>
        </div>

        {/* EMPTY */}
        {classes.length === 0 && (
          <div className="admin-card classes-empty">
            No classes created yet
          </div>
        )}

        {/* GRID */}
        <div className="classes-grid">
          {classes.map((c) => (
            <div
              key={c._id}                                    
              className="class-card"
              onClick={() => goAdmin(`/classes/${c._id}`)}  
            >
              <div className="class-actions">
                <Pencil
                  size={15}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEdit(c);
                  }}
                />
                <Trash2
                  size={15}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(c);
                  }}
                />
              </div>

              <div className="class-title">{c.name}</div>
              <div className="class-teacher">{c.teacher}</div>

              <div className="class-footer">
                <span className="class-code">
                  {c.code}
                  <Copy
                    size={12}
                    onClick={(e) => copyCode(e, c.code)}
                  />
                </span>

                <span className="class-students">
                  <Users size={13} /> {c.students?.length || 0}
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* CREATE */}
      {modal && (
        <Modal title="Create Class" onClose={() => setModal(false)}>
          <input
            className="modal-input"
            placeholder="Class name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <input
            className="modal-input"
            placeholder="Teacher name"
            value={form.teacher}
            onChange={(e) =>
              setForm({ ...form, teacher: e.target.value })
            }
          />
          <ModalActions
            onSubmit={createClass}
            onClose={() => setModal(false)}
            confirmText="Create"
          />
        </Modal>
      )}

      {/* EDIT */}
      {edit && (
        <Modal title="Edit Class" onClose={() => setEdit(null)}>
          <input
            className="modal-input"
            value={edit.name}
            onChange={(e) =>
              setEdit({ ...edit, name: e.target.value })
            }
          />
          <input
            className="modal-input"
            value={edit.teacher}
            onChange={(e) =>
              setEdit({ ...edit, teacher: e.target.value })
            }
          />
          <ModalActions
            onSubmit={saveEdit}
            onClose={() => setEdit(null)}
            confirmText="Save"
          />
        </Modal>
      )}

      {/* DELETE */}
      {confirmDelete && (
        <Modal title="Delete Class?" onClose={() => setConfirmDelete(null)}>
          <p className="modal-warning">
            This action cannot be undone.
          </p>
          <ModalActions
            onSubmit={deleteClass}
            onClose={() => setConfirmDelete(null)}
            confirmText="Delete"
            danger
          />
        </Modal>
      )}

      {/* TOAST */}
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}

/* ================= MODAL ================= */

function Modal({ title, children, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        {children}
        <button onClick={onClose} className="modal-close">✕</button>
      </div>
    </div>
  );
}

function ModalActions({ onSubmit, onClose, confirmText = "Confirm", danger }) {
  return (
    <div className="modal-actions">
      <button className="btn-secondary" onClick={onClose}>Cancel</button>
      <button
        className={`btn-primary ${danger ? "danger" : ""}`}
        onClick={onSubmit}
      >
        {confirmText}
      </button>
    </div>
  );
}

export { Modal, ModalActions };
