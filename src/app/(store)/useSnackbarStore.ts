import { create } from "zustand";
import { SnackbarSeverityEnum } from "@/app/types/types";
type SnackbarState = {
  open: boolean;
  severity: SnackbarSeverityEnum;
  message: string;
  showSnackbar: (message: string, severity?: SnackbarSeverityEnum) => void;
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
