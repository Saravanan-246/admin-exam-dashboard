import { useState } from "react";
import { MessageSquare, BookOpen, Users, Settings } from "lucide-react";

import ClassStream from "./ClassStream";
import Classwork from "./Classwork";
import ClassStudents from "./ClassStudents";
import ClassSettings from "./ClassSettings";

import "./classroom.css";

const TABS = [
  { key: "stream", label: "Stream", icon: MessageSquare, component: ClassStream },
  { key: "classwork", label: "Classwork", icon: BookOpen, component: Classwork },
  { key: "students", label: "People", icon: Users, component: ClassStudents },
  { key: "settings", label: "Settings", icon: Settings, component: ClassSettings },
];

export default function ClassPanel() {
  const [activeTab, setActiveTab] = useState("students");

  const ActiveComponent =
    TABS.find((t) => t.key === activeTab)?.component;

  return (
    <div className="classroom-page">
      <div className="class-tabs">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`class-tab ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="class-content">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}
