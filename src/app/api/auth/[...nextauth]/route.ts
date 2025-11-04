import { User, UserRole } from "@/app/types/types";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { readData } from "@/lib/data";

interface DbUser extends User {
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Fetch user by email from data file
        const data = readData();
        const users = data.users.filter(
          (u) => u.email === credentials.email
        );
        const user = users[0] as DbUser | undefined;

        // Validate user
        if (!user || user.password !== credentials.password) {
          console.log("Invalid email or password");
          return null;
        }

        // Remove password before returning
        const { password, ...userInfo } = user;
        return userInfo; // { id, name, email,role }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, attach user.id to the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Make id available in the session object
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

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
