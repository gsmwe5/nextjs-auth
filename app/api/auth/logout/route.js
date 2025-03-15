import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("authToken");
  return new Response(JSON.stringify({ message: "Logout successful" }), { status: 200 });
}
