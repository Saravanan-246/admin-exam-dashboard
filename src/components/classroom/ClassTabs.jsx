import { MessageSquare, BookOpen, Users } from "lucide-react";
import "./classroom.css";

const TABS = [
  { label: "Stream", icon: MessageSquare },
  { label: "Classwork", icon: BookOpen },
  { label: "People", icon: Users },
];

export default function ClassTabs({ tab, setTab }) {
  return (
    <div className="gc-tabs">
      {TABS.map(({ label, icon: Icon }) => (
        <button
          key={label}
          className={`gc-tab ${tab === label ? "active" : ""}`}
          onClick={() => setTab(label)}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
