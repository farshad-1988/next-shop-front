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

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export type CartItems = CartItem[];

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  orders: CartItems[];
  role: UserRole;
}
