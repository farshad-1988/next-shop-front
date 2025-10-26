import { create } from "zustand";
import { OrdersItemStore } from "../types/types";

export const useOrdersItem = create<OrdersItemStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  increaseOrderedItem: (item) =>
    set((state) => {
      const id = item.id;
      const currentCount =
        state.orders.find((ord) => ord.id === id)?.count || 0;
      if (currentCount === 0) {
        return { orders: [...state.orders, { ...item, count: 1 }] };
      } else {
        return {
          orders: state.orders.map((ord) =>
            ord.id === id ? { ...ord, count: ord.count + 1 } : ord
          ),
        };
      }
    }),
  decreaseOrderedItem: (item) =>
    set((state) => {
      const id = item.id;
      const currentCount =
        state.orders.find((ord) => ord.id === id)?.count || 0;
      if (currentCount === 1) {
        const remainOrders = state.orders.filter((ord) => ord.id !== id);
        return { orders: remainOrders };
      } else {
        return {
          orders: state.orders.map((ord) =>
            ord.id === id ? { ...ord, count: ord.count - 1 } : ord
          ),
        };
      }
    }),
}));
