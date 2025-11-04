import { Grid } from "@mui/material";
import React from "react";
import EditItemComp from "./EditItemComp";
import { useQuery } from "@tanstack/react-query";
import { useProductsItem } from "@/app/(store)/useProductsStore";

const EditProducts = () => {
  const { setProducts, products, setFilteredProducts } = useProductsItem();

  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
      return data;
    },
  });
  return (
    <Grid container>
      {products?.map((item) => (
        <EditItemComp key={item.id} item={item} />
      ))}
    </Grid>
  );
};

export default EditProducts;
