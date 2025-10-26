"use client";

import { Button, Grid } from "@mui/material";
import { useOrdersItem } from "../(store)/useOrdersStores";
import ItemComp from "../(components)/ItemComp";
import { useSession } from "next-auth/react";
import DraggableButton from "../(components)/DragableButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../(components)/Loading";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  category?: string | { id: string; label: string };
  price: number;
  stock: number;
  rating?: number;
  description: string;
  image?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OrderItem extends Product {
  count: number;
}

interface PurchasedItem extends Product {
  count: number;
  purchasedAt: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  createdAt?: string;
  orders?: OrderItem[];
  purchasedItems?: PurchasedItem[];
}

interface SoldProduct {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  totalAmount: number;
  soldAt: string;
  userId: number;
  userName: string;
}

interface CompletePurchaseResponse {
  user: User;
  soldProducts: SoldProduct[];
}

const API_BASE_URL = "http://localhost:5000/api";
export default function CartPage() {
  const router = useRouter();
  const { setOrders } = useOrdersItem();
  const { data: session, status } = useSession();

  const { orders } = useOrdersItem();
  async function completePurchase(
    userId: number
  ): Promise<CompletePurchaseResponse> {
    // Step 1: Get the user data
    const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!userResponse.ok) {
      throw new Error("Failed to fetch user");
    }
    const user: User = await userResponse.json();

    if (!user.orders || user.orders.length === 0) {
      throw new Error("No orders to complete");
    }

    // Step 2: Get existing sold products (if any)
    const soldProductsResponse = await fetch(`${API_BASE_URL}/soldProducts`);
    const existingSoldProducts: SoldProduct[] = soldProductsResponse.ok
      ? await soldProductsResponse.json()
      : [];

    // Step 3: Prepare data
    const purchaseDate = new Date().toISOString();
    const purchasedItems: PurchasedItem[] = user.purchasedItems || [];
    const newSoldProducts: SoldProduct[] = [];

    // Get the next ID for sold products
    let nextSoldProductId =
      existingSoldProducts.length > 0
        ? Math.max(...existingSoldProducts.map((p) => p.id)) + 1
        : 1;

    // Move orders to purchasedItems and create sold products
    user.orders.forEach((order: OrderItem) => {
      // Add to purchasedItems
      purchasedItems.push({
        ...order,
        purchasedAt: purchaseDate,
      });

      // Create sold product record
      newSoldProducts.push({
        id: nextSoldProductId++,
        productId: order.id,
        productName: order.name,
        quantity: order.count,
        totalAmount: order.price * order.count,
        soldAt: purchaseDate,
        userId: user.id,
        userName: user.name,
      });
    });

    // Step 4: Update user (remove orders, add purchasedItems)
    const updatedUser: User = {
      ...user,
      orders: [],
      purchasedItems: purchasedItems,
    };

    const updateUserResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (!updateUserResponse.ok) {
      throw new Error("Failed to update user");
    }

    // Step 5: Add sold products
    await Promise.all(
      newSoldProducts.map((soldProduct) =>
        fetch(`${API_BASE_URL}/soldProducts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(soldProduct),
        })
      )
    );

    return {
      user: updatedUser,
      soldProducts: newSoldProducts,
    };
  }

  // Custom hook
  function useCompletePurchase() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (userId: number) => completePurchase(userId),
      onSuccess: (data) => {
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ["user", data.user.id] });
        queryClient.invalidateQueries({ queryKey: ["users"] });

        // Invalidate sold products data
        queryClient.invalidateQueries({ queryKey: ["soldProducts"] });

        setOrders([]);
        router.push("/");
      },
      onError: (error) => {
        console.error("Purchase completion failed:", error);
      },
    });
  }
  const onPurchace = useCompletePurchase();
  if (status === "loading") {
    return <Loading />;
  }
  if (!session) {
    throw new Error("you mumst login first");
  }
  return (
    <>
      <Grid container sx={{ minHeight: "100vh", position: "relative" }}>
        {orders?.map((item) => (
          <ItemComp key={item.id} item={item} />
        ))}
        <DraggableButton
          btnName="purchase"
          func={() =>
            onPurchace.mutate(+session?.user.id, {
              onSuccess: (data) => {
                console.log("Purchase completed!", data);
                alert(
                  `Successfully purchased ${data.soldProducts.length} items!`
                );
              },
              onError: (error) => {
                console.error("Error:", error);
                alert("Failed to complete purchase");
              },
            })
          }
        />
      </Grid>
    </>
  );
}
