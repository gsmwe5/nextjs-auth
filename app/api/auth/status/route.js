import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("authToken")?.value;
console.log(token);
  if (!token) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  return new Response(JSON.stringify({ token }), { status: 200 });
}
