import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, getNextId, SoldProduct } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const data = await readData();
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
    const body = (await request.json()) as SoldProduct[];
    const data = await readData();
    const newSoldProducts: SoldProduct[] = [...data.soldProducts];

    body.forEach((prod) => {
      const existedInSold = newSoldProducts.find((sp) => sp.id === prod.id);
      if (existedInSold) {
        existedInSold.quantity += prod.quantity;
      } else {
        newSoldProducts.push(prod);
      }
    });
    data.soldProducts = newSoldProducts;
    writeData(data);

    return NextResponse.json(newSoldProducts, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
