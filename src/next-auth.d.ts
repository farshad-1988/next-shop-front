import NextAuth from "next-auth";
import { UserRole } from "./app/types/types";
//declare module = extend or patch the types of a library.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }
}
