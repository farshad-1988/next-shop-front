import { useOrdersItem } from "@/app/(store)/useOrdersStores";
import { OrderItem } from "./data";
import { CartItems, User } from "@/app/types/types";

async function syncOrders({
  localOrders,
  dbOrders,
  user,
}: {
  dbOrders: CartItems;
  localOrders: CartItems;
  user: User;
}) {
  // merge logic
  const merged = [...dbOrders];

  localOrders.forEach((local) => {
    const existing = merged.find((p) => p.id === local.id);
    if (existing) {
      existing.count += local.count;
    } else {
      merged.push(local);
    }
  });

  // update store (and persist again)

  const res = await fetch(`/api/users/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...user, orders: merged }),
  });
  const data = await res.json();
  return merged;
}

export default syncOrders;
