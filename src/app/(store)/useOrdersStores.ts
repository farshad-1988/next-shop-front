import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItems, OrdersItemStore } from "../types/types";

let writeQueue = Promise.resolve();

async function saveOrdersToDB(orders: CartItems) {
  // Replace with your real endpoint or JSONBin URL
  await fetch("/api/saveOrders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orders),
  });
}

export const useOrdersItem = create<OrdersItemStore>()(
  persist(
    (set, get) => ({
      orders: [],

      setOrders: (orders) => {
        set({ orders });

        // Queue each save sequentially
        writeQueue = writeQueue
          .then(async () => {
            await saveOrdersToDB(orders);
          })
          .catch(() => {
            // ignore individual errors, queue continues
          });

        return writeQueue;
      },

      increaseOrderedItem: (item) =>
        set((state) => {
          const id = item.id;
          const existing = state.orders.find((ord) => ord.id === id);
          let updated;

          if (!existing) {
            updated = [...state.orders, { ...item, count: 1 }];
          } else {
            updated = state.orders.map((ord) =>
              ord.id === id ? { ...ord, count: ord.count + 1 } : ord
            );
          }

          // Update store immediately
          set({ orders: updated });

          // Queue the write
          writeQueue = writeQueue
            .then(async () => {
              await saveOrdersToDB(updated);
            })
            .catch(() => {});

          return { orders: updated };
        }),

      decreaseOrderedItem: (item) =>
        set((state) => {
          const id = item.id;
          const existing = state.orders.find((ord) => ord.id === id);
          if (!existing) return state;

          let updated;
          if (existing.count <= 1) {
            updated = state.orders.filter((ord) => ord.id !== id);
          } else {
            updated = state.orders.map((ord) =>
              ord.id === id ? { ...ord, count: ord.count - 1 } : ord
            );
          }

          set({ orders: updated });

          // Queue the write
          writeQueue = writeQueue
            .then(async () => {
              await saveOrdersToDB(updated);
            })
            .catch(() => {});

          return { orders: updated };
        }),
    }),
    {
      name: "orders-storage",
    }
  )
);
