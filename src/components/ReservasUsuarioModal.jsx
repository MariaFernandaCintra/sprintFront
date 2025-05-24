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

// Importe os dois modais
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

  // Estados para controlar a abertura dos modais
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
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(10px)",
    },
    modalBox: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 450,
      maxHeight: "60%",
      bgcolor: "rgba(44, 44, 44, 0.8)",
      boxShadow: 24,
      borderRadius: 12,
      p: 4,
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      mb: 2,
      pb: 1,
    },
    title: { color: "#eee", fontSize: 22, fontWeight: 600 },
    closeButton: { color: "#ccc", "&:hover": { color: "#eee" } },
    scrollArea: {
      overflowY: "auto",
      flexGrow: 1,
      "&::-webkit-scrollbar": { width: "8px" },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
      pr: 1,
    },
    listItem: { borderBottom: "1px solid rgba(255,255,255,0.05)" },
    listItemText: {
      color: "#ddd",
      "& .MuiListItemText-secondary": { color: "#aaa" },
    },
    noReservas: {
      color: "#aaa",
      textAlign: "center",
      mt: 3,
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalFooter: {
      display: "flex",
      justifyContent: "center",
      mt: 2,
      borderTop: "1px solid rgba(255,255,255,0.1)",
      pt: 2,
    },
    actionButton: {
      color: "rgba(39,39,39,0.75)",
      backgroundColor: "rgba(255,255,255,0.8)",
      "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
    },
  };
}
