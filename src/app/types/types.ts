import { PurchasedItem } from "@/lib/data";

export type Item = {
  id: number;
  name: string;
  category?: string | { id: string; label: string };
  price: number;
  stock: number;
  rating?: number | undefined;
  description: string;
  image?: string | undefined;
};

export type CartItem = Item & { count: number };
export type CartItems = CartItem[];

export type OrdersItemStore = {
  // loading: boolean;
  // error: string | null;
  orders: CartItems;
  setOrders: (orders: CartItems) => void;
  increaseOrderedItem: (item: Item) => void;
  decreaseOrderedItem: (item: Item) => void;
};
export type ProductsItemStore = {
  // loading: boolean;
  // error: string | null;
  products: Item[];
  filteredProducts: Item[];
  setProducts: (products: Item[]) => void;
  setFilteredProducts: (products: Item[]) => void;
  increaseProductsItem: (item: Item) => void;
  decreaseProductsItem: (item: Item) => void;
};
export type UserItemStore = {
  // loading: boolean;
  // error: string | null;
  user: User | null;
  setUser: (user: User) => void;
};

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  orders: CartItems[] | [];
  role: UserRole;
  purchasedItems: PurchasedItem[] | [];
}

export interface AuthFormData {
  name: string;
  email: string;
  password: string;
}

export interface AuthRequest {
  action: "signin" | "signup";
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export enum SnackbarSeverityEnum {
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning",
}
