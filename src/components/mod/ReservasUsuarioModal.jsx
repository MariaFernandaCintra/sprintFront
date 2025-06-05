
import { useState } from "react";

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

import HistoricoReservasModal from "./HistoricoReservasModal";
import HistoricoDelecaoReservasModal from "./HistoricoDelecaoReservasModal";

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

  const [openHistorico, setOpenHistorico] = useState(false);
  const [openDelecao, setOpenDelecao] = useState(false);

  const handleEditarClick = (reserva) => {
    onEditarReserva(reserva);
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
          {/* Header */}
          <Box sx={styles.header}>
            <Typography sx={styles.title}>Minhas Reservas</Typography>
            <IconButton onClick={onClose} sx={styles.closeButton}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Conteúdo */}
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
                          onClick={() => handleEditarClick(reserva)}
                          sx={{ color: "rgba(0, 0, 0, 0.45)" }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="apagar"
                          onClick={() => handleApagarClick(reserva.id_reserva)}
                          sx={{ color: "rgba(0, 0, 0, 0.45)" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={`Reserva ${reserva.id_reserva}`}
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

          {/* Footer com botões */}
          <Box sx={styles.modalFooter}>
            <Button
              onClick={() => setOpenHistorico(true)}
              sx={styles.actionButton}
            >
              Histórico
            </Button>
            <Button
              onClick={() => setOpenDelecao(true)}
              sx={{ ...styles.actionButton, ml: 2 }}
            >
              Deletadas
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        open={confirmDeleteOpen}
        onClose={handleCloseConfirmDelete}
        sx={styles.modalContainer}
      >
        <Box sx={styles.confirmDeleteModalBox}>
          <Typography
            variant="h6"
            component="div"
            sx={styles.confirmDeleteTitle}
          >
            Confirmar Exclusão
          </Typography>
          <Typography sx={styles.confirmDeleteText}>
            Tem certeza que deseja apagar esta reserva?
          </Typography>
          <Box sx={styles.confirmDeleteButtonContainer}>
            <Button onClick={handleCloseConfirmDelete} sx={styles.cancelButton}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmApagar}
              variant="contained"
              sx={styles.deleteButton}
            >
              Apagar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modais auxiliares */}
      <HistoricoReservasModal
        open={openHistorico}
        onClose={() => setOpenHistorico(false)}
        setCustomModalOpen={setCustomModalOpen}
        setCustomModalTitle={setCustomModalTitle}
        setCustomModalMessage={setCustomModalMessage}
        setCustomModalType={setCustomModalType}
      />
      <HistoricoDelecaoReservasModal
        open={openDelecao}
        onClose={() => setOpenDelecao(false)}
      />
    </>
  );
}

function getStyles() {
  return {
    modalContainer: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBox: {
      display: "flex",
      flexDirection: "column",
      width: 450,
      maxWidth: "90%",
      maxHeight: "65%",
      padding: 4,
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
      outline: "none",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    title: {
      fontWeight: 600,
      color: "#263238",
      fontSize: "28px",
      textAlign: "center",
      flexGrow: 1,
    },
    closeButton: {
      color: "#EF5350",
      "&:hover": {
        backgroundColor: "rgba(239, 83, 80, 0.1)",
      },
    },
    scrollArea: {
      overflowY: "auto",
      flexGrow: 1,
      paddingRight: 1,
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#E0E0E0",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
    },
    listItem: {
      borderBottom: "1px solid #ECEFF1",
      paddingY: 1.5,
      "&:last-child": {
        borderBottom: "none",
      },
    },
    listItemText: {
      color: "rgba(0, 0, 0, 0.79)",
      "& .MuiListItemText-primary": {
        fontWeight: 500,
        fontSize: "16px",
        marginBottom: 0.5,
      },
      "& .MuiListItemText-secondary": {
        color: "rgba(0, 0, 0, 0.63)",
        fontSize: "14px",
        lineHeight: 1.5,
      },
    },
    noReservas: {
      color: "#607D8B",
      textAlign: "center",
      marginTop: 3,
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
    },
    modalFooter: {
      display: "flex",
      justifyContent: "center",
      marginTop: 3,
      paddingTop: 2,
      borderTop: "1px solid #ECEFF1",
    },
    actionButton: {
      backgroundColor: "rgb(161, 0, 0)",
      "&:hover": {
        backgroundColor: "rgba(161, 0, 0, 0.76)",
      },
      color: "#FFFFFF",
      fontWeight: 500,
      padding: "10px 20px",
      borderRadius: 8,
      textTransform: "none",
      boxShadow: "0 4px 12px rgba(239, 83, 80, 0.3)",
    },
    confirmDeleteModalBox: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 300,
      padding: 4,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
      outline: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    confirmDeleteTitle: {
      fontWeight: 600,
      color: "#263238",
      fontSize: "20px",
      marginBottom: 2,
      textAlign: "center",
    },
    confirmDeleteText: {
      color: "#455A64",
      fontSize: "16px",
      marginBottom: 3,
      textAlign: "center",
    },
    confirmDeleteButtonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: 2,
      width: "100%",
    },
    cancelButton: {
      backgroundColor: "#ECEFF1",
      color: "#546E7A",
      fontWeight: 500,
      padding: "8px 18px",
      borderRadius: 8,
      textTransform: "none",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#CFD8DC",
        boxShadow: "none",
      },
    },
    deleteButton: {
      backgroundColor: "#EF5350",
      color: "#FFFFFF",
      fontWeight: 500,
      padding: "8px 18px",
      borderRadius: 8,
      textTransform: "none",
      boxShadow: "0 4px 10px rgba(239, 83, 80, 0.3)",
      "&:hover": {
        backgroundColor: "#E53935",
        boxShadow: "0 6px 15px rgba(239, 83, 80, 0.4)",
      },
      "&:active": {
        backgroundColor: "#D32F2F",
      },
    },
  };
}
