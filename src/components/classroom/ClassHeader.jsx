import "./classroom.css";
import { Copy, RefreshCcw } from "lucide-react";

export default function ClassHeader({ name, teacher, code, onCopy, onRegen }) {
  return (
    <div className="gc-header">
      <div>
        <h1>{name}</h1>
        <p>{teacher}</p>
      </div>

      <div className="gc-code">
        <span>{code}</span>
        <Copy size={16} onClick={onCopy} />
        <RefreshCcw size={16} onClick={onRegen} />
      </div>
    </div>
  );
}
