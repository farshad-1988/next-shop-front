import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, getNextId, Product } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("_page");
    const limit = searchParams.get("_limit");

    const data = readData();
    const products = data.products;
    let sliceProducts: Product[] = [];

    // Handle pagination if provided
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      sliceProducts = products.slice(startIndex, endIndex);
    }
    return NextResponse.json({
      products: sliceProducts,
      total: products.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Product, "id"> = await request.json();
    const data = readData();

    const newProduct: Product = {
      id: getNextId(data.products),
      ...body,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: body.updatedAt || new Date().toISOString(),
    };

    data.products.push(newProduct);
    writeData(data);

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
