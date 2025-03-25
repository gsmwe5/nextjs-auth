"use client";
import LoginForm from "@/app/components/LoginForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const { loggedIn } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (loggedIn) {
      router.replace("/admin/dashboard"); // ✅ Prevents history stacking (better for auth redirects)
    } else {
      setCheckingAuth(false);
    }
  }, [loggedIn, router]);

  if (checkingAuth || loggedIn) return null; // ✅ Prevent rendering during redirect

  return (
    <div>
      <LoginForm />
    </div>
  );
}
