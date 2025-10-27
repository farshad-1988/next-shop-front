"use client";

import { Alert, Grid, Snackbar } from "@mui/material";
import React from "react";
import ItemComp from "./Item";
import { useProductsItem } from "../(store)/useProductsStore";
import { useQuery } from "@tanstack/react-query";
import { useOrdersItem } from "../(store)/useOrdersStores";
import Loading from "./Loading";
import Grow from "@mui/material/Grow";
import { useSession } from "next-auth/react";

const ShowItems = () => {
  const { data: session, status } = useSession();
  const { setProducts, filteredProducts, setFilteredProducts } =
    useProductsItem();

  const { setOrders } = useOrdersItem();
  const uid = session?.user?.id;

  const {
    data: products,
    isLoading: isProductsLoading,
    error: productsError,
    isError: isProductsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
      return data;
    },
  });

  const {
    isLoading: isOrdersLoading,
    data: orders,
    error: ordersError,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/users/${uid}`);
      const userData = await res.json();
      setOrders(userData.orders);
      return userData.orders;
    },
    enabled: !!uid,
  });

  // Show error for products
  if (isProductsError) {
    return (
      <Snackbar
        open={Boolean(productsError)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        slots={{ transition: Grow }}
        autoHideDuration={4000}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          {productsError?.message || "Failed to load products."}
        </Alert>
      </Snackbar>
    );
  }

  // Show error for orders (only if user is authenticated)
  if (uid && isOrdersError) {
    return (
      <Snackbar
        open={Boolean(ordersError)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        slots={{ transition: Grow }}
        autoHideDuration={4000}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          {ordersError?.message || "Failed to load orders."}
        </Alert>
      </Snackbar>
    );
  }

  // Determine loading state based on authentication
  const isLoading = uid
    ? isProductsLoading || isOrdersLoading // Wait for both if authenticated
    : isProductsLoading; // Wait for products only if not authenticated

  // Show loading spinner
  if (isLoading || status === "loading") {
    return <Loading />;
  }

  // Show items once data is ready
  return (
    <Grid container>
      {filteredProducts?.map((item) => (
        <ItemComp key={item.id} item={item} />
      ))}
    </Grid>
  );
};

export default ShowItems;
