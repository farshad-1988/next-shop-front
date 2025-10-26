import { NextRequest, NextResponse } from "next/server";
import { AuthRequest, AuthResponse, User, UserRole } from "@/app/types/types";

const JSON_SERVER_URL =
  process.env.JSON_SERVER_URL || "http://localhost:5000/api";

interface DbUser extends User {
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AuthRequest = await request.json();
    const { action, email, password, name } = body;

    if (action !== "signup") {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }
    try {
      // Check if user already exists
      const checkRes = await fetch(`${JSON_SERVER_URL}/users?email=${email}`);
      const existingUsers: DbUser[] = await checkRes.json();

      if (existingUsers.length > 0) {
        return NextResponse.json<AuthResponse>(
          { success: false, error: "User already exists" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.log(error);
    }

    // Create new user
    const newUser: Omit<DbUser, "id"> = {
      email,
      password, // In production, hash this!
      name: name || "",
      createdAt: new Date().toISOString(),
      orders: [],
      role: UserRole.CUSTOMER,
    };
    try {
      const createRes = await fetch(`${JSON_SERVER_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const user: DbUser = await createRes.json();
      return NextResponse.json<AuthResponse>({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          orders: [],
          role: UserRole.CUSTOMER,
        },
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Server error: " + errorMessage },
      { status: 500 }
    );
  }
}
