"use client";
import Navbar from "@/app/components/Navbar";
import { AuthProvider, useAuth } from "@/app/context/AuthContext"; // ✅ Import AuthProvider
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark:bg-gray-900">
        <AuthProvider> {/* ✅ Wrap the entire app with AuthProvider */}
          <Navbar />
          <AuthGuard> {/* ✅ Wrap the children with AuthGuard */}
            {children}
          </AuthGuard>
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
    if (!loggedIn && pathname.startsWith("/admin")) {
      router.push("/login");
    }
  }, [loggedIn, router]);

  // if (!loggedIn) return null; // Prevent rendering if not logged in

  return <>{children}</>;
}
