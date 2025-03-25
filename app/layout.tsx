"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { AuthProvider, useAuth } from "@/app/context/AuthContext"; // ✅ Import AuthProvider
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider } from "@/app/context/ThemeContext";
import SplashScreen from "@/app/components/SplashScreen";
import "./globals.css";

export default function RootLayout({ children }) {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  return (
    <html lang="en">
      <body className="dark:bg-gray-900">
        {isSplashVisible ? (
          <SplashScreen onFinish={() => setIsSplashVisible(false)} />
        ) : (
          <AuthProvider>
            <ThemeProvider>
              <Navbar />
              <AuthGuard>{children}</AuthGuard>
            </ThemeProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}

// ✅ Create an AuthGuard component to check authentication
function AuthGuard({ children }) {
  const { loggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return <>{children}</>;
}
