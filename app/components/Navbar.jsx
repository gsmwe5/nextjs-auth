"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function PublicNavbar() {
  const { loggedIn, logout } = useAuth();

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      {loggedIn && <Link href="/admin/dashboard">Dashboard</Link>}
      {loggedIn && <button onClick={logout}>Logout</button>}
      <div>
        {!loggedIn && <Link href="/login">Login</Link>}
        {!loggedIn && <Link href="/register">Register</Link>}
      </div>
    </nav>
  );
}
