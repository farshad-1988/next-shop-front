import { create } from "zustand";
import { SnackbarSeverityEnum } from "@/app/types/types";
import { ReactNode } from "react";
type SnackbarState = {
  open: boolean;
  severity: SnackbarSeverityEnum;
  message: string | ReactNode;
  showSnackbar: (
    message: string | ReactNode,
    severity?: SnackbarSeverityEnum
  ) => void;
  closeSnackbar: () => void;
};

export const useSnackbar = create<SnackbarState>((set) => ({
  open: false,
  severity: SnackbarSeverityEnum.Info,
  message: "",
  showSnackbar: (message, severity = SnackbarSeverityEnum.Info) => {
    set({ message, severity, open: true });
  },
  closeSnackbar() {
    set({ open: false });
  },
}));
