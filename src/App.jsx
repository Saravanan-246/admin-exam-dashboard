import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Admin Auth
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

// Admin Layout
import AdminLayout from "./layout/AdminLayout.jsx";

// Admin Pages
import Dashboard from "./pages/Dashboard.jsx";
import Classes from "./pages/Classes.jsx";
import CreateExam from "./pages/CreateExam.jsx";
import QuestionBank from "./pages/QuestionBank.jsx";
import Evaluations from "./pages/Evaluations.jsx";
import Students from "./pages/Students.jsx";
import WorkClass from "./pages/WorkClass.jsx";
import ReviewExam from "./pages/ReviewExam.jsx";
import Profile from "./pages/Profile.jsx";

// 🔐 ADMIN ROUTE GUARD
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";

export default function App() {
  const adminToken = localStorage.getItem("adminToken");

  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* AUTH */}
        <Route
          path="/admin/login"
          element={
            adminToken
              ? <Navigate to="/admin/dashboard" replace />
              : <Login />
          }
        />

        <Route
          path="/admin/signup"
          element={
            adminToken
              ? <Navigate to="/admin/dashboard" replace />
              : <Signup />
          }
        />

        {/* 🔐 PROTECTED ADMIN AREA */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classes" element={<Classes />} />
          <Route path="classes/:id" element={<WorkClass />} />
          <Route path="create-exam" element={<CreateExam />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="evaluate" element={<Evaluations />} />
          <Route path="evaluate/review" element={<ReviewExam />} />
          <Route path="students" element={<Students />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
