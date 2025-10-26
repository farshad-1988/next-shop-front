import { Snackbar, Alert, Grow } from "@mui/material";
import { useSnackbar } from "../(store)/useSnackbarStore";
const SnackbarComp = () => {
  const { open, message, severity, closeSnackbar } = useSnackbar();

  return (
    <Snackbar
      open={open}
      onClose={closeSnackbar}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      slots={{ transition: Grow }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComp;
