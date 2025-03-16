"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function PublicNavbar() {
  const { loggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className={`p-4 flex justify-between items-center ${theme === "light" ? "bg-gray-200 text-black" : "bg-gray-900 text-white"
        }`}
    >
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        {loggedIn && <Link href="/admin/dashboard">Dashboard</Link>}
        {loggedIn && <button onClick={logout}>Logout</button>}
        <div>
          {!loggedIn && <Link href="/login">Login</Link>}
          {!loggedIn && <Link href="/register">Register</Link>}
        </div>
      </div>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition"
      >
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </nav>

  );
}
