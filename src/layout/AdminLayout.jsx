import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import PageContainer from "../theme/PageContainer.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex w-full h-screen overflow-hidden transition-all duration-300 ${
        darkMode ? "dark bg-[#0F172A] text-white" : "bg-[#F7F9FC] text-gray-900"
      }`}
    >

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className="flex flex-col w-full transition-all duration-300"
        style={{ marginLeft: collapsed ? "80px" : "256px" }}
      >
        {/* Navbar */}
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <PageContainer>
            <div className="p-8">
              <Outlet /> {/* <-- This replaces children and loads each page */}
            </div>
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
