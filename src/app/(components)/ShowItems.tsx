"use client";

import {
  Alert,
  Grid,
  Snackbar,
  Box,
  CircularProgress,
  Pagination,
} from "@mui/material";
import React, { useEffect, useCallback, useState } from "react";

import ItemComp from "./Item";

import { useProductsItem } from "../(store)/useProductsStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useOrdersItem } from "../(store)/useOrdersStores";
import Loading from "./Loading";
import Grow from "@mui/material/Grow";
import { useSession } from "next-auth/react";

import { useUserStore } from "../(store)/useUserStore";
import syncOrders from "@/lib/syncOrders";

const ShowItems = () => {
  const { data: session, status } = useSession();
  const {
    setProducts,
    filteredProducts,
    setFilteredProducts,
    productSearch,
    pagination,
    setPagination,
  } = useProductsItem();

  const { setUser } = useUserStore();
  const { setOrders } = useOrdersItem();
  const uid = session?.user?.id;
  const [page, setPage] = useState(5);

  const {
    //data will be {pages:Array of all fetched pages , pageParams: Array of page params used for each page}
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
    isError: isProductsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", productSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/products?_page=${pageParam}&_limit=6&_search=${productSearch}`
      );
      const { products, total } = await res.json();
      return { products, total, page: pageParam };
    },
    //getNextPageParam-->lastPage is the most recent fetch , allPages is all fetches data that ever done
    //getNextPageParam-->return pageParams for next fetch(number , string , object ,...) , if return undefined hasNextPage for next page will be false
    getNextPageParam: (lastPage, allPages) => {
      const loadedProducts = allPages.reduce(
        (acc, page) => acc + page.products.length,
        0
      );
      return loadedProducts < lastPage.total ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Derived values from loaded infinite pages
  const latestTotal = productsData?.pages?.[0]?.total ?? 0;
  const loadedProducts =
    productsData?.pages?.reduce((acc, p) => acc + p.products.length, 0) || 0;

  // Update store when products data changes (infinite mode)
  useEffect(() => {
    if (productsData?.pages) {
      const allProducts = productsData.pages.flatMap((p) => p.products);
      if (!pagination) {
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      }
    }
  }, [productsData, pagination, setProducts, setFilteredProducts]);

  // Page-based fetching when in pagination mode
  const { isLoading: isPageLoading } = useQuery({
    queryKey: ["products-page", page],
    queryFn: async () => {
      const res = await fetch(`/api/products?_page=${page}&_limit=6`);
      const { products } = await res.json();
      setProducts(products);
      setFilteredProducts(products);
      return { products };
    },
    enabled: pagination,
  });

  const {
    isLoading: isOrdersLoading,
    error: ordersError,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(`/api/users/${uid}`);
      const userData = await res.json();
      const dbOrders = userData.orders || [];
      const localOrders = useOrdersItem.getState().orders || [];

      if (JSON.stringify(dbOrders) !== JSON.stringify(localOrders)) {
        const merged = await syncOrders({
          localOrders,
          dbOrders,
          user: userData,
        });
        setOrders(merged);
        return merged;
      } else {
        setOrders(userData.orders || []);
      }
      setUser(userData || null);
      return userData.orders;
    },
    enabled: !!uid,
  });

  // Handle scroll event (infinite mode only)
  const handleScroll = useCallback(() => {
    if (pagination) return;
    // Calculate if user is near bottom of page
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // Trigger when user is 300px from bottom
    const threshold = 300;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    if (
      isNearBottom &&
      !pagination &&
      loadedProducts < 30 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    pagination,
    loadedProducts,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  // Add scroll event listener
  useEffect(() => {
    // Throttle scroll event to improve performance
    let timeoutId: NodeJS.Timeout | null = null;

    const throttledHandleScroll = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 200); // Throttle to every 200ms
    };

    window.addEventListener("scroll", throttledHandleScroll);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleScroll]);

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
    ? (pagination ? isPageLoading : isProductsLoading) || isOrdersLoading
    : pagination
    ? isPageLoading
    : isProductsLoading;

  // Show loading spinner for initial load
  if (isLoading || status === "loading") {
    return <Loading />;
  }

  // Show items once data is ready
  return (
    <>
      <Grid container marginX={3}>
        {filteredProducts?.map((item) => (
          <ItemComp key={item.id + "something"} item={item} />
        ))}
      </Grid>

      {/* Loading indicator when fetching more products (infinite mode) */}
      {!pagination && isFetchingNextPage && (
        <Box sx={{ width: "100%", py: 4, textAlign: "center" }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {/* Bottom Pagination (appears after 30 items if there are more) */}
      {!isFetchingNextPage && loadedProducts >= 30 && (
        <Box display="flex" justifyContent="center" my={3}>
          <Pagination
            color="primary"
            count={Math.max(1, Math.ceil((latestTotal || 0) / 6))}
            page={page}
            onChange={(_, value) => {
              setPagination(true);
              setPage(value);
            }}
          />
        </Box>
      )}
    </>
  );
};

export default ShowItems;
