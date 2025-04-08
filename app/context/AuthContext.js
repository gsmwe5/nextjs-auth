"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // ✅ Fetch token securely from API (instead of document.cookie)
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/status", { credentials: "include" });
      if (!response.ok) throw new Error("Not authenticated");

      const { token } = await response.json();
      if (token) {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error("🚨 Auth Check Failed:", error);
      setLoggedIn(false);
      setUser(null);
    }
  }, []);

  // ✅ Login function that fetches authToken from API
  const login = useCallback(async (email, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response.ok) {
      const { token } = await response.json();
      const decodedToken = jwtDecode(token); // ✅ Decode the token first
      const role = decodedToken.role; // ✅ Extract role immediately

      await checkAuthStatus(); // ✅ Update user state

      console.log("Redirecting user with role:", role);
      const redirectPath = role === "admin" ? "/admin/dashboard" : "/users/dashboard";

      router.replace(redirectPath); // ✅ Use `replace` instead of `push`
    } else {
      throw new Error("Login failed. Please check your credentials.");
    }
  }, [checkAuthStatus, router]);



  // ✅ Logout function that calls API to remove cookie
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setLoggedIn(false);
    setUser(null);
    router.push("/");
  }, [router]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
