import { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function HistoricoDelecaoReservasModal({ open, onClose }) {
  const [delecoes, setDelecoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("simples");
  const [expandedDaysMap, setExpandedDaysMap] = useState({});
  const styles = getStyles();

  const diasSemanaMap = {
    1: "Segunda-Feira",
    2: "Terça-Feira",
    3: "Quarta-Feira",
    4: "Quinta-Feira",
    5: "Sexta-Feira",
    6: "Sábado",
    7: "Domingo",
  };

  const toggleDayExpansion = (logId) => {
    setExpandedDaysMap((prevState) => ({
      ...prevState,
      [logId]: !prevState[logId],
    }));
  };

  const fetchHistoricoDelecao = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const idUsuario = getIdFromToken();
      if (!idUsuario) {
        throw new Error("ID do usuário não encontrado.");
      }
      const { data } = await api.getUsuarioHistoricoReservasDelecaobyId(
        idUsuario
      );
      const formattedDelecoes = (data.reservasDeletadas || []).map(item => ({
        ...item,
        // Garante que 'dias_semana' é um array e seus itens são strings
        dias_semana: Array.isArray(item.dias_semana) ? item.dias_semana.map(String) : [],
      }));
      setDelecoes(formattedDelecoes);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar o histórico de deleções.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchHistoricoDelecao();
    }
  }, [open, fetchHistoricoDelecao]);

  const simplesDelecoes = delecoes.filter(
    (delecao) =>
      typeof delecao.tipo === "string" && delecao.tipo.toLowerCase() === "simples"
  );
  const periodicasDelecoes = delecoes.filter(
    (delecao) =>
      typeof delecao.tipo === "string" && delecao.tipo.toLowerCase() === "periodica"
  );

  const renderDelecoesList = (list) => {
    return (
      <Box sx={styles.scrollArea}>
        {list.length === 0 ? (
          <Typography sx={styles.noData}>
            Nenhum registro de deleção {activeTab === "simples" ? "simples" : "periódica"} encontrado.
          </Typography>
        ) : (
          <List>
            {list.map((item) => { // Removido 'idx' pois 'id_log' já é uma key única
              const isExpanded = expandedDaysMap[item.id_log];
              const formattedDaysArray =
                item.dias_semana && Array.isArray(item.dias_semana)
                  ? item.dias_semana.map(
                      (dayNum) =>
                        diasSemanaMap[String(dayNum)] || `Dia ${dayNum}`
                    )
                  : [];

              const showExpandToggle = formattedDaysArray.length > 1;

              return (
                <ListItem key={item.id_log} sx={styles.listItem}>
                  <ListItemText
                    primary={
                      <Typography sx={styles.listItemTitle}>
                        {String(item.sala)}
                      </Typography>
                    }
                    secondary={
                      <>
                        {activeTab === "simples" ? (
                          <Box>
                            <Typography sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Data:
                              </Typography>{" "}
                              {item.data_inicio}
                            </Typography>
                            <Typography sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Hora Início:
                              </Typography>{" "}
                              {String(item.hora_inicio).substring(0, 5)}
                            </Typography>
                            <Typography sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Hora Fim:
                              </Typography>{" "}
                              {String(item.hora_fim).substring(0, 5)}
                            </Typography>
                            <Typography sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Removido em:
                              </Typography>{" "}
                              {new Date(item.data_delecao).toLocaleDateString()}
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <Typography sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Data Início:
                              </Typography>{" "}
                              {item.data_inicio}
                            </Typography>
                            <Typography sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Data Fim:
                              </Typography>{" "}
                              {item.data_fim}
                            </Typography>
                            <Typography sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Hora Início:
                              </Typography>{" "}
                              {String(item.hora_inicio).substring(0, 5)}
                            </Typography>
                            <Typography sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Hora Fim:
                              </Typography>{" "}
                              {String(item.hora_fim).substring(0, 5)}
                            </Typography>
                            <Box sx={styles.detailRow}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Dias da Semana:
                              </Typography>{" "}
                              <Box sx={styles.chipsContainer}>
                                {isExpanded || !showExpandToggle ? (
                                  formattedDaysArray.map((dayName, dayIndex) => (
                                    <Chip
                                      key={dayIndex}
                                      label={dayName}
                                      sx={styles.dayChip}
                                    />
                                  ))
                                ) : (
                                  <Chip
                                    label={`${formattedDaysArray[0]}...`}
                                    sx={styles.dayChip}
                                  />
                                )}
                                {showExpandToggle && (
                                  <IconButton
                                    onClick={() => toggleDayExpansion(item.id_log)}
                                    size="small"
                                    sx={styles.expandToggleButton}
                                  >
                                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                  </IconButton>
                                )}
                              </Box>
                            </Box>
                            <Typography sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Removido em:
                              </Typography>{" "}
                              {new Date(item.data_delecao).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={styles.overlay}>
      {/* O único filho direto do Modal deve ser um único elemento */}
      <Box sx={styles.modal}>
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <CloseIcon sx={{ fontSize: "35px" }} />
        </IconButton>

        <Typography sx={styles.modalTitle}>Histórico de Deleções</Typography>

        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={(event, newTab) => {
            if (newTab !== null) {
              setActiveTab(newTab);
            }
          }}
          aria-label="deletion type tabs"
          sx={styles.modeToggleContainer}
        >
          <ToggleButton value="simples" aria-label="simple deletions">
            Simples
          </ToggleButton>
          <ToggleButton value="periodicas" aria-label="periodic deletions">
            Periódicas
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ flex: 1, width: "100%", minHeight: "150px" }}>
          {loading ? (
            <Box sx={styles.loadingContainer}>
              <CircularProgress sx={{ color: "#ccc" }} />
              <Typography sx={{ mt: 2, color: "#ccc" }}>
                Carregando histórico...
              </Typography>
            </Box>
          ) : error ? (
            <Typography sx={styles.errorMessage}>{error}</Typography>
          ) : activeTab === "simples" ? (
            renderDelecoesList(simplesDelecoes)
          ) : (
            renderDelecoesList(periodicasDelecoes)
          )}
        </Box>
      </Box>
    </Modal>
  );
}

function getStyles() {
  return {
    overlay: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(4px)",
    },
    modal: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "15px",
      width: "90%",
      maxWidth: "500px",
      minHeight: "50vh",
      maxHeight: "65vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0 5px 15px rgba(0,0,0,0.35)",
      position: "relative",
      outline: "none",
      overflow: "hidden",
    },
    closeButton: {
      position: "absolute",
      top: 10,
      right: 10,
      padding: "5px",
      zIndex: 1,
      color: "#999",
      "&:hover": {
        backgroundColor: "transparent",
        color: "#666",
      },
    },
    modalTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "20px",
      textAlign: "center",
    },
    modeToggleContainer: {
      marginBottom: 2,
      width: "100%",
      borderRadius: 2,
      overflow: "hidden",
      backgroundColor: "#f0f0f0",
      "& .MuiToggleButton-root": {
        flex: 1,
        border: "1px solid #e0e0e0",
        "&.Mui-selected": {
          backgroundColor: "rgb(177, 16, 16)",
          color: "white",
          borderColor: "rgb(177, 16, 16)",
          "&:hover": {
            backgroundColor: "rgb(177, 16, 16)",
          },
        },
        "&:not(:first-of-type)": {
          marginLeft: "-1px",
          borderLeft: "1px solid transparent",
        },
        "&:hover": {
          backgroundColor: "#e8e8e8",
        },
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#555",
        paddingBottom: "10px",
        paddingTop: "10px",
      },
    },
    scrollArea: {
      flexGrow: 1,
      width: "100%",
      overflowY: "auto",
      flexShrink: 1,
      height: "400px",
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
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      padding: "15px 20px",
      marginBottom: "15px",
      border: "1px solid #eee",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      width: "100%",
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "column",
    },
    listItemTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "5px",
    },
    detailText: {
      fontSize: "14px",
      color: "#777",
      marginBottom: "5px",
    },
    detailLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#555",
      marginRight: "5px",
    },
    detailRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: "5px",
      width: "100%",
    },
    chipsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "5px",
      alignItems: "center",
      flex: 1,
    },
    dayChip: {
      backgroundColor: "#e0e0e0",
      color: "#555",
      fontWeight: "bold",
      height: "24px",
      "& .MuiChip-label": {
        paddingTop: "2px",
        paddingBottom: "2px",
      },
    },
    expandToggleButton: {
      padding: "4px",
      marginLeft: "5px",
      color: "#777",
    },
    noData: {
      color: "gray",
      textAlign: "center",
      marginTop: "20px",
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
      minHeight: "150px",
      color: "#90A4AE",
    },
    errorMessage: {
      textAlign: "center",
      color: "#D32F2F",
      fontSize: "16px",
      marginTop: "20px",
    },
  };
}