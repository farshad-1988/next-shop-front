import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data.json");

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem extends Product {
  count: number;
}

export interface PurchasedItem extends Product {
  count: number;
  purchasedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt?: string;
  orders: OrderItem[] | [];
  purchasedItems?: PurchasedItem[] | [];
  role: "admin" | "customer";
}

export interface SoldProduct {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  totalAmount: number;
  soldAt: string;
  userId: string;
  userName: string;
}

export interface DataStore {
  products: Product[];
  users: User[];
  soldProducts: SoldProduct[];
}

export function readData(): DataStore {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    // If file doesn't exist or is invalid, return default structure
    return {
      products: [],
      users: [],
      soldProducts: [],
    };
  }
}

export function writeData(data: DataStore): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export function getNextId(items: { id: number }[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
}
