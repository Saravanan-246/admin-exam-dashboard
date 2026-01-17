import { Plus, Pencil, Trash2, User } from "lucide-react";
import "./classroom.css";

export default function ClassStudents({
  students = [],
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  return (
    <div className="gc-card students-card">
      <div className="students-header">
        <div className="students-title">
          <User size={18} />
          <h3>People ({students.length})</h3>
        </div>

        <button className="add-btn" onClick={onAdd}>
          <Plus size={16} />
          Add Student
        </button>
      </div>

      <div className="students-table-head">
        <span>Name</span>
        <span>Email</span>
        <span className="actions-col">Actions</span>
      </div>

      {students.length === 0 && (
        <div className="students-empty">No students yet</div>
      )}

      {students.map((s) => (
        <div key={s.id} className="student-row">
          <div className="student-name">
            <User size={16} />
            <strong>{s.name}</strong>
          </div>

          <div className="student-email">{s.email}</div>

          <div className="student-actions">
            <button className="icon-btn" onClick={() => onEdit(s)}>
              <Pencil size={15} />
            </button>
            <button
              className="icon-btn danger"
              onClick={() => onDelete(s.id)}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
