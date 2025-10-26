"use client";

import { JSX } from "react";
import ShowItems from "./(components)/ShowItems";
import { Grid } from "@mui/material";

export default function Home(): JSX.Element {
  return (
    <Grid sx={{ minHeight: "100vh" }}>
      <ShowItems />
    </Grid>
  );
}
