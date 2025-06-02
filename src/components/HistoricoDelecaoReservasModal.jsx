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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function HistoricoDelecaoReservasModal({ open, onClose }) {
  const [delecoes, setDelecoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const styles = getStyles();

  const fetchHistoricoDelecao = async () => {
    setLoading(true);
    setError(null);
    try {
      const idUsuario = getIdFromToken();
      if (!idUsuario) throw new Error("ID do usuário não encontrado.");
      const { data } = await api.getUsuarioHistoricoReservasDelecaobyId(
        idUsuario
      );
      setDelecoes(data.historicoDelecao || []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar o histórico de deleções.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchHistoricoDelecao();
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} sx={styles.modalContainer}>
      <Box sx={styles.modalBox}>
        <Box sx={styles.header}>
          <Typography sx={styles.title}>Histórico de Deleções</Typography>
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress sx={{ color: "#ccc" }} />
            <Typography sx={{ mt: 2, color: "#ccc" }}>
              Carregando histórico...
            </Typography>
          </Box>
        ) : error ? (
          <Typography sx={styles.errorMessage}>{error}</Typography>
        ) : delecoes.length > 0 ? (
          <Box sx={styles.scrollArea}>
            <List>
              {delecoes.map((item, idx) => (
                <ListItem key={item.id_log} sx={styles.listItem}>
                  <ListItemText
                    primary={`Deleção ${idx + 1}`}
                    secondary={
                      <>
                        Reserva ID: {item.id_reserva} <br />
                        Sala ID: {item.fk_id_sala} <br />
                        Data Reserva:{" "}
                        {new Date(item.data_reserva).toLocaleDateString()}{" "}
                        <br />
                        Horário: {item.hora_inicio_reserva} –{" "}
                        {item.hora_fim_reserva} <br />
                        Removido em:{" "}
                        {new Date(item.data_hora_log).toLocaleString()}
                      </>
                    }
                    sx={styles.listItemText}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Typography sx={styles.noData}>
            Nenhum registro de deleção encontrado.
          </Typography>
        )}
      </Box>
    </Modal>
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
      fontSize: "24px",
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
    noData: {
      color: "#607D8B",
      textAlign: "center",
      marginTop: 3,
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 150,
      color: '#90A4AE',
    },
    errorMessage: {
      textAlign: 'center',
      color: '#D32F2F',
      fontSize: "16px",
      marginTop: 20,
    },
  };
}
