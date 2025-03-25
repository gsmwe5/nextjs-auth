import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const authToken = req.cookies.get("authToken"); // Example: Check for an auth token

  // Redirect logged-in users away from /login
  if (pathname === "/login" && authToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Redirect guests away from /admin routes
  if (pathname.startsWith("/admin") && !authToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Allow request to proceed
}

// ✅ Apply middleware to specific routes only
export const config = {
  matcher: ["/login", "/admin/:path*"], // Protect /login and all /admin/* routes
};
