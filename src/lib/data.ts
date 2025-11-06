// lib/db.ts
const BIN_ID = process.env.JSONBIN_ID || "binId";
const API_KEY = process.env.JSONBIN_API_KEY || "apiKey";
const MASTER_API_KEY = process.env.JSONBIN_MASTER_KEY || "masterKey";

// encode apikey to save in env file and decode it to recover orinal one to use here
const jsonbinApiKey = Buffer.from(MASTER_API_KEY, "base64").toString("utf-8");
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

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

/**
 * Read data from JSONBin
 */
export async function readData(): Promise<DataStore> {
  try {
    if (!MASTER_API_KEY) {
      throw new Error("Master API key is not set");
    }
    console.log(jsonbinApiKey);
    const res = await fetch(`${BASE_URL}/latest`, {
      method: "GET",
      headers: {
        "X-Master-Key": jsonbinApiKey,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Response error:", errorText);
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return json.record as DataStore;
  } catch (error) {
    console.error("readData error:", error);
    return {
      products: [],
      users: [],
      soldProducts: [],
    };
  }
}

/**
 * Write data to JSONBin
 */
export async function writeData(data: DataStore): Promise<void> {
  try {
    if (!MASTER_API_KEY) {
      throw new Error("Master API key is not set");
    }

    const res = await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": jsonbinApiKey,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Response error:", errorText);
      throw new Error(`Failed to write data: ${res.status} ${res.statusText}`);
    }
  } catch (error) {
    console.error("writeData error:", error);
    throw error; // Re-throw to handle upstream
  }
}

/**
 * Utility for auto-increment ID
 */
export function getNextId(items: { id: number }[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
}
