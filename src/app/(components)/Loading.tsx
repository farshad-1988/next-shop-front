import * as React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export default function Loading({ message }: { message?: string }) {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={true}
    >
      {message}
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
