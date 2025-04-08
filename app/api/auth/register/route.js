import db from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Body received:", body);

    const { fullname, contact_no, std, school_name, email, password } = body;

    if (!fullname || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Check if the user already exists
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length > 0) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database with default role "user"
    await db.execute(
      "INSERT INTO users (fullname, contact_no, std, school_name, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [fullname, contact_no, std, school_name, email, hashedPassword, "user"]
    );

    return new Response(JSON.stringify({ message: "Registration successful" }), { status: 201 });
  } catch (error) {
    console.error("🚨 Error during registration:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
