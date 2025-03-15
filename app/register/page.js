"use client";
import RegistrationForm from "@/app/components/RegistrationForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterPage() {
  const { loggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loggedIn) {
      router.push("/admin/dashboard"); // Redirect logged-in users
    }
  }, [loggedIn, router]);

  return (
    <div>
      <h1>Register</h1>
      <RegistrationForm />
    </div>
  );
}
