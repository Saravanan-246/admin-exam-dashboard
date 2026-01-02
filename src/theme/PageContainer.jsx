import { useTheme } from "../context/ThemeContext.jsx";

export default function PageContainer({ children }) {
  const { darkMode } = useTheme();

  return (
    <div
      className={`
        min-h-screen transition-all duration-300
        ${darkMode ? "bg-[#0B1220] text-gray-200" : "bg-[#F5F7FA] text-gray-900"}
      `}
    >
      {children}
    </div>
  );
}
