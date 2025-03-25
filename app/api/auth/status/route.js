import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("authToken")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  return new Response(JSON.stringify({ token }), { status: 200 });
}


// import { cookies } from "next/headers";

// export async function GET() {
//   const cookieStore = await cookies(); // ✅ Awaiting not needed here but store the object first
//   const token = cookieStore.get("authToken")?.value; // ✅ Correct way to access cookies

//   if (!token) {
//     return new Response(JSON.stringify({ error: "Not authenticated" }), {
//       status: 401,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   return new Response(JSON.stringify({ message: "Authenticated" }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }
