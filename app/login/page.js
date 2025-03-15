"use client";
import LoginForm from "@/app/components/LoginForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const { loggedIn } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true); // ✅ Prevent initial render

  useEffect(() => {
    if (loggedIn) {
      router.push("/admin/dashboard"); // Redirect immediately
    } else {
      setCheckingAuth(false); // ✅ Allow rendering login form only if not logged in
    }
  }, [loggedIn, router]);

  if (checkingAuth || loggedIn) return null; // ✅ Prevent rendering during redirect

  return (
    <div>
      <LoginForm />
    </div>
  );
}
