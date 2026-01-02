import { BrowserRouter, Routes, Route } from "react-router-dom";

// Admin Auth
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

// Admin Pages
import AdminLayout from "./layout/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Classes from "./pages/Classes.jsx";
import CreateExam from "./pages/CreateExam.jsx";
import QuestionBank from "./pages/QuestionBank.jsx";
import Evaluations from "./pages/Evaluations.jsx";
import Students from "./pages/Students.jsx";
import WorkClass from "./pages/WorkClass.jsx";
import ReviewExam from "./pages/ReviewExam.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* First page = admin login */}
        <Route path="/" element={<Login />} />

        {/* -------- ADMIN AUTH -------- */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />

        {/* -------- ADMIN SECTION (Protected) -------- */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classes" element={<Classes />} />
          <Route path="create-exam" element={<CreateExam />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="evaluate" element={<Evaluations />} />
          <Route path="students" element={<Students />} />
          <Route path="class/:id" element={<WorkClass />} />
          <Route path="evaluate/review" element={<ReviewExam />} />
        </Route>

        {/* Fallback: any unknown route → Login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
