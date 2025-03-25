"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";

export default function PublicNavbar() {
  const { loggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  console.log(pathname);
  return (
    <nav
      className={`p-4 flex justify-between items-center ${theme === "light" ? "bg-gray-200 text-black" : "bg-gray-900 text-white"
        }`}
    >
      {/* Left Side - Navigation Links */}
      <div className="space-x-4">
        <NavLink href="/" pathname={pathname}>Home</NavLink>
        {loggedIn && <NavLink href="/admin/quiz" pathname={pathname}>Quiz</NavLink>}
        <NavLink href="/about" pathname={pathname}>About</NavLink>
        <NavLink href="/contact" pathname={pathname}>Contact</NavLink>
        {loggedIn && <NavLink href="/admin/dashboard" pathname={pathname}>Dashboard</NavLink>}
      </div>

      {/* Right Side - Auth Links & Theme Toggle */}
      <div className="flex items-center space-x-4">
        {!loggedIn ? (
          <>
            <NavLink href="/login" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition">
              Login
            </NavLink>
            <NavLink href="/register" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
              Register
            </NavLink>
          </>
        ) : (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-700 transition"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>


  );
}
