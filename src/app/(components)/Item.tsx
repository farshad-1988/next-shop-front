import { Box, Card, Typography, IconButton, alpha } from "@mui/material";
import React, { JSX } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import AddProductComp from "./AddRemoveOrder";
import { Item, UserRole } from "../types/types";
import ImageComp from "../(customMuiComp)/ImageComp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ItemComp = ({ item }: { item: Item }): JSX.Element => {
  const { data: session } = useSession();
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
      alert("Item removed successfully");
      window.location.reload();
    } else {
      alert("Error removing item");
    }
  };

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
              onClick={() => removeItem(item.id)}
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
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <ImageComp item={item} />
        <Typography variant={"h6"}>{item.name}</Typography>
        <Typography>{item.description}</Typography>
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
