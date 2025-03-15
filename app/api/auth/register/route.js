import db from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json(); // ✅ Read request body
    console.log("Body received:", body); // ✅ Log received data

    const { email, password } = body; // ✅ Extract values properly

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Check if the user already exists
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length > 0) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.execute("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

    return new Response(JSON.stringify({ message: "Registration successful" }), { status: 201 });
  } catch (error) {
    console.error("🚨 Error during registration:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
