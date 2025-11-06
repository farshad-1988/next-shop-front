import NextAuth from "next-auth";

import { authOptions } from "@/app/lib/auth";

const handler = NextAuth(authOptions);
// if you get GET or Post request run handler
export { handler as GET, handler as POST };

//hash password,add some property for user, use daysjs,work on ui, modify order to set on users info
// if (action === "signin") {
//   // Find user by email and password
//   const res = await fetch(
//     `${JSON_SERVER_URL}/users?email=${email}&password=${password}`
//   );
//   const users: DbUser[] = await res.json();
//   if (users.length === 0) {
//     return NextResponse.json<AuthResponse>(
//       { success: false, error: "Invalid credentials" },
//       { status: 401 }
//     );
//   }

//   const user = users[0];
//   return NextResponse.json<AuthResponse>({
//     success: true,
//     user: {
//       id: user.id,
//       email: user.email,
//       name: user.name,
//       orders: user.orders,
//     },
//   });
// }
