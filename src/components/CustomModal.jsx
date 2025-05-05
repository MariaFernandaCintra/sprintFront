// React
import * as React from "react";

// MUI - Componentes
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "../components";

// MUI - Ícones
import { CheckCircleIcon, ErrorIcon } from "../components";

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
            <Typography variant="h5" component="div">
              {title}
            </Typography>
          </DialogTitle>
          <Typography variant="body1" sx={styles.title}>
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
      },
      "& .MuiPaper-root": {
        borderRadius: 8,
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
      },
      "& .MuiDialogContent-root": {
        padding: 2,
      },
      "& .MuiDialogActions-root": {
        padding: 2,
      },
    },
    dialogContent: {
      textAlign: "center",
      p: 4,
    },
    box: (type) => ({
      minWidth: 300,
      maxWidth: 400,
      textAlign: "center",
      p: 2,
      borderRadius: 2,
      backgroundColor: type === "success" ? "#e8f5e9" : "#ffebee",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
    }),
    title: {
      mt: 1,
    },
    actions: {
      justifyContent: "center",
      pb: 2,
    },
    button: (type) => ({
      backgroundColor: type === "success" ? "green" : "rgb(226, 16, 16)",
      "&:hover": {
        backgroundColor: type === "success" ? "green" : "rgb(226, 16, 16)",
      },
    }),
  };
}
