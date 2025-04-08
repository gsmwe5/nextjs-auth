import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Install with: npm install jose

// ✅ Function to verify and decode JWT
async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Ensure JWT_SECRET is set
    const { payload } = await jwtVerify(token, secret);
    return payload; // Decoded user info
  } catch (error) {
    return null; // Invalid token
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const authToken = req.cookies.get("authToken")?.value;

  if (authToken) {
    const user = await verifyToken(authToken); // ✅ Decode token to get user role

    // 🚀 Redirect users from /login if already logged in
    if (pathname === "/login") {
      return NextResponse.redirect(new URL(user?.role === "admin" ? "/admin/dashboard" : "/users/dashboard", req.url));
    }

    // 🚀 Prevent non-admin users from accessing /admin routes
    if (pathname.startsWith("/admin") && user?.role !== "admin") {
      return NextResponse.redirect(new URL("/users/dashboard", req.url));
    }
  } else {
    // 🚀 Redirect guests trying to access protected routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/users/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next(); // ✅ Allow request to proceed
}

// ✅ Apply middleware to specific routes only
export const config = {
  matcher: ["/login", "/admin/:path*", "/users/dashboard"], // Protect these routes
};
