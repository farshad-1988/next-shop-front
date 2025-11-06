import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductsItemStore } from "../types/types";

export const useProductsItem = create<ProductsItemStore>()(
  persist(
    (set) => ({
      products: [],
      productSearch: "",
      pagination: false,
      setPagination: (pagination: boolean) => set({ pagination }),
      setProductSearch: (productSearch: string) => set({ productSearch }),
      setProducts: (products) => set({ products }),
      filteredProducts: [],
      setFilteredProducts: (filteredProducts) => set({ filteredProducts }),
      increaseProductsItem: (item) =>
        set((state) => {
          const id = item.id;
          const currentstock =
            state.products.find((pr) => pr.id === id)?.stock || 0;
          if (currentstock === 0) {
            return { products: [...state.products, { ...item, stock: 1 }] };
          } else {
            return {
              products: state.products.map((pr) =>
                pr.id === id ? { ...pr, stock: pr.stock + 1 } : pr
              ),
            };
          }
        }),
      decreaseProductsItem: (item) =>
        set((state) => {
          const id = item.id;
          const currentstock =
            state.products.find((pr) => pr.id === id)?.stock || 0;
          if (currentstock === 1) {
            const remainproducts = state.products.filter((pr) => pr.id !== id);
            return { products: remainproducts };
          } else {
            return {
              products: state.products.map((pr) =>
                pr.id === id ? { ...pr, stock: pr.stock - 1 } : pr
              ),
            };
          }
        }),
    }),
    {
      name: "products-storage", // key for localStorage
      partialize: (state) => ({ products: state.products }),
    }
  )
);
