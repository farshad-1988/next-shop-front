import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, Product } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readData();
    const product = data.products.find((p) => p.id === parseInt(id));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
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
    const body: Product = await request.json();
    const data = await readData();

    const index = data.products.findIndex((p) => p.id === parseInt(id));
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct: Product = {
      ...body,
      id: parseInt(id),
      updatedAt: new Date().toISOString(),
    };

    data.products[index] = updatedProduct;
    writeData(data);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readData();

    const index = data.products.findIndex((p) => p.id === parseInt(id));
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    data.products.splice(index, 1);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
