"use client";

import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Divider,
  alpha,
} from "@mui/material";
import { useOrdersItem } from "../(store)/useOrdersStores";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../(components)/Loading";
import { useRouter } from "next/navigation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CartItemComp from "../(components)/CartItem";

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

// Represents one complete purchase group
interface PurchasedItems {
  purchaseId: string; // keep it string, not number
  purchasedAt: string;
  items: OrderItem[];
}

interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  createdAt?: string;
  orders?: OrderItem[];
  purchasedItems?: PurchasedItems[]; // must be array
}

interface SoldProduct {
  id: number;
  productName: string;
  quantity: number;
  totalAmount: number;
  soldAt: string;
  userId: string;
  userName: string;
  purchaseId: string;
}

interface CompletePurchaseResponse {
  user: User;
  soldProducts: SoldProduct[];
  purchaseId: string;
}

const API_BASE_URL = "/api";

export default function CartPage() {
  const router = useRouter();
  const { setOrders } = useOrdersItem();
  const { data: session, status } = useSession();
  const { orders } = useOrdersItem();

  async function completePurchase(
    userId: string
  ): Promise<CompletePurchaseResponse> {
    const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!userResponse.ok) throw new Error("Failed to fetch user");

    const user: User = await userResponse.json();
    if (!user.orders || user.orders.length === 0)
      throw new Error("No orders to complete");

    const purchaseDate = new Date().toISOString();
    const purchaseId = `purchase_${Date.now()}`;

    const newSoldProducts: SoldProduct[] = [];

    const thisPurchaseItems = user.orders.map((order: OrderItem) => {
      newSoldProducts.push({
        id: order.id,
        productName: order.name,
        quantity: order.count,
        totalAmount: order.price * order.count,
        soldAt: purchaseDate,
        userId: String(user.id),
        userName: user.name,
        purchaseId,
      });

      return order;
    });

    // Create the new purchase record
    const newPurchase: PurchasedItems = {
      purchaseId,
      purchasedAt: purchaseDate,
      items: thisPurchaseItems,
    };

    const updatedUser: User = {
      ...user,
      orders: [],
      purchasedItems: [...(user.purchasedItems || []), newPurchase],
    };

    const updateUserResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    if (!updateUserResponse.ok) throw new Error("Failed to update user");

    await fetch(`${API_BASE_URL}/soldProducts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSoldProducts),
    });

    return {
      user: updatedUser,
      soldProducts: newSoldProducts,
      purchaseId,
    };
  }

  function useCompletePurchase() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (userId: string) => completePurchase(userId),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["user", data.user.id] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["soldProducts"] });
        setOrders([]);
        router.push("/");
      },
      onError: (error) => {
        console.error("Purchase completion failed:", error);
      },
    });
  }

  const onPurchase = useCompletePurchase();

  // Calculate totals
  const subtotal = orders.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    throw new Error("You must login first");
  }

  if (orders.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: 80, color: "text.secondary" }} />
        <Typography variant="h4" color="text.secondary">
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => router.push("/")}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 4 }}>
      {onPurchase.isPending && <Loading />}
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
        {/* Left Side - Cart Items */}
        <Grid item xs={12} md={8} {...({} as any)}>
          <Card sx={{ p: 3, mb: 2 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Shopping Cart ({orders.length}{" "}
              {orders.length === 1 ? "item" : "items"})
            </Typography>
          </Card>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {orders.map((item) => (
              <CartItemComp key={item.id} item={item} />
            ))}
          </Box>
        </Grid>

        {/* Right Side - Order Summary & Payment */}
        <Grid item xs={12} md={4} {...({} as any)}>
          <Box sx={{ position: "sticky", top: 20 }}>
            {/* Order Summary */}
            <Card sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight={500}>
                    ${subtotal.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Tax (10%)</Typography>
                  <Typography fontWeight={500}>${tax.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight={500}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </Typography>
                </Box>

                {subtotal < 100 && (
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: alpha("#1976d2", 0.1),
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LocalShippingIcon
                      sx={{ fontSize: 20, color: "primary.main" }}
                    />
                    <Typography variant="body2" color="primary">
                      Add ${(100 - subtotal).toFixed(2)} for free shipping
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary.main"
                  >
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Payment Section */}
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CreditCardIcon /> Payment
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha("#4caf50", 0.1),
                    borderRadius: 2,
                    border: `2px solid ${alpha("#4caf50", 0.3)}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ color: "success.main", fontSize: 20 }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      Secure Checkout
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Your payment information is encrypted and secure
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  This is a mock payment. No actual charges will be made.
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={onPurchase.isPending}
                onClick={() =>
                  onPurchase.mutate(session?.user.id, {
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
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: 3,
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                {onPurchase.isPending ? "Processing..." : "Complete Purchase"}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", mt: 2 }}
              >
                By completing this purchase, you agree to our terms and
                conditions
              </Typography>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
