import { Button, Typography } from "@mui/material";
import { JSX } from "react";
import { CenteredCard } from "./CustomMuiComp";
import { useOrdersItem } from "../(store)/useOrdersStores";
import { Item } from "../types/types";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useUserStore } from "../(store)/useUserStore";

/**
 *add or remove products from user's cart
 *
 * @param {Object} Item
 *
 *
 * @return {JSX.Element} - component for modify  number of item in the cart
 */
const AddProductComp = ({ item }: { item: Item }): JSX.Element => {
  const { data: session, status } = useSession();
  const { orders, increaseOrderedItem, decreaseOrderedItem } = useOrdersItem();
  const { user } = useUserStore();
  const uid = session?.user.id;
  const addProduct = useMutation({
    // mutationKey: ["products"],
    mutationFn: async (item: Item) => {
      const resP = await fetch("http://localhost:5000/api/products/" + item.id);
      if (!resP.ok) {
        throw new Error("Failed to fetch product details");
      }
      const productDetails = await resP.json();
      if (productDetails.stock <= 0) {
        alert("Product is out of stock");
        return;
      }

      const id = item.id;
      const currentCount = orders.find((ord) => ord.id === id)?.count || 0;
      let newOrders;
      if (currentCount === 0) {
        newOrders = [...orders, { ...item, count: 1 }];
      } else {
        newOrders = orders.map((ord) =>
          ord.id === id ? { ...ord, count: ord.count + 1 } : ord
        );
      }

      const res = await fetch(`http://localhost:5000/api/users/${uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, orders: newOrders }),
      });

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      increaseItem();
    },
    onError: (error) => {
      console.error("Error adding product to cart:", error);
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
      const res = await fetch(`http://localhost:5000/api/users/${uid}`, {
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
          >
            -
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
          >
            +
          </Button>
        </CenteredCard>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            addProduct.mutate(item);
          }}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
};

export default AddProductComp;
