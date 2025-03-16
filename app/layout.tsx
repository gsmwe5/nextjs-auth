"use client";
import Navbar from "@/app/components/Navbar";
import { AuthProvider, useAuth } from "@/app/context/AuthContext"; // ✅ Import AuthProvider
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ThemeProvider } from "@/app/context/ThemeContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark:bg-gray-900">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <AuthGuard>
              {children}
            </AuthGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// ✅ Create an AuthGuard component to check authentication
function AuthGuard({ children }) {
  const { loggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loggedIn) {
      router.push("/login");
    }
  }, [loggedIn, router]);

  // if (!loggedIn) return null;

  return <>{children}</>;
}
