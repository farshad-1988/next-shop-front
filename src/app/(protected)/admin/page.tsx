"use client";

import EditProducts from "./(components)/EditProducts";
import { useSession } from "next-auth/react";
import Loading from "@/app/(components)/Loading";
import { UserRole } from "@/app/types/types";
const ShowItems = () => {
  const { data: session, status } = useSession();
  console.log(session);
  return status === "loading" ? (
    <Loading />
  ) : session && session.user.role === UserRole.ADMIN ? (
    <EditProducts />
  ) : (
    <div>you are not authorized</div>
  );
};

export default ShowItems;
