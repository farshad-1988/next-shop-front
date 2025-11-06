import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, User } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readData();
    const user = data.users.find((u) => u.id == id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't return password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<User> = await request.json();
    const data = await readData();

    const index = data.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser: User = {
      ...data.users[index],
      ...body,
      id, // Ensure ID doesn't change
    };

    data.users[index] = updatedUser;
    writeData(data);

    // Don't return password
    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<User> = await request.json();
    const data = await readData();

    const index = data.users.findIndex((u) => u.id == id);
    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(body, index);
    // Merge with existing user data
    const updatedUser: User = {
      ...data.users[index],
      ...body,
      id, // Ensure ID doesn't change
    };

    data.users[index] = updatedUser;
    writeData(data);

    // Don't return password
    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
