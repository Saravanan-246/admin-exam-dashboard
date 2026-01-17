import { BookOpen } from "lucide-react";
import "./classroom.css";

export default function Classwork() {
  return (
    <div className="gc-card center-card">
      <BookOpen size={36} className="icon-primary" />
      <h3>Classwork</h3>
      <p className="muted">Assignments and materials coming soon.</p>
    </div>
  );
}
