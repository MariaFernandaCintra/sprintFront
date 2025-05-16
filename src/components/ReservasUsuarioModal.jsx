import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ReservasUsuarioModal({
  open,
  onClose,
  reservas,
  onApagarReserva,
  onEditarReserva,
  setCustomModalOpen,
  setCustomModalTitle,
  setCustomModalMessage,
  setCustomModalType,
}) {
  const styles = getStyles();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [reservaToDeleteId, setReservaToDeleteId] = useState(null);

  const handleEditarClick = (id_reserva) => {
    onEditarReserva(id_reserva);
  };

  const handleApagarClick = (id_reserva) => {
    setReservaToDeleteId(id_reserva);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmApagar = () => {
    if (reservaToDeleteId) {
      onApagarReserva(reservaToDeleteId);
      setCustomModalOpen(true);
      setCustomModalTitle("Sucesso");
      setCustomModalMessage("Reserva apagada com sucesso!");
      setCustomModalType("success");
    }
    setConfirmDeleteOpen(false);
    setReservaToDeleteId(null);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setReservaToDeleteId(null);
  };

  return (
    <>
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
                {reservas.map((reserva) => (
                  <ListItem
                    key={reserva.id_reserva}
                    sx={styles.listItem}
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="editar"
                          onClick={() => handleEditarClick(reserva.id_reserva)}
                          sx={{ color: "#ccc" }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="apagar"
                          onClick={() => handleApagarClick(reserva.id_reserva)}
                          sx={{ color: "#ccc" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={`Reserva ${reserva.id_reserva + 1}`}
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

      {/* Modal de confirmação de exclusão */}
      <Modal open={confirmDeleteOpen} onClose={handleCloseConfirmDelete}>
        <Box sx={{ ...styles.modalBox, width: 300 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ mt: 2, mb: 2, color: "#eee" }}
          >
            Confirmar Exclusão
          </Typography>
          <Typography sx={{ mb: 2, color: "#ddd" }}>
            Tem certeza que deseja apagar esta reserva?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleCloseConfirmDelete}
              sx={{ mr: 2, color: "#ccc" }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmApagar}
              variant="contained"
              color="error"
            >
              Apagar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
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
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
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
      padding: "12px 0px",
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
      color: "#aaa",
      fontSize: 16,
    },
  };
}
