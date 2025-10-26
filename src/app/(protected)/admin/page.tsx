"use client";

import { Grid } from "@mui/material";
import React from "react";

import { useProductsItem } from "@/app/(store)/useProductsStore";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import EditProducts from "./(components)/EditProducts";
import { useSession } from "next-auth/react";
import Loading from "@/app/(components)/Loading";
import { UserRole } from "@/app/types/types";
const ShowItems = () => {
  const { data: session, status } = useSession();

  return status === "loading" ? (
    <Loading />
  ) : session && session.user.role !== UserRole.ADMIN ? (
    <EditProducts />
  ) : (
    <div>you are not authorized</div>
  );
};

export default ShowItems;
