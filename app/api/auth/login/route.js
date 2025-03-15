import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json(); // ✅ Read request body
    console.log("Body received:", body); // ✅ Log received data

    const { email, password } = body; // ✅ Extract values properly

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 });
    }

    // Fetch user from the database
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const user = rows[0];

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store the token in a secure cookie
    cookies().set("authToken", token, {
      httpOnly: false,
      secure: false,
      path: "/",
      maxAge: 3600, // 1 hour
      sameSite: "Strict",
    });

    return new Response(JSON.stringify({ message: "Login successful", token }), { status: 200 });
  } catch (error) {
    console.error("🚨 Login error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
