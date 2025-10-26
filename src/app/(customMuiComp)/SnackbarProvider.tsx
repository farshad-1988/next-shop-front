"use client";

// SnackbarProvider.tsx
import { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, Grow } from "@mui/material";
import { SnackbarSeverityEnum } from "@/app/types/types";

const SnackbarContext = createContext({
  showSnackbar: (message: string, severity?: SnackbarSeverityEnum) => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

export function SnackbarProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarSeverityEnum>(
    SnackbarSeverityEnum.Info
  );

  const showSnackbar = useCallback(
    (msg: string, sev: SnackbarSeverityEnum = SnackbarSeverityEnum.Info) => {
      setMessage(msg);
      setSeverity(sev);
      setOpen(true);
    },
    []
  );

  const handleClose = () => setOpen(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        slots={{ transition: Grow }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
