import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="w-full h-screen bg-[#0D1117] text-[#E6EDF3] overflow-hidden flex">
      
      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN AREA */}
      <div
        className="flex flex-col flex-1 h-full transition-all duration-300"
        style={{ marginLeft: collapsed ? 76 : 248 }}
      >
        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#0D1117]">
          <div className="px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
