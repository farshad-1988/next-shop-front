"use client";

// import EditProducts from "./(components)/EditProducts";
import { useSession } from "next-auth/react";
import Loading from "@/app/(components)/Loading";
import { UserRole } from "@/app/types/types";
import ShowItems from "@/app/(components)/ShowItems";
const MainPage = () => {
  const { data: session, status } = useSession();
  return status === "loading" ? (
    <Loading />
  ) : session && session.user.role === UserRole.ADMIN ? (
    <ShowItems />
  ) : (
    <div>you are not authorized</div>
  );
};

export default MainPage;
