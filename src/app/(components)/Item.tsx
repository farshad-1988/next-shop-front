import {
  Box,
  Card,
  Typography,
  IconButton,
  alpha,
  CircularProgress,
} from "@mui/material";
import React, { JSX, use } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import AddProductComp from "./AddRemoveOrder";
import { Item, SnackbarSeverityEnum, UserRole } from "../types/types";
import ImageComp from "../(customMuiComp)/ImageComp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useProductsItem } from "../(store)/useProductsStore";
import { useSnackbar } from "../(store)/useSnackbarStore";

const ItemComp = ({ item }: { item: Item }): JSX.Element => {
  const { data: session } = useSession();
  const { showSnackbar } = useSnackbar();
  const { setProducts, products, setFilteredProducts } = useProductsItem();
  const router = useRouter();
  const userRole = session?.user.role;

  const editItem = (id: number) => {
    router.push(`/admin/handleItem/${id}`);
  };

  const removeItem = async (id: number) => {
    if (!session || session.user.role !== UserRole.ADMIN) {
      throw new Error("you are not authorized");
    }

    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      showSnackbar("Item removed successfully", SnackbarSeverityEnum.Success);
      return id;
    } else {
      alert("Error removing item");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: removeItem,
    onSuccess: () => {
      setProducts(products.filter((prod) => prod.id !== item.id));
      setFilteredProducts(products.filter((prod) => prod.id !== item.id));
    },
    onError: (error) => {
      alert("Error removing item");
      console.error(error);
    },
  });

  return (
    <Box key={item.id} sx={{ width: 400, padding: "20px" }}>
      <Card
        sx={{
          padding: "20px",
          gap: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {userRole === "admin" && (
          <Box
            sx={{
              opacity: isPending ? 0.6 : 1,
              pointerEvents: isPending ? "none" : "auto",
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              gap: 0.5,
              zIndex: 10,
              backgroundColor: alpha("#fff", 0.95),
              borderRadius: 2,
              padding: 0.25,
              boxShadow: 3,
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha("#000", 0.1)}`,
              "&:hover": {
                boxShadow: 6,
                backgroundColor: alpha("#fff", 1),
              },
            }}
          >
            <IconButton
              disabled={isPending}
              onClick={() => editItem(item.id)}
              size="small"
              color="primary"
              sx={{
                "&:hover": {
                  backgroundColor: alpha("#1976d2", 0.15),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
              aria-label="edit item"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              disabled={isPending}
              onClick={() => mutate(item.id)}
              size="small"
              color="error"
              sx={{
                "&:hover": {
                  backgroundColor: alpha("#d32f2f", 0.15),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
              aria-label="delete item"
            >
              {isPending ? (
                <CircularProgress size={20} color="error" />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        )}

        <ImageComp item={item} />
        <Typography variant={"h6"}>{item.name}</Typography>
        <Typography
          sx={{
            width: "100%",
            minHeight: "3em", // Takes space for 2 lines (assuming ~1.5 line height)
            lineHeight: 1.5,
          }}
        >
          {item.description}
        </Typography>
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
            boxShadow: "none",
            width: "100%",
            alignItems: "center",
          }}
        >
          {userRole !== "admin" && <AddProductComp item={item} />}
          <Typography variant={"h6"}>${(+item.price).toFixed(2)}</Typography>
        </Card>
      </Card>
    </Box>
  );
};

export default ItemComp;
