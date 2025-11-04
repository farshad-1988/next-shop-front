import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, getNextId, SoldProduct } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const data = readData();
    return NextResponse.json(data.soldProducts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sold products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<SoldProduct, "id"> = await request.json();
    const data = readData();

    const newSoldProduct: SoldProduct = {
      id: getNextId(data.soldProducts),
      ...body,
    };

    data.soldProducts.push(newSoldProduct);
    writeData(data);

    return NextResponse.json(newSoldProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create sold product" },
      { status: 500 }
    );
  }
}
