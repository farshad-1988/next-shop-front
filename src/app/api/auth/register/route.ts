import { NextRequest, NextResponse } from "next/server";
import { AuthRequest, AuthResponse, UserRole } from "@/app/types/types";
import { readData, writeData, User as DbUserType } from "@/lib/data";

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

    // Check if user already exists
    const data = readData();
    const existingUsers = data.users.filter((u) => u.email === email);

    if (existingUsers.length > 0) {
      return NextResponse.json<AuthResponse>(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const userIds = data.users
      .map((u) => parseInt(u.id))
      .filter((id) => !isNaN(id));
    const nextId = userIds.length > 0 ? Math.max(...userIds) + 1 : 1;

    const newUser: DbUserType = {
      id: nextId.toString(),
      email,
      password, // In production, hash this!
      name: name || "",
      createdAt: new Date().toISOString(),
      orders: [],
      purchasedItems: [],
      role: UserRole.CUSTOMER,
    };

    data.users.push(newUser);
    writeData(data);

    return NextResponse.json<AuthResponse>({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        orders: [],
        role: UserRole.CUSTOMER,
        purchasedItems: [],
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json<AuthResponse>(
      { success: false, error: "Server error: " + errorMessage },
      { status: 500 }
    );
  }
}
