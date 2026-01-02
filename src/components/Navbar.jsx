import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div
      className={`w-full h-16 flex items-center justify-between px-6 transition-all
      ${darkMode ? "bg-[#0B1220] text-white" : "bg-white text-gray-800"}
      shadow-sm`}
    >
      {/* Left Section */}
      <h2 className="text-lg font-semibold tracking-tight">
        Admin Panel
      </h2>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Theme Switch */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition hover:scale-95 shadow-sm
          ${darkMode ? "bg-[#1E293B]" : "bg-[#F5F7FA]"}`}
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-300" />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* Profile Avatar */}
        <div
          className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center 
          text-white font-semibold cursor-pointer hover:scale-95 transition"
        >
          SA
        </div>
      </div>
    </div>
  );
}
