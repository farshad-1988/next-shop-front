import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, User } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const data = readData();
    let users = data.users;

    // Filter by email if provided
    if (email) {
      users = users.filter((u) => u.email === email);
    }

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<User, "id"> = await request.json();
    const data = readData();

    // Generate a unique ID for the user
    const userIds = data.users.map((u) => parseInt(u.id)).filter((id) => !isNaN(id));
    const nextId = userIds.length > 0 ? Math.max(...userIds) + 1 : 1;

    const newUser: User = {
      id: nextId.toString(),
      ...body,
      createdAt: body.createdAt || new Date().toISOString(),
      orders: body.orders || [],
      purchasedItems: body.purchasedItems || [],
    };

    data.users.push(newUser);
    writeData(data);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
