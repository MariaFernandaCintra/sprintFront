// React
import * as React from "react";

// MUI
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "../components";
import CloseIcon from "@mui/icons-material/Close";

function ReservasUsuarioModal({ open, onClose, reservas }) {
  const styles = getStyles();

  return (
    <Modal open={open} onClose={onClose} sx={styles.modalContainer}>
      <Box sx={styles.modalBox}>
        <Box sx={styles.header}>
          <Typography sx={styles.title}>Minhas Reservas</Typography>
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </Box>

        {reservas.length > 0 ? (
          <Box sx={styles.scrollArea}>
            <List>
              {reservas.map((reserva, index) => (
                <ListItem key={index} sx={styles.listItem}>
                  <ListItemText
                    primary={`Reserva ${index + 1}`}
                    sx={styles.listItemText}
                    secondary={
                      <>
                        Sala: {reserva.sala} <br />
                        Data: {reserva.data} <br />
                        Hora Início: {reserva.hora_inicio} | Hora Fim:{" "}
                        {reserva.hora_fim}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Typography sx={styles.noReservas}>
            Nenhuma reserva encontrada.
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

function getStyles() {
  return {
    modalContainer: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(10px)",
    },
    modalBox: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      maxHeight: "50%",
      backgroundColor: "rgba(44, 44, 44, 0.8)",
      boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      p: 4,
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      mb: "0px",
      pb: "0px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
      paddingBottom: 16,
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
    title: {
      fontWeight: 600,
      color: "#eee",
      fontSize: 22,
    },
    closeButton: {
      color: "#ccc",
      "&:hover": {
        color: "#eee",
      },
    },
    scrollArea: {
      overflowY: "auto",
      flexGrow: 2,
      paddingRight: 8,
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
    },
    listItem: {
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      color: "#ddd",
      padding: "12px 0",
    },
    listItemText: {
      color: "#ddd",
      "& .MuiListItemText-primary": {
        fontWeight: 500,
      },
      "& .MuiListItemText-secondary": {
        color: "#aaa",
      },
    },
    noReservas: {
      textAlign: "center",
      marginTop: 24,
      color: "#aaa",
      fontSize: 16,
    },
  };
}

export default ReservasUsuarioModal;
