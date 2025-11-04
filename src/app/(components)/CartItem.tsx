import { Box, Card, Typography, IconButton, alpha } from "@mui/material";
import React, { JSX } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProductComp from "./AddRemoveOrder";
import { CartItem, Item } from "../types/types";
import ImageComp from "../(customMuiComp)/ImageComp";
import { useOrdersItem } from "../(store)/useOrdersStores";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const CartItemComp = ({ item }: { item: CartItem }): JSX.Element => {
  const { data: session, status } = useSession();
  const { orders, setOrders } = useOrdersItem();
  const removeProdut = useMutation({
    mutationFn: async (item: Item) => {
      const id = item.id;
      const uid = session?.user.id;

      const updatedOrders = orders.filter((ord) => ord.id !== id);

      const res = await fetch(`/api/users/${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orders: updatedOrders }),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      setOrders(orders.filter((order) => order.id !== item.id)); // update UI store (like Zustand or context)
    },
    onError: (error) => {
      console.error("Error decreasing product count:", error);
    },
  });

  const removeFromCart = () => {
    if (confirm(`Remove ${item.name} from cart?`)) {
      removeProdut.mutate(item);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        position: "relative",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Product Image */}
      <Box
        sx={{
          width: 120,
          height: 120,
          flexShrink: 0,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#f5f5f5",
        }}
      >
        <ImageComp item={item} />
      </Box>

      {/* Product Details */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {item.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {item.description}
            </Typography>
          </Box>

          <IconButton
            onClick={removeFromCart}
            size="small"
            sx={{
              color: "error.main",
              "&:hover": {
                backgroundColor: alpha("#d32f2f", 0.1),
              },
            }}
            aria-label="remove from cart"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Price and Quantity Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
          }}
        >
          <AddProductComp item={item} />

          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              ${(+item.price).toFixed(2)} each
            </Typography>
            <Typography variant="h6" fontWeight={600} color="primary.main">
              ${(+item.price * item.count).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default CartItemComp;
