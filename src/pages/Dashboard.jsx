import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Load stored data from localStorage
  const exams = JSON.parse(localStorage.getItem("exams") || "[]");
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const submissions = JSON.parse(localStorage.getItem("evaluations") || "[]");

  const stats = [
    { label: "Total Exams", value: exams.length, icon: <ClipboardList size={22} /> },
    { label: "Students", value: students.length, icon: <Users size={22} /> },
    { label: "Pending Reviews", value: submissions.filter(s => s.status !== "Completed").length, icon: <CheckCircle size={22} /> },
  ];

  /** 🔥 Ripple Animation */
  useEffect(() => {
    const handler = (e) => {
      const btn = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.className = "smooth-wave";

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 900);
    };

    document.querySelectorAll(".wave-btn").forEach(btn => btn.addEventListener("click", handler));

    return () => document.querySelectorAll(".wave-btn").forEach(btn => btn.removeEventListener("click", handler));
  }, []);

  return (
    <>
      {/* Animation CSS (unchanged UI) */}
      <style>{`
        .wave-btn {
          position:relative;
          overflow:hidden;
          transition:0.25s ease;
          transform-origin:center;
        }
        .wave-btn:hover {
          box-shadow:0px 0px 18px rgba(10, 102, 255, 0.35);
          transform:translateY(-2px);
        }
        .wave-btn:active { transform:scale(.95); }

        .smooth-wave {
          position:absolute;
          border-radius:50%;
          background:rgba(255,255,255,0.4);
          transform:scale(0);
          animation:smoothPulse .85s ease-out forwards;
        }

        @keyframes smoothPulse {
          0% { transform:scale(.2); opacity:.85; }
          60% { opacity:.35; }
          100% { transform:scale(1.8); opacity:0; }
        }
      `}</style>


      <div className={`min-h-screen px-10 py-10 ${darkMode ? "bg-[#0F172A] text-white" : "bg-[#F7F9FC] text-black"}`}>

        {/* HEADER */}
        <div className={`${darkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"} px-10 py-10 rounded-2xl border shadow-md`}>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm opacity-70">Welcome back, <b>{user?.displayName}</b></p>

          <button className="wave-btn mt-8 px-6 py-3 rounded-xl bg-[#0A66FF] hover:bg-[#0057D9] text-white shadow-md font-medium"
            onClick={() => navigate("/create-exam")}>
            + Create New Exam
          </button>
        </div>

        {/* STATS */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((item, i) => (
            <div key={i} className={`${darkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"} p-7 rounded-xl shadow-md`}>
              <div className="flex justify-between">
                <p className="text-sm opacity-70">{item.label}</p>
                {item.icon}
              </div>
              <h2 className="text-4xl font-semibold mt-3">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className={`${darkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E2E8F0]"} mt-14 px-10 py-10 rounded-2xl shadow-md`}>
          <h2 className="text-xl font-semibold">Quick Actions</h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionButton label="Create Class" onClick={() => navigate("/classes")} />
            <ActionButton label="Add Question Bank" onClick={() => navigate("/questions")} />
            <ActionButton label="Publish Exam" onClick={() => navigate("/create-exam")} disabled={students.length === 0} />
            <ActionButton label="Evaluate Responses" onClick={() => navigate("/evaluate")} disabled={submissions.length === 0} />
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-20 flex flex-col items-center text-center opacity-80 gap-3">

          <div className={`w-32 h-[2px] rounded-full ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}></div>

          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            <span className="font-medium">Analytics Module</span> is under development.
          </p>

          <div className={`mt-3 w-40 h-1 rounded-full overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
            <div className={`h-full animate-loadingBar ${darkMode ? "bg-blue-500" : "bg-[#0A66FF]"}`}></div>
          </div>
        </div>

      </div>
    </>
  );
}


function ActionButton({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`wave-btn w-full px-6 py-4 rounded-xl text-white font-medium shadow-md transition 
      ${disabled ? "bg-gray-500 cursor-not-allowed opacity-50" : "bg-[#0A66FF] hover:bg-[#0057D9]"}`}>
      {label}
    </button>
  );
}
