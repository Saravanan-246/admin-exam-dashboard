import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function ReviewExam() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { darkMode } = useTheme();

  const expectedAnswers = {
    1: "An object will remain at rest or in uniform motion unless acted by an external force.",
    2: "Tokyo",
    3: "405",
  };

  const similarityPercentage = (answer, expected) => {
    const normalize = (str) =>
      str.toLowerCase().replace(/[^a-z0-9 ]/gi, "").split(" ");

    const aWords = normalize(answer);
    const bWords = normalize(expected);

    const common = aWords.filter((word) => bWords.includes(word)).length;
    return Math.floor((common / bWords.length) * 100);
  };

  const autoEvaluate = (answer, expected, maxMarks) => {
    const match = similarityPercentage(answer, expected);

    if (match >= 90) return { status: "Correct", marks: maxMarks };
    if (match >= 50) return { status: "Partial", marks: Math.ceil(maxMarks * 0.5) };
    return { status: "Wrong", marks: 0 };
  };

  const [submission, setSubmission] = useState({
    student: state?.name || "Unknown Student",
    exam: state?.exam || "Untitled Exam",
    answers: [
      {
        id: 1,
        question: "Explain Newton's First Law.",
        studentAnswer: "A object continues unless force acts.",
        maxMarks: 5,
        ...autoEvaluate("A object continues unless force acts.", expectedAnswers[1], 5),
      },
      {
        id: 2,
        question: "What is the capital of Japan?",
        studentAnswer: "Tokyo",
        maxMarks: 2,
        ...autoEvaluate("Tokyo", expectedAnswers[2], 2),
      },
      {
        id: 3,
        question: "Solve: 45 × 9",
        studentAnswer: "395",
        maxMarks: 3,
        ...autoEvaluate("395", expectedAnswers[3], 3),
      },
    ],
  });

  const updateMarks = (id, value) => {
    setSubmission((prev) => ({
      ...prev,
      answers: prev.answers.map((q) =>
        q.id === id ? { ...q, givenMarks: Number(value) } : q
      ),
    }));
  };

  const totalScore = submission.answers.reduce((sum, q) => sum + q.givenMarks, 0);
  const maxScore = submission.answers.reduce((sum, q) => sum + q.maxMarks, 0);

  const submitResults = () => {
    alert(`Final Marks Submitted: ${totalScore}/${maxScore}`);
    navigate(-1);
  };

  return (
    <div className="p-6 space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 opacity-60 hover:opacity-100">
        <ArrowLeft size={18} /> Go Back
      </button>

      <h1 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-[#0A66C2]"}`}>
        Reviewing: {submission.student}
      </h1>
      <p className="opacity-60">Exam: {submission.exam}</p>

      <div className={`p-5 rounded-xl border font-semibold text-lg text-center 
        ${darkMode ? "bg-[#111827] border-[#374151]" : "bg-white border-gray-300"}`}>
        Score: <span className="text-green-500">{totalScore}</span> / {maxScore}
      </div>

      {submission.answers.map((q) => (
        <div
          key={q.id}
          className={`p-5 rounded-xl border shadow-md 
          ${darkMode ? "bg-[#111827] border-[#374151]" : "bg-white border-gray-300"}`}
        >
          <h2 className="font-semibold text-lg">
            {q.id}. {q.question}
          </h2>

          <p className="mt-2 opacity-70 text-sm">Student Answer:</p>
          <p className="italic">{q.studentAnswer}</p>

          {/* Auto Evaluation */}
          <div className="mt-4 p-3 rounded-lg text-sm bg-blue-50 dark:bg-[#1d2d4a]">
            <b>AI Evaluation:</b> {q.status}  
          </div>

          {/* Manual Adjustment */}
          <div className="mt-3">
            <label className="text-sm opacity-70">
              Adjust Score: {q.givenMarks}/{q.maxMarks}
            </label>
            <input
              type="range"
              min="0"
              max={q.maxMarks}
              value={q.givenMarks}
              onChange={(e) => updateMarks(q.id, e.target.value)}
              className="w-full mt-2"
            />
          </div>
        </div>
      ))}

      <button
        onClick={submitResults}
        className="w-full bg-green-600 text-white py-3 rounded-xl flex gap-2 items-center justify-center text-lg hover:bg-green-700 transition"
      >
        <Send size={20} /> Submit Final Score
      </button>
    </div>
  );
}
