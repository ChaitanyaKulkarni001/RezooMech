import React, { useEffect, useState } from "react";
import api from "../../api";
import { FaEdit, FaStar, FaCommentAlt, FaUserCog, FaChartBar, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const res = await api.get("api/is_staff/");
        setIsAdmin(res.data.is_staff);
        if (!res.data.is_staff) {
          alert("You are not an admin. If this is a mistake, please contact the admin.");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching admin status:", error);
        alert("Failed to verify admin status.");
        navigate("/dashboard");
      }
    };

    fetchAdminStatus();
  }, [navigate]);

  if (isAdmin === null) {
    return <div className="text-center text-xl mt-10 text-gray-700">Loading...</div>;
  }
  if (!isAdmin) return null;

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 
        1) The animated background style is defined inline with style jsx.
        2) .animated-bg is absolutely positioned behind all content. 
      */}
      <style jsx>{`
        @keyframes smoothGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animated-bg {
          background: linear-gradient(
            300deg,
            #a3c0ff 10%,
            #8a2be2,
            #00ffff,
            #ffc0cb
          );
          background-size: 200% 200%;
          animation: smoothGradient 10s ease infinite;
        }
      `}</style>

      {/* The animated gradient fills the entire screen */}
      <div className="animated-bg absolute inset-0 -z-10" />

      {/* Optional overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/30 -z-[5]" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <motion.header
          className="w-full py-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-md">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-100 drop-shadow-sm">
            Manage quizzes, users, reviews, and system settings.
          </p>
        </motion.header>

        {/* Dashboard Grid */}
        <div className="container mx-auto px-6 py-10">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <DashboardCard icon={<FaEdit />} title="Update Quiz" onClick={() => navigate("quiz/")} />
            <DashboardCard icon={<FaStar />} title="See Reviews" onClick={() => navigate("adminrating/")} />
            <DashboardCard icon={<FaCommentAlt />} title="See Complaints" />
            <DashboardCard icon={<FaUserCog />} title="Manage Users" />
            <DashboardCard icon={<FaChartBar />} title="View Reports" />
            <DashboardCard icon={<FaTools />} title="System Settings" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="bg-white bg-opacity-90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer p-6 flex flex-col items-center justify-center text-gray-800"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon && <div className="text-indigo-700 text-6xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
    </motion.div>
  );
};

export default AdminDashboard;
