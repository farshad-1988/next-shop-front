import ImageComp from "@/app/(customMuiComp)/ImageComp";
import { Item, UserRole } from "@/app/types/types";
import { Box, Button, Card, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

const EditItemComp = ({ item }: { item: Item }) => {
  const { data: session } = useSession();
  const editItem = (id: number) => {
    window.location.href = `/admin/handleItem/${id}`;
  };

  const removeItem = async (id: number) => {
    if (!session || session.user.role !== UserRole.ADMIN)
      throw new Error("you are not authorized");

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
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
        }}
      >
        <ImageComp item={item} />
        <Typography variant={"h6"}>{item.name}</Typography>
        <Typography>{item.description}</Typography>
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
            boxShadow: "none",
            width: "100%",
          }}
        >
          <Button onClick={() => editItem(item.id)}>edit</Button>
          <Button onClick={() => removeItem(item.id)}>remove</Button>
          <Typography variant={"h6"}>${(+item.price).toFixed(2)}</Typography>
        </Card>
      </Card>
    </Box>
  );
};

export default EditItemComp;
