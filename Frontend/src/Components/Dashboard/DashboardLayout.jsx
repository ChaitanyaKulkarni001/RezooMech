import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import your sidebar component
import { useContext, useState } from "react";
import { Menu } from "lucide-react"; // Import an icon for the toggle button
import { ThemeContext } from "../ThemeContext";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  const { theme } = useContext(ThemeContext);

  return (
    <div
  className={`flex h-screen overflow-hidden transition-all duration-300 ${
    theme === "dim" ? "bg-white text-black" : "bg-gray-900 text-white"
  }`}
>
  {/* Sidebar */}
  <div
    className={`fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out ${
      theme === "dim"
        ? "bg-gray-200 text-gray-800"
        : "bg-gray-800 text-white"
    } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
  >
    <Sidebar />
  </div>

  {/* Main Content */}
  <div
    className={`flex-1 transition-all duration-300 ${
      isSidebarOpen ? "ml-64" : "ml-0"
    }`}
  >
    {/* Toggle Button */}
    <button
      onClick={toggleSidebar}
      className={`fixed top-4 left-4 z-50 p-2 rounded-full shadow-md transition-colors ${
        theme === "dim" ? "bg-gray-300 text-black" : "bg-gray-800 text-white"
      }`}
    >
      <Menu size={24} />
    </button>

    {/* Content Area */}
    <div className="h-full overflow-auto p-8">
      <Outlet /> {/* Your main content renders here */}
    </div>
  </div>
</div>

  );
};

export default DashboardLayout;