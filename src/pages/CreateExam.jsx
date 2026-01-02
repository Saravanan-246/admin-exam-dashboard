import { useState, useEffect } from "react";
import { Calendar, Clock, FilePlus, Layers } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function CreateExam() {
  const { darkMode } = useTheme();

  const [classes, setClasses] = useState([]);
  const [saving, setSaving] = useState(false);

  const [examData, setExamData] = useState({
    title: "",
    subject: "",
    classId: "",
    date: "",
    time: "",
    duration: "",
    marks: "",
  });

  // Load Class List
  useEffect(() => {
    const stored = localStorage.getItem("classes");
    if (stored) setClasses(JSON.parse(stored));
  }, []);

  const saveExam = () => {
    if (!examData.title.trim() || !examData.classId) {
      alert("⚠ Please fill exam name and select class!");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      const previous = JSON.parse(localStorage.getItem("exams") || "[]");
      previous.push({ id: Date.now(), ...examData });

      localStorage.setItem("exams", JSON.stringify(previous));
      setSaving(false);

      alert("🎉 Exam successfully created!");

      setExamData({
        title: "",
        subject: "",
        classId: "",
        date: "",
        time: "",
        duration: "",
        marks: "",
      });
    }, 700);
  };

  const baseInput = `
    w-full p-3 rounded-xl border outline-none transition-all
    focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]
  `;

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className={`text-3xl font-semibold ${
          darkMode ? "text-white" : "text-[#0A66C2]"
        }`}>
          Create Exam
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Schedule exams and assign to classes.</p>
      </div>

      {/* Form Container */}
      <div className={`p-8 rounded-2xl border shadow-lg transition ${
        darkMode ? "bg-[#0d1424] border-[#2b3244] text-white" : "bg-white border-[#E2E8F0]"
      }`}>

        {/* Section Title */}
        <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <Layers size={20} /> Exam Details
        </div>

        <div className="space-y-5">

          {/* Title */}
          <input
            className={`${baseInput} ${
              darkMode ? "bg-[#182135] border-[#374151] text-white" : "bg-gray-100 border-gray-300"
            }`}
            placeholder="Exam Title (Example: Mid Term)"
            value={examData.title}
            onChange={(e) => setExamData({ ...examData, title: e.target.value })}
          />

          {/* Subject */}
          <input
            className={`${baseInput} ${
              darkMode ? "bg-[#182135] border-[#374151] text-white" : "bg-gray-100 border-gray-300"
            }`}
            placeholder="Subject (Example: Science)"
            value={examData.subject}
            onChange={(e) => setExamData({ ...examData, subject: e.target.value })}
          />

          {/* Class Selector */}
          <select
            className={`${baseInput} cursor-pointer ${
              darkMode ? "bg-[#182135] border-[#374151] text-white" : "bg-gray-100 border-gray-300"
            }`}
            value={examData.classId}
            onChange={(e) => setExamData({ ...examData, classId: e.target.value })}
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} — {cls.teacher}
              </option>
            ))}
          </select>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-5">
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-3 opacity-60" />
              <input
                type="date"
                className={`${baseInput} pl-10 ${
                  darkMode ? "bg-[#182135] border-[#374151] text-white" : "bg-gray-100 border-gray-300"
                }`}
                value={examData.date}
                onChange={(e) => setExamData({ ...examData, date: e.target.value })}
              />
            </div>

            <div className="relative">
              <Clock size={18} className="absolute left-3 top-3 opacity-60" />
              <input
                type="time"
                className={`${baseInput} pl-10 ${
                  darkMode ? "bg-[#182135] border-[#374151] text-white" : "bg-gray-100 border-gray-300"
                }`}
                value={examData.time}
                onChange={(e) => setExamData({ ...examData, time: e.target.value })}
              />
            </div>
          </div>

          {/* Duration & Marks */}
          <div className="grid grid-cols-2 gap-5">
            <input
              className={`${baseInput} ${
                darkMode ? "bg-[#182135] border-[#374151] text-white" : "bg-gray-100 border-gray-300"
              }`}
              placeholder="Duration (Minutes)"
              value={examData.duration}
              onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
            />

            <input
              className={`${baseInput} ${
                darkMode ? "bg-[#182135] border-[#374151] text-white" : "bg-gray-100 border-gray-300"
              }`}
              placeholder="Total Marks"
              value={examData.marks}
              onChange={(e) => setExamData({ ...examData, marks: e.target.value })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={saveExam}
          disabled={saving}
          className={`w-full mt-8 py-3 rounded-xl text-white flex items-center justify-center gap-2
          transition-all shadow-md active:scale-[.97]
          ${saving ? "bg-gray-500 cursor-not-allowed" : "bg-[#0A66C2] hover:bg-[#005fd8]"}`}
        >
          <FilePlus size={20} />
          {saving ? "Saving..." : "Create Exam"}
        </button>
      </div>
    </div>
  );
}
