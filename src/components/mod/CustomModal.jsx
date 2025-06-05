
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function CustomModal({
  open,
  onClose,
  title,
  message,
  buttonText = "OK",
  type = "info", // 'success' | 'error' | 'info'
}) {
  const renderIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircleIcon sx={{ fontSize: 75, color: "#4caf50", mb: 1 }} />
        );
      case "error":
        return <ErrorIcon sx={{ fontSize: 75, color: "#f44336", mb: 1 }} />;
      default:
        return null;
    }
  };

  const styles = getStyles();
  return (
    <Dialog open={open} onClose={onClose} sx={styles.dialog}>
      <DialogContent sx={styles.dialogContent}>
        <Box sx={styles.box(type)}>
          {renderIcon()}
          <DialogTitle>
            <Typography variant="h5" component="div" sx={styles.title}>
              {title}
            </Typography>
          </DialogTitle>
          <Typography variant="body1" sx={styles.message}>
            {message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.actions}>
        <Button onClick={onClose} variant="contained" sx={styles.button(type)}>
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function getStyles() {
  return {
    dialog: {
      "& .MuiDialog-container": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(70, 70, 70, 0.4)",
        backdropFilter: "blur(5px)",
      },
      "& .MuiPaper-root": {
        borderRadius: 8,
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
        backgroundColor: "rgb(255, 255, 255)",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(214, 214, 214, 0.1)",
      },
      "& .MuiDialogActions-root": {
        mb: 3
      },
    },
    dialogContent: {
      textAlign: "center",
      color: "balck",
    },
    box: (type) => ({
      minWidth: 300,
      height: 220,
      maxWidth: 300,
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      p: 2,
      borderRadius: 2,
      backgroundColor: type === "success" ? "#e8f5e9" : "#ffebee",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "transparent",
    }),
    title: {
      mt: 1,
      color: "balck",
      fontWeight: 1000,
      fontSize: 26
    },
    message: {
      color: "balck",
      fontSize: 18
    },
    actions: {
      justifyContent: "center",
    },
    button: (type) => ({
      backgroundColor: type === "success" ? "green" : "rgb(226, 16, 16)",
      "&:hover": {
        backgroundColor: type === "success" ? "green" : "rgb(226, 16, 16)",
      },
    }),
  };
}
