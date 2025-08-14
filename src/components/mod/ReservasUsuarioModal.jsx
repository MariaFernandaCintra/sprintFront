import { useState, useEffect, useCallback } from "react";

import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { getIdFromToken } from "../../auth/auth";
import api from "../../services/axios";
import AtualizarReservaModal from "./AtualizarReservaModal";
import ReservasHistoricoModal from "./ReservasHistoricoModal";
import ReservasDeletadasModal from "./ReservasDeletadasModal";

function ReservasUsuarioModal({
  open,
  onClose,
  setCustomModalOpen,
  setCustomModalTitle,
  setCustomModalMessage,
  setCustomModalType,
}) {
  const [currentReservas, setCurrentReservas] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("simples");
  const [expandedDaysMap, setExpandedDaysMap] = useState({});
  const [reservaSelecionadaParaEdicao, setReservaSelecionadaParaEdicao] =
    useState(null);
  const [mostrarEdicaoReserva, setMostrarEdicaoReserva] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openHistorico, setOpenHistorico] = useState(false);
  const [openDelecao, setOpenDelecao] = useState(false);

  const diasSemanaMap = {
    1: "Segunda-Feira",
    2: "Terça-Feira",
    3: "Quarta-Feira",
    4: "Quinta-Feira",
    5: "Sexta-Feira",
    6: "Sábado",
    7: "Domingo",
  };

  const parseDataHora = useCallback((dataStr, horaStr) => {
    const [dia, mes, ano] = String(dataStr).split("-");
    const [hora, min, seg] = String(horaStr).split(":");
    return new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia),
      parseInt(hora),
      parseInt(min),
      parseInt(seg)
    );
  }, []);

  const fetchCurrentReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const idUsuario = getIdFromToken();
      if (isNaN(idUsuario)) {
        throw new Error("ID do usuário não encontrado.");
      }

      const responseReservas = await api.getUsuarioReservasById(idUsuario);

      const agora = new Date();

      const reservasFuturas = (responseReservas.data.reservas || []).filter(
        (reserva) => {
          if (reserva.tipo.toLowerCase().includes("simples")) {
            const dataHoraInicio = parseDataHora(
              reserva.data_inicio,
              reserva.hora_fim
            );
            return dataHoraInicio >= agora;
          } else if (reserva.tipo.toLowerCase().includes("periodica")) {
            if (!reserva.data_fim || !reserva.hora_fim) {
              console.warn(
                "Reserva periódica sem data_fim ou hora_fim:",
                reserva
              );
              return false;
            }
            const dataHoraFim = parseDataHora(
              reserva.data_fim,
              reserva.hora_fim
            );
            return dataHoraFim >= agora;
          }
          return false;
        }
      );
      console.log("resrevasFuturas", reservasFuturas);
      setCurrentReservas(reservasFuturas);
    } catch (error) {
      console.error("Erro ao buscar reservas atuais:", error);
      setError("Não foi possível carregar suas reservas.");
    } finally {
      setLoading(false);
    }
  }, [parseDataHora]);

  useEffect(() => {
    if (open) {
      fetchCurrentReservations();
    }
  }, [open, fetchCurrentReservations]);

  const simplesReservas = currentReservas.filter(
    (reserva) =>
      typeof reserva.tipo === "string" &&
      reserva.tipo.toLowerCase().includes("simples")
  );
  const periodicasReservas = currentReservas.filter(
    (reserva) =>
      typeof reserva.tipo === "string" &&
      reserva.tipo.toLowerCase().includes("periodica")
  );

  const toggleDayExpansion = (reservaId) => {
    setExpandedDaysMap((prevState) => ({
      ...prevState,
      [reservaId]: !prevState[reservaId],
    }));
  };

  const handleEditarReserva = (reserva) => {
    setReservaSelecionadaParaEdicao(reserva);
    setMostrarEdicaoReserva(true);
  };

  const handleFecharEdicaoReserva = () => {
    setMostrarEdicaoReserva(false);
    setReservaSelecionadaParaEdicao(null);
    fetchCurrentReservations();
  };

  const handleDeletarReserva = (reserva) => {
    setReservaToDelete(reserva);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmApagar = async () => {
    if (reservaToDelete) {
      try {
        const idUsuario = getIdFromToken();
        if (isNaN(idUsuario)) {
          throw new Error("ID do usuário inválido.");
        }
        await api.deleteReserva(reservaToDelete.id_reserva, idUsuario);
        setCustomModalOpen(true);
        setCustomModalTitle("Sucesso");
        setCustomModalMessage("Reserva apagada com sucesso!");
        setCustomModalType("success");
        fetchCurrentReservations();
      } catch (error) {
        console.error("Erro ao apagar reserva:", error);
        setCustomModalOpen(true);
        setCustomModalTitle("Erro");
        setCustomModalMessage("Erro ao apagar reserva. Tente novamente.");
        setCustomModalType("error");
      }
    }
    setConfirmDeleteOpen(false);
    setReservaToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setReservaToDelete(null);
  };

  const styles = getStyles();

  const renderReservasList = (reservaList) => {
    if (loading) {
      return (
        <Box sx={styles.loadingContainer}>
          <CircularProgress sx={{ color: "#ccc" }} />
          <Typography sx={{ mt: 2, color: "#ccc" }}>
            Carregando reservas...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return <Typography sx={styles.errorMessage}>{error}</Typography>;
    }

    return (
      <Box sx={styles.scrollArea}>
        {reservaList.length === 0 ? (
          <Typography sx={styles.noReservas}>
            Nenhuma reserva {activeTab === "simples" ? "simples" : "periódica"}{" "}
            encontrada.
          </Typography>
        ) : (
          <List>
            {reservaList.map((reserva) => {
              const isExpanded = expandedDaysMap[reserva.id_reserva];
              const formattedDaysArray =
                reserva.dias_semana && Array.isArray(reserva.dias_semana)
                  ? reserva.dias_semana.map(
                      (dayNum) =>
                        diasSemanaMap[String(dayNum)] || `Dia ${dayNum}`
                    )
                  : [];

              const showExpandToggle = formattedDaysArray.length > 1;

              return (
                <ListItem key={reserva.id_reserva} sx={styles.itemReserva}>
                  <ListItemText
                    primary={
                      <Typography sx={styles.itemTitle}>
                        {String(reserva.sala)}
                      </Typography>
                    }
                    secondary={
                      <Typography component="div">
                        {activeTab === "simples" ? (
                          <>
                            <Typography component="div" sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Data:
                              </Typography>{" "}
                              {String(reserva.data_inicio)}
                            </Typography>
                            <Typography component="div" sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Hora Início:
                              </Typography>{" "}
                              {String(reserva.hora_inicio).substring(0, 5)}
                            </Typography>
                            <Typography component="div" sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Hora Fim:
                              </Typography>{" "}
                              {String(reserva.hora_fim).substring(0, 5)}
                            </Typography>
                            {formattedDaysArray.length > 0 && (
                              <Typography
                                component="div"
                                sx={styles.detailText}
                              >
                                <Typography
                                  component="span"
                                  sx={styles.detailLabel}
                                >
                                  Dia da Semana:
                                </Typography>{" "}
                                {formattedDaysArray.join(", ")}
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Box>
                            <Typography component="div" sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Data Início:
                              </Typography>{" "}
                              {String(reserva.data_inicio)}
                            </Typography>
                            <Typography component="div" sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Data Fim:
                              </Typography>{" "}
                              {String(reserva.data_fim)}
                            </Typography>
                            <Typography component="div" sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Hora Início:
                              </Typography>{" "}
                              {String(reserva.hora_inicio).substring(0, 5)}
                            </Typography>
                            <Typography component="div" sx={styles.detailText}>
                              <Typography
                                component="span"
                                sx={styles.detailLabel}
                              >
                                Hora Fim:
                              </Typography>{" "}
                              {String(reserva.hora_fim).substring(0, 5)}
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
                                  formattedDaysArray.map(
                                    (dayName, dayIndex) => (
                                      <Chip
                                        key={dayIndex}
                                        label={dayName}
                                        sx={styles.dayChip}
                                      />
                                    )
                                  )
                                ) : (
                                  <Chip
                                    label={`${formattedDaysArray[0]}...`}
                                    sx={styles.dayChip}
                                  />
                                )}
                                {showExpandToggle && (
                                  <IconButton
                                    onClick={() =>
                                      toggleDayExpansion(reserva.id_reserva)
                                    }
                                    size="small"
                                    sx={styles.expandToggleButton}
                                  >
                                    {isExpanded ? (
                                      <ExpandLessIcon />
                                    ) : (
                                      <ExpandMoreIcon />
                                    )}
                                  </IconButton>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Typography>
                    }
                  />
                  <Box sx={styles.itemActions}>
                    <IconButton
                      onClick={() => {
                        handleEditarReserva(reserva);
                      }}
                      sx={styles.actionButton}
                    >
                      <EditIcon sx={styles.actionIcon} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeletarReserva(reserva)}
                      sx={styles.actionButton}
                    >
                      <DeleteIcon sx={styles.actionIcon} />
                    </IconButton>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    );
  };

  return (
    <>
      <Modal open={open} onClose={onClose} sx={styles.overlay}>
        <Box sx={styles.modal}>
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <CloseIcon sx={{ fontSize: "35px" }} />
          </IconButton>

          <Typography sx={styles.modalTitle}>Minhas Reservas</Typography>

          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={(event, newTab) => {
              if (newTab !== null) {
                setActiveTab(newTab);
              }
            }}
            aria-label="reservation type tabs"
            sx={styles.modeToggleContainer}
          >
            <ToggleButton value="simples" aria-label="simple reservations">
              Simples
            </ToggleButton>
            <ToggleButton value="periodicas" aria-label="periodic reservations">
              Periódicas
            </ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ flex: 1, width: "100%", minHeight: "150px" }}>
            {activeTab === "simples"
              ? renderReservasList(simplesReservas)
              : renderReservasList(periodicasReservas)}
          </Box>

          <Box sx={styles.bottomButtonContainer}>
            <Button
              onClick={() => setOpenHistorico(true)}
              sx={styles.bottomButton}
            >
              Histórico
            </Button>
            <Button
              onClick={() => setOpenDelecao(true)}
              sx={styles.bottomButton}
            >
              Deletadas
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        sx={styles.overlay}
      >
        <Box sx={styles.confirmModal}>
          <Typography sx={styles.confirmTitle}>Confirmar exclusão</Typography>
          <Typography sx={styles.confirmMessage}>
            Tem certeza que deseja apagar esta reserva?
          </Typography>
          <Box sx={styles.confirmActions}>
            <Button
              onClick={handleCancelDelete}
              variant="contained"
              sx={{ ...styles.confirmButtonBase, ...styles.cancelButton }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmApagar}
              variant="contained"
              sx={{
                ...styles.confirmButtonBase,
                ...styles.deleteConfirmButton,
              }}
            >
              Apagar
            </Button>
          </Box>
        </Box>
      </Modal>

      {mostrarEdicaoReserva && reservaSelecionadaParaEdicao && (
        <AtualizarReservaModal
          open={true}
          onClose={handleFecharEdicaoReserva}
          reserva={reservaSelecionadaParaEdicao}
          onSuccess={fetchCurrentReservations}
          setCustomModalOpen={setCustomModalOpen}
          setCustomModalTitle={setCustomModalTitle}
          setCustomModalMessage={setCustomModalMessage}
          setCustomModalType={setCustomModalType}
        />
      )}

      <ReservasHistoricoModal
        open={openHistorico}
        onClose={() => setOpenHistorico(false)}
        setCustomModalOpen={setCustomModalOpen}
        setCustomModalTitle={setCustomModalTitle}
        setCustomModalMessage={setCustomModalMessage}
        setCustomModalType={setCustomModalType}
      />
      <ReservasDeletadasModal
        open={openDelecao}
        onClose={() => setOpenDelecao(false)}
      />
    </>
  );
}

export default ReservasUsuarioModal;

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
    noReservas: {
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
    itemReserva: {
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      padding: "15px 20px",
      marginBottom: "15px",
      border: "1px solid #eee",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
    },
    itemTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "5px",
    },
    itemActions: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto",
    },
    actionButton: {
      marginLeft: "10px",
      minWidth: "30px",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      backgroundColor: "#444",
      "&:hover": {
        backgroundColor: "#666",
      },
    },
    actionIcon: {
      color: "white",
      fontSize: "18px",
    },
    actionIconSmall: {
      color: "#777",
      fontSize: "20px",
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
    bottomButtonContainer: {
      display: "flex",
      justifyContent: "space-around",
      width: "100%",
      marginTop: "20px",
      paddingTop: "15px",
      borderTop: "1px solid #eee",
    },
    bottomButton: {
      backgroundColor: "rgb(177, 16, 16)",
      padding: "10px 20px",
      borderRadius: "8px",
      alignItems: "center",
      flex: 1,
      margin: "0 5px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
      textTransform: "none",
      "&:hover": {
        backgroundColor: "rgba(177, 16, 16, 0.8)",
      },
    },
    confirmModal: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "15px",
      width: "80%",
      maxWidth: "350px",
      alignItems: "center",
      boxShadow: "0 5px 15px rgba(0,0,0,0.35)",
      outline: "none",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    confirmTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#333",
      textAlign: "center",
    },
    confirmMessage: {
      fontSize: "16px",
      textAlign: "center",
      marginBottom: "30px",
      color: "#666",
    },
    confirmActions: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    confirmButtonBase: {
      padding: "10px 20px",
      borderRadius: "8px",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      textTransform: "none",
      fontWeight: "bold",
      fontSize: "16px",
    },
    cancelButton: {
      backgroundColor: "#ccc",
      marginRight: "5px",
      color: "white",
      "&:hover": {
        backgroundColor: "#b3b3b3",
      },
    },
    deleteConfirmButton: {
      backgroundColor: "rgb(177, 16, 16)",
      marginLeft: "5px",
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(177, 16, 16, 0.8)",
      },
    },
  };
}
