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
    <Modal open={open} onClose={onClose}>
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
    modalBox: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      height: 450,
      bgcolor: "background.paper",
      boxShadow: 24,
      borderRadius: 3,
      p: 4,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
    },
    closeButton: {
      color: "red",
    },
    scrollArea: {
      maxHeight: 370,
      overflowY: "auto",
    },
    listItem: {
      borderBottom: "1px solid #ccc",
    },
    noReservas: {
      textAlign: "center",
      mt: 2,
      color: "gray",
    },
  };
}

export default ReservasUsuarioModal;