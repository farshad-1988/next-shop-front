export type Item = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  image: string;
};

export type CartItem = Item & { count: number };
export type productItem = Item & { stock: number };
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
  products: productItem[];
  filteredProducts: productItem[];
  setProducts: (products: productItem[]) => void;
  setFilteredProducts: (products: productItem[]) => void;
  increaseProductsItem: (item: productItem) => void;
  decreaseProductsItem: (item: productItem) => void;
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
  orders: CartItems[];
  role: UserRole;
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
