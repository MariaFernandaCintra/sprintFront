import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from "@mui/material";

export default function ConfirmarDelecaoModal({ open, onClose, onConfirm }) {
  const styles = getStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      sx={styles.modalContainer}
      slotProps={{
        paper: {
          sx: styles.modalBox,
        },
      }}
    >
      <Box sx={styles.header}>
        <DialogTitle id="confirm-dialog-title" sx={styles.title}>
          Confirmação de Deleção
        </DialogTitle>
      </Box>
      <DialogContent sx={styles.messageContainer}>
        <DialogContentText id="confirm-dialog-description">
          Tem certeza que deseja deletar sua conta? Esta ação é irreversível
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={styles.containerButtons}>
        <Button onClick={onClose} variant="contained" sx={styles.confirmButton}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={styles.cancelButton}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function getStyles() {
  return {
    modalContainer: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBox: {
      display: "flex",
      flexDirection: "column",
      width: 350,
      maxWidth: "90%",
      padding: 4,
      backgroundColor: "rgb(255, 255, 255)",
      borderRadius: 10,
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
      outline: "none",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    messageContainer: {
      padding: 1.5,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontWeight: 600,
      padding: 1,
      color: "#37474F",
      fontSize: "22px",
      textAlign: "center",
      flexGrow: 1,
    },
    containerButtons: {
      alignItems: "center",
      justifyContent: "space-around",
    },
    confirmButton: {
      backgroundColor: "#B30808",
      color: "#5FFFFFF",
      "&:hover": {
        backgroundColor: "rgba(187, 0, 0, 0.76)",
      },
      textTransform: "none",
      width: "40%",
      paddingY: 1.5,
      fontSize: "16px",
      fontWeight: 600,
      borderRadius: 8,
    },
    cancelButton: {
      backgroundColor: "#B30808",
      color: "#5FFFFFF",
      "&:hover": {
        backgroundColor: "rgba(161, 0, 0, 0.76)",
      },
      textTransform: "none",
      width: "40%",
      paddingY: 1.5,
      fontSize: "16px",
      fontWeight: 600,
      borderRadius: 8,
    },
  };
}
