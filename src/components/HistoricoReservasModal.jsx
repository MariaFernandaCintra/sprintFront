import { useState, useEffect } from "react";
import api from "../services/axios";
import { getIdFromToken } from "../auth/auth";

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

  const handleConfirmApagar = async () => { // Marque como async
    if (reservaToDeleteId) {
      try {
        const idUsuario = getIdFromToken();
        await onApagarReserva(reservaToDeleteId, idUsuario); // Passe o idUsuario
        setCustomModalOpen(true);
        setCustomModalTitle("Sucesso");
        setCustomModalMessage("Reserva apagada com sucesso!");
        setCustomModalType("success");
        fetchHistoricoReservas(); // Atualiza a lista após apagar
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
              <Typography sx={{ mt: 2, color: "#ccc" }}>Carregando reservas...</Typography>
            </Box>
          ) : error ? (
            <Typography sx={styles.errorMessage}>{error}</Typography>
          ) : reservas.length > 0 ? (
            <Box sx={styles.scrollArea}>
              <List>
                {reservas.map((reserva, index) => ( // Use index para a key se não tiver um id_reserva único diretamente
                  <ListItem
                    key={reserva.id_reserva || `reserva-${index}`} // Use id_reserva se disponível, senão index
                    sx={styles.listItem}
                    secondaryAction={
                      <Box>
                        {/* Verifique se a API retorna um ID para edição/deleção */}
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
                              onClick={() => handleApagarClick(reserva.id_reserva)}
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
                          Data: {new Date(reserva.data).toLocaleDateString()} <br />
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
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(2px)",
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
      marginTop: 20,
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 150,
        color: '#ccc',
    },
    errorMessage: {
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
        marginTop: 20,
    },
  };
}