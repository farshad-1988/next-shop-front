import { Button, Typography, CircularProgress } from "@mui/material";
import { JSX } from "react";

import { useOrdersItem } from "../(store)/useOrdersStores";
import { Item, SnackbarSeverityEnum } from "../types/types";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useUserStore } from "../(store)/useUserStore";
import { CenteredCard } from "../(customMuiComp)/CenteredCard";
import { useSnackbar } from "../(store)/useSnackbarStore";
import Link from "next/link";

/**
 *add or remove products from user's cart
 *
 * @param {Object} Item
 *
 *
 * @return {JSX.Element} - component for modify  number of item in the cart
 */
const AddProductComp = ({ item }: { item: Item }): JSX.Element => {
  const { showSnackbar } = useSnackbar();
  const { data: session, status } = useSession();
  const { orders, increaseOrderedItem, decreaseOrderedItem } = useOrdersItem();
  const { user } = useUserStore();
  const uid = session?.user.id;
  const addProduct = useMutation({
    // mutationKey: ["products"],
    mutationFn: async (item: Item) => {
      try {
        // 1. Fetch product details
        const resP = await fetch(`/api/products/${item.id}`);
        if (!resP.ok) {
          throw new Error(`Failed to fetch product details (${resP.status})`);
        }

        const productDetails = await resP.json();
        const id = item.id;
        const currentCount = orders.find((ord) => ord.id === id)?.count || 0;

        // 2. Validate stock conditions
        if (productDetails.stock <= 0) {
          throw new Error("Product is out of stock");
        }

        if (productDetails.stock <= currentCount) {
          throw new Error("No more stock available to add");
        }

        // 3. Update orders locally
        let newOrders;
        if (currentCount === 0) {
          newOrders = [...orders, { ...item, count: 1 }];
          showSnackbar(
            <>
              <div>Item added</div>
              <Link href="/cart" style={{ color: "white" }}>
                Continue to purchase
              </Link>
            </>,
            SnackbarSeverityEnum.Success
          );
        } else {
          newOrders = orders.map((ord) =>
            ord.id === id ? { ...ord, count: ord.count + 1 } : ord
          );
        }

        // 4. Send updated order list
        const res = await fetch(`/api/users/${uid}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orders: newOrders }),
        });

        if (!res.ok) {
          throw new Error(`Failed to update user orders (${res.status})`);
        }

        const data = await res.json();
        return data;
      } catch (err: any) {
        // Convert network or logical errors to something React Query understands
        throw new Error(err.message || "Unexpected error while adding product");
      }
    },

    // 5. Handle mutation lifecycle
    onSuccess: () => {
      increaseItem();
    },

    onError: (error: Error) => {
      console.error("Error adding product to cart:", error.message);

      // Optional: show a snackbar or toast for user-friendly feedback
      showSnackbar(error.message, SnackbarSeverityEnum.Error);
    },
  });

  const decreaseProduct = useMutation({
    mutationFn: async (item: Item) => {
      const id = item.id;
      const currentCount = orders.find((ord) => ord.id === id)?.count || 0;

      let updatedOrders;
      if (currentCount > 1) {
        // Decrease count
        updatedOrders = orders.map((ord) =>
          ord.id === id ? { ...item, count: currentCount - 1 } : ord
        );
      } else {
        updatedOrders = orders.filter((ord) => ord.id !== id);
      }
      const res = await fetch(`/api/users/${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, orders: updatedOrders }),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      decreaseItem(); // update UI store (like Zustand or context)
    },
    onError: (error) => {
      console.error("Error decreasing product count:", error);
    },
  });

  // const [count, setCount] = useState(
  //   orders.find((ord) => ord.id === item.id)?.count || 0
  // );
  const increaseItem = async () => {
    increaseOrderedItem(item);
    // setCount(count + 1);
  };

  const decreaseItem = () => {
    decreaseOrderedItem(item);
    // setCount(count - 1);
  };

  return (
    <div>
      {orders?.find((ord) => ord.id === item.id) ? (
        <CenteredCard sx={{ gap: "10px" }}>
          <Button
            sx={{ minWidth: "30px", padding: "0px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              decreaseProduct.mutate(item);
            }}
            disabled={decreaseProduct.isPending || addProduct.isPending}
          >
            {decreaseProduct.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "-"
            )}
          </Button>
          <Typography>
            {orders.find((ord) => ord.id === item.id)?.count}
          </Typography>
          <Button
            sx={{ minWidth: "30px", padding: "0px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              addProduct.mutate(item);
            }}
            disabled={addProduct.isPending || decreaseProduct.isPending}
          >
            {addProduct.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "+"
            )}
          </Button>
        </CenteredCard>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            addProduct.mutate(item);
          }}
          disabled={addProduct.isPending}
        >
          {addProduct.isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Add to Cart"
          )}
        </Button>
      )}
    </div>
  );
};

export default AddProductComp;
