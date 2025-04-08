// /users/dashboard/page.js
"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaClipboardList, FaChartBar, FaCog } from "react-icons/fa";
import withAuth from "@/app/utils/withAuth";

const UserDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  console.log(user?.role);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const userLinks = [
    { title: "Take a Quiz", icon: <FaClipboardList />, path: "/users/quiz" },
    { title: "My Quiz History", icon: <FaChartBar />, path: "/users/history" },
    { title: "Leaderboard", icon: <FaChartBar />, path: "/users/leaderboard" },
    { title: "Profile Settings", icon: <FaCog />, path: "/users/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">User Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userLinks.map((link, index) => (
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

export default withAuth(UserDashboard, 'user'); // Apply withAuth UserDashboard;


