import { useState, useEffect } from "react";
import { getIdFromToken } from "../../auth/auth";
import api from "../../services/axios";

import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function HistoricoReservasModal({
  open,
  onClose,
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
  const [reservas, setReservas] = useState([]); // Estado para armazenar as reservas
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para erros

  // Função para buscar o histórico de reservas
  const fetchHistoricoReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const idUsuario = getIdFromToken();
      if (!idUsuario) {
        console.error("ID do usuário não encontrado no localStorage.");
        setError("ID do usuário não encontrado.");
        setLoading(false);
        return;
      }
      const response = await api.getUsuarioHistoricoReservasbyId(idUsuario);
      setReservas(response.data.historico || []);
    } catch (err) {
      console.error("Erro ao buscar histórico de reservas:", err);
      setError("Não foi possível carregar as reservas.");
    } finally {
      setLoading(false);
    }
  };

  // Chama a função de busca quando o modal é aberto
  useEffect(() => {
    if (open) {
      fetchHistoricoReservas();
    }
  }, [open]);

  const handleEditarClick = (reserva) => {
    onEditarReserva(reserva);
  };

  const handleApagarClick = (id_reserva) => {
    setReservaToDeleteId(id_reserva);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmApagar = async () => {
    if (reservaToDeleteId) {
      try {
        const idUsuario = getIdFromToken();
        await onApagarReserva(reservaToDeleteId, idUsuario);
        setCustomModalOpen(true);
        setCustomModalTitle("Sucesso");
        setCustomModalMessage("Reserva apagada com sucesso!");
        setCustomModalType("success");
        fetchHistoricoReservas();
      } catch (err) {
        console.error("Erro ao apagar reserva:", err);
        setCustomModalOpen(true);
        setCustomModalTitle("Erro");
        setCustomModalMessage("Não foi possível apagar a reserva.");
        setCustomModalType("error");
      }
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
            <Typography sx={styles.title}>Histórico de Reservas</Typography>
            <IconButton onClick={onClose} sx={styles.closeButton}>
              <CloseIcon />
            </IconButton>
          </Box>

          {loading ? (
            <Box sx={styles.loadingContainer}>
              <CircularProgress sx={{ color: "#ccc" }} />
              <Typography sx={{ mt: 2, color: "#ccc" }}>
                Carregando reservas...
              </Typography>
            </Box>
          ) : error ? (
            <Typography sx={styles.errorMessage}>{error}</Typography>
          ) : reservas.length > 0 ? (
            <Box sx={styles.scrollArea}>
              <List>
                {reservas.map((reserva, index) => (
                  <ListItem
                    key={reserva.id_reserva || `reserva-${index}`}
                    sx={styles.listItem}
                    secondaryAction={
                      <Box>
                        {reserva.id_reserva && (
                          <>
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
                              onClick={() =>
                                handleApagarClick(reserva.id_reserva)
                              }
                              sx={{ color: "#ccc" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={`Reserva ${index + 1}`}
                      sx={styles.listItemText}
                      secondary={
                        <>
                          Data: {new Date(reserva.data).toLocaleDateString()}{" "}
                          <br />
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
    </>
  );
}

function getStyles() {
  return {
    modalContainer: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBox: {
      display: "flex",
      flexDirection: "column",
      width: 420,
      maxWidth: "90%",
      maxHeight: "65%",
      padding: 3,
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
      outline: "none",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 1.5,
    },
    title: {
      fontWeight: 600,
      color: "#37474F",
      fontSize: "26px",
      textAlign: "center",
      flexGrow: 1,
    },
    closeButton: {
      color: "#E57373",
      "&:hover": {
        backgroundColor: "rgba(239, 83, 80, 0.08)",
      },
    },
    scrollArea: {
      overflowY: "auto",
      flexGrow: 1,
      paddingRight: 0.5,
      "&::-webkit-scrollbar": {
        width: "5px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#E0E0E0",
        borderRadius: "8px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
    },
    listItem: {
      borderBottom: "1px solid #F5F5F5",
      paddingY: 1.2,
      "&:last-child": {
        borderBottom: "none",
      },
    },
    listItemText: {
      color: "rgba(0, 0, 0, 0.79)",
      "& .MuiListItemText-primary": {
        fontWeight: 500,
        fontSize: "16px",
        marginBottom: 0.2,
      },
      "& .MuiListItemText-secondary": {
        color: "rgba(0, 0, 0, 0.63)",
        fontSize: "14px",
        lineHeight: 1.4,
      },
    },
    noReservas: {
      color: "#90A4AE",
      textAlign: "center",
      marginTop: 2.5,
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 120,
      color: "#B0BEC5",
    },
    errorMessage: {
      textAlign: "center",
      color: "#D32F2F",
      fontSize: "15px",
      marginTop: 2.5,
    },
  };
}
