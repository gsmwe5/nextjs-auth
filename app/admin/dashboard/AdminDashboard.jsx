// /admin/dashboard/page.js
"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUsers, FaChartBar, FaCog, FaPlusCircle, FaQuestionCircle } from "react-icons/fa";

const AdminDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const adminLinks = [
    { title: "Manage Users", icon: <FaUsers />, path: "/admin/users" },
    { title: "Quiz Reports", icon: <FaChartBar />, path: "/admin/reports" },
    { title: "Create Quiz", icon: <FaPlusCircle />, path: "/admin/create-quiz" },
    { title: "Manage Questions", icon: <FaQuestionCircle />, path: "/admin/questions" },
    { title: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map((link, index) => (
          <a
            key={index}
            href={link.path}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition"
          >
            <div className="text-4xl text-blue-500 mb-2">{link.icon}</div>
            <p className="text-lg font-semibold">{link.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
