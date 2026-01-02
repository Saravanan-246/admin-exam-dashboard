import { useState } from "react";
import { Search, Trophy, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Students() {
  const { darkMode } = useTheme();

  const [search, setSearch] = useState("");

  // 🔥 Sample students data with class info
  const [students, setStudents] = useState([
    { id: 1, name: "Arjun Sharma", class: "Grade 10 - A", email: "arjun@mail.com", score: 92 },
    { id: 2, name: "Rahul Dev", class: "Grade 9 - B", email: "rahul@mail.com", score: 88 },
    { id: 3, name: "Meera N", class: "Grade 10 - A", email: "meera@mail.com", score: 46 },
    { id: 4, name: "Sanjay G", class: "Grade 8 - C", email: "sanjay@mail.com", score: 79 },
    { id: 5, name: "Pooja R", class: "Grade 12 - C", email: "pooja@mail.com", score: 95 },
    { id: 6, name: "Harini K", class: "Grade 11 - B", email: "harini@mail.com", score: 91 },
  ]);

  // 🎯 Filter: Only Students with Score >= 85
  const toppers = students
    .filter(s =>
      s.score >= 85 &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => b.score - a.score); // Sorting highest first

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const uiSurface = darkMode 
    ? "bg-[#111827] border-[#374151] text-gray-100"
    : "bg-white border-gray-300";

  const getRankBadge = (index) => {
    if (index === 0) return "🥇 Gold";
    if (index === 1) return "🥈 Silver";
    if (index === 2) return "🥉 Bronze";
    return "⭐ Top Performer";
  };

  return (
    <div className="p-6 space-y-10">

      {/* TITLE */}
      <div className="flex items-center gap-3">
        <Trophy size={30} className="text-yellow-500" />
        <div>
          <h1 className={`text-3xl font-semibold ${darkMode ? "text-white" : "text-[#0A66C2]"}`}>
            Top Students Leaderboard
          </h1>
          <p className="opacity-60 text-sm">Only displaying students scoring above <b>85%</b>.</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border max-w-md w-full ${uiSurface}`}>
        <Search size={18} className="opacity-60" />
        <input
          placeholder="Search by name or class..."
          className="bg-transparent outline-none w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className={`rounded-xl border shadow-sm overflow-hidden ${uiSurface}`}>
        <table className="w-full text-sm">
          <thead className={darkMode ? "bg-[#1e2535]" : "bg-gray-100"}>
            <tr className="text-gray-500">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Class</th>
              <th className="p-4 text-center">Score</th>
              <th className="p-4 text-center">Badge</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {toppers.map((stu, index) => (
              <tr
                key={stu.id}
                className={`${darkMode ? "hover:bg-[#182133]" : "hover:bg-gray-50"} border-b`}
              >
                <td className="p-4 font-semibold">{index + 1}</td>
                <td className="p-4 font-medium">{stu.name}</td>
                <td className="p-4 opacity-70">{stu.class}</td>

                <td className="p-4 text-center font-bold text-green-500">{stu.score}%</td>

                <td className="p-4 text-center font-semibold">
                  {getRankBadge(index)}
                </td>

                <td className="p-4 text-right">
                  <Trash2
                    className="cursor-pointer text-red-500 hover:scale-110 transition"
                    size={18}
                    onClick={() => deleteStudent(stu.id)}
                  />
                </td>
              </tr>
            ))}

            {toppers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center opacity-50">
                  ❌ No topper found (score ≥ 85%).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
