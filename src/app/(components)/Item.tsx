import { Box, Card, Typography } from "@mui/material";
import React, { JSX } from "react";

import AddProductComp from "./AddRemoveOrder";
import { Item } from "../types/types";
import ImageComp from "../(customMuiComp)/ImageComp";

const ItemComp = ({ item }: { item: Item }): JSX.Element => {
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
          <AddProductComp item={item} />
          <Typography variant={"h6"}>${item.price.toFixed(2)}</Typography>
        </Card>
      </Card>
    </Box>
  );
};

export default ItemComp;
