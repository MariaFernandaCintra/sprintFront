import { useState, useEffect } from "react";
import api from "../services/axios";
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
      const idUsuario = localStorage.getItem("idUsuario");
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
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(2px)",
    },
    modalBox: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      maxHeight: "60%",
      bgcolor: "rgba(44, 44, 44, 0.9)",
      boxShadow: 24,
      borderRadius: 12,
      p: 3,
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
      borderBottom: "1px solid rgba(255,255,255,0.2)",
      pb: 1,
    },
    title: { color: "#eee", fontSize: 20, fontWeight: 600 },
    closeButton: { color: "#ccc", "&:hover": { color: "#fff" } },
    scrollArea: { overflowY: "auto", flexGrow: 1 },
    listItem: { borderBottom: "1px solid rgba(255,255,255,0.1)" },
    listItemText: {
      color: "#ddd",
      "& .MuiListItemText-secondary": { color: "#aaa" },
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      mt: 4,
    },
    errorMessage: { color: "#f66", textAlign: "center", mt: 3 },
    noData: { color: "#aaa", textAlign: "center", mt: 3 },
  };
}
