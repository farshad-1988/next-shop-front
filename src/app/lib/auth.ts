import { User, UserRole } from "@/app/types/types";
import { NextAuthOptions } from "next-auth";
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
        const data = await readData();
        const users = data.users.filter((u) => u.email === credentials.email);

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
