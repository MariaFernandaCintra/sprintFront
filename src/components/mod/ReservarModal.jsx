import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

import { getToday } from "../../utils/dateUtils";
import { getIdFromToken } from "../../auth/auth";
import api from "../../services/axios";
import CustomModal from "./CustomModal";
import DiasModal from "./DiasModal";

export default function ReservarModal({ isOpen, onClose, idSala, roomNome }) {
  const styles = getStyles();

  const [currentMode, setCurrentMode] = useState("simples");

  const [dataSimples, setDataSimples] = useState(getToday());

  const [dataInicioPeriodica, setDataInicioPeriodica] = useState(getToday());
  const [dataFimPeriodica, setDataFimPeriodica] = useState(getToday());
  const [selectedDays, setSelectedDays] = useState([]);
  const [validDays, setValidDays] = useState([]);
  const [showDaySelectionModal, setShowDaySelectionModal] = useState(false);

  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFim, setHoraFim] = useState(
    new Date(new Date().getTime() + 60 * 60 * 1000)
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    type: "success",
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const idUsuario = getIdFromToken();
  const navigate = useNavigate();

  const diasSemanaMap = {
    1: "Segunda-Feira",
    2: "Terça-Feira",
    3: "Quarta-Feira",
    4: "Quinta-Feira",
    5: "Sexta-Feira",
    6: "Sábado",
  };
  const diasSemanaKeys = Object.keys(diasSemanaMap).map(Number);

  const ajustarHoraFim = useCallback(
    (newHoraInicio) => {
      const baseTime =
        newHoraInicio instanceof Date ? newHoraInicio : horaInicio;
      const adjustedTime = new Date(baseTime.getTime() + 60 * 60 * 1000);
      setHoraFim(adjustedTime);
    },
    [horaInicio]
  );

  const formatarHoraComSegundosZero = useCallback((date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}:00`;
  }, []);

  const formatarDataExibicao = useCallback((date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    return format(date, "dd/MM/yyyy");
  }, []);

  const formatarHoraExibicao = useCallback((date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return "";
    }
    return format(date, "HH:mm");
  }, []);

  const getDaysInRange = useCallback(
    (startDate, endDate) => {
      const days = new Set();
      const current = new Date(startDate);
      current.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);

      while (current <= end) {
        const dayOfWeek = current.getDay();
        if (diasSemanaKeys.includes(dayOfWeek)) {
          days.add(dayOfWeek);
        }
        current.setDate(current.getDate() + 1);
      }
      return Array.from(days).sort((a, b) => a - b);
    },
    [diasSemanaKeys]
  );

  const toggleDay = useCallback((dayNum) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(dayNum)) {
        return prevSelectedDays.filter((day) => day !== dayNum);
      } else {
        return [...prevSelectedDays, dayNum];
      }
    });
  }, []);

  const getSelectedDaysText = useCallback(() => {
    if (selectedDays.length === 0) {
      return "Selecione os dias";
    }
    return selectedDays.map((dayNum) => diasSemanaMap[dayNum]).join(", ");
  }, [selectedDays, diasSemanaMap]);

  useEffect(() => {
    if (currentMode === "periodica") {
      const newCalculatedValidDays = getDaysInRange(
        dataInicioPeriodica,
        dataFimPeriodica
      );

      const areValidDaysEqual =
        validDays.length === newCalculatedValidDays.length &&
        validDays.every((val, index) => val === newCalculatedValidDays[index]);

      if (!areValidDaysEqual) {
        setValidDays(newCalculatedValidDays);

        setSelectedDays((prevSelectedDays) => {
          const filteredDays = prevSelectedDays.filter((day) =>
            newCalculatedValidDays.includes(day)
          );
          const areSelectedDaysEqual =
            filteredDays.length === prevSelectedDays.length &&
            filteredDays.every((val, index) => val === prevSelectedDays[index]);
          if (!areSelectedDaysEqual) {
            return filteredDays;
          }
          return prevSelectedDays;
        });
      }
    }
  }, [
    dataInicioPeriodica,
    dataFimPeriodica,
    currentMode,
    getDaysInRange,
    validDays,
  ]);

  const handleReserva = useCallback(async () => {
    setLoading(true);

    if (horaFim.getTime() <= horaInicio.getTime()) {
      setModalInfo({
        type: "error",
        title: "Erro de Hora",
        message: "A Hora de Fim deve ser posterior à Hora de Início.",
      });
      setModalVisible(true);
      setLoading(false);
      return;
    }

    let reserva;
    try {
      if (currentMode === "simples") {
        const formattedData = format(dataSimples, "yyyy-MM-dd");
        const formattedHoraInicio = formatarHoraComSegundosZero(horaInicio);
        const formattedHoraFim = formatarHoraComSegundosZero(horaFim);

        reserva = {
          data: formattedData,
          hora_inicio: formattedHoraInicio,
          hora_fim: formattedHoraFim,
          fk_id_usuario: idUsuario,
          fk_id_sala: idSala,
        };

        console.log("Reserva:", reserva);
        const response = await api.postReserva(reserva);
        setModalInfo({
          type: "success",
          title: "Reserva Confirmada!",
          message: response.data.message,
        });
      } else {
        if (dataFimPeriodica.getTime() < dataInicioPeriodica.getTime()) {
          setModalInfo({
            type: "error",
            title: "Erro de Data",
            message:
              "A Data de Fim deve ser posterior ou igual à Data de Início.",
          });
          setModalVisible(true);
          setLoading(false);
          return;
        }
        if (selectedDays.length === 0) {
          setModalInfo({
            type: "error",
            title: "Erro de Dias da Semana",
            message:
              "Selecione pelo menos um dia da semana para a reserva periódica.",
          });
          setModalVisible(true);
          setLoading(false);
          return;
        }

        const formattedDataInicio = format(dataInicioPeriodica, "yyyy-MM-dd");
        const formattedDataFim = format(dataFimPeriodica, "yyyy-MM-dd");
        const formattedHoraInicio = formatarHoraComSegundosZero(horaInicio);
        const formattedHoraFim = formatarHoraComSegundosZero(horaFim);

        let diasSemanaToSend =
          selectedDays.length === 1 ? selectedDays[0] : selectedDays;

        reserva = {
          data_inicio: formattedDataInicio,
          data_fim: formattedDataFim,
          hora_inicio: formattedHoraInicio,
          hora_fim: formattedHoraFim,
          fk_id_usuario: idUsuario,
          fk_id_sala: idSala,
          dias_semana: diasSemanaToSend,
        };
        const response = await api.postReservaPeriodica(reserva);
        setModalInfo({
          type: "success",
          title: "Reserva Confirmada!",
          message: response.data.message,
        });
      }
      setModalVisible(true);
    } catch (error) {
      setModalInfo({
        type: "error",
        title: "Erro na Reserva",
        message:
          error.response?.data?.error ||
          "Erro desconhecido ao reservar a sala.",
      });
      setModalVisible(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    currentMode,
    dataSimples,
    dataInicioPeriodica,
    dataFimPeriodica,
    horaInicio,
    horaFim,
    idUsuario,
    idSala,
    selectedDays,
    formatarHoraComSegundosZero,
  ]);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    if (modalInfo.type === "success") {
      navigate("/principal");
      onClose();
    }
  }, [modalInfo.type, navigate, onClose]);

  function getStyles() {
    return {
      modalContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      },
      modalBox: {
        position: "relative",
        width: { xs: "90%", sm: 400, md: 380 },
        backgroundColor: "#fff",
        borderRadius: 4,
        padding: { xs: 3, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
        outline: "none",
      },
      closeButton: {
        position: "absolute",
        top: 30,
        right: 40,
        color: "#616161",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      },
      icon: {
        fontSize: 60,
        color: "rgba(177, 16, 16, 1)",
        marginBottom: 1,
      },
      title: {
        fontWeight: 700,
        color: "#212121",
        marginBottom: 0.5,
      },
      subTitle: {
        fontSize: "1rem",
        color: "#424242",
        marginBottom: 3,
        textAlign: "center",
      },
      modeToggleContainer: {
        marginBottom: 3,
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
          fontSize: "0.9rem",
          fontWeight: "bold",
          color: "#555",
          paddingY: "12px",
        },
      },
      inputGrid: {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
        gap: 2,
        width: "100%",
        maxWidth: "380px",
        marginBottom: 3,
      },
      inputGroupFullWidth: {
        width: "100%",
        maxWidth: "380px",
        marginBottom: 3,
      },
      summary: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        padding: "12px 16px",
        width: "calc(100% - 35px)",
        maxWidth: "380px",
        marginTop: 1,
        marginBottom: 3,
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
        flexWrap: "wrap",
        textAlign: "center",
      },
      reserveButton: {
        width: { xs: "80%", sm: "60%" },
        padding: "12px 20px",
        borderRadius: 10,
        fontWeight: 700,
        fontSize: "1.05rem",
        backgroundColor: "rgba(177, 16, 16, 1)",
        color: "#fff",
        marginTop: 2,
        transition:
          "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#b11010",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(177, 16, 16, 0.4)",
        },
        "&:disabled": {
          backgroundColor: "rgba(177, 16, 16, 0.5)",
          color: "#f0f0f0",
          cursor: "not-allowed",
          transform: "none",
          boxShadow: "none",
        },
      },
      pickerTextField: {
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#f5f5f5",
          "& fieldset": {
            borderColor: "#ddd",
          },
          "&:hover fieldset": {
            borderColor: "#bbb",
          },
          "&.Mui-focused fieldset": {
            borderColor: "rgb(177, 16, 16)",
          },
        },
      },
    };
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Modal open={isOpen} onClose={onClose} sx={styles.modalContainer}>
        <Box sx={styles.modalBox}>
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>

          <EventAvailableIcon sx={styles.icon} />
          <Typography variant="h5" sx={styles.title}>
            Reservar Sala
          </Typography>
          <Typography variant="subtitle1" sx={styles.subTitle}>
            {roomNome}
          </Typography>

          <ToggleButtonGroup
            value={currentMode}
            exclusive
            onChange={(event, newMode) => {
              if (newMode !== null) {
                setCurrentMode(newMode);
              }
            }}
            aria-label="reservation mode"
            sx={styles.modeToggleContainer}
          >
            <ToggleButton value="simples" aria-label="simple reservation">
              Reserva Simples
            </ToggleButton>
            <ToggleButton value="periodica" aria-label="periodic reservation">
              Reserva Periódica
            </ToggleButton>
          </ToggleButtonGroup>

          {currentMode === "simples" ? (
            <>
              <Box
                sx={{
                  ...styles.inputGrid,
                  gridTemplateColumns: { xs: "1fr", sm: "1fr" },
                }}
              >
                <DatePicker
                  value={dataSimples}
                  onChange={(newValue) => newValue && setDataSimples(newValue)}
                  minDate={getToday()}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      label: "Data",
                      fullWidth: true,
                      sx: styles.pickerTextField,
                    },
                  }}
                />
              </Box>

              <Box sx={styles.inputGrid}>
                <TimePicker
                  value={horaInicio}
                  onChange={(newValue) => {
                    if (newValue) {
                      const ajustada = new Date(newValue);
                      ajustada.setSeconds(0);
                      ajustada.setMilliseconds(0);
                      setHoraInicio(ajustada);
                      ajustarHoraFim(ajustada);
                    }
                  }}
                  ampm={false}
                  slotProps={{
                    textField: {
                      label: "Início",
                      fullWidth: true,
                      sx: styles.pickerTextField,
                    },
                  }}
                />

                <TimePicker
                  value={horaFim}
                  onChange={(newValue) => {
                    if (newValue) {
                      const ajustada = new Date(newValue);
                      ajustada.setSeconds(0);
                      ajustada.setMilliseconds(0);
                      setHoraFim(ajustada);
                    }
                  }}
                  ampm={false}
                  minTime={new Date(horaInicio.getTime() + 60 * 60 * 1000)}
                  slotProps={{
                    textField: {
                      label: "Fim",
                      fullWidth: true,
                      sx: styles.pickerTextField,
                    },
                  }}
                />
              </Box>

              <Box sx={styles.summary}>
                <CalendarMonthIcon
                  fontSize="small"
                  sx={{ color: "rgba(177, 16, 16, 0.8)" }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: "#455A64",
                    flexShrink: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {formatarDataExibicao(dataSimples)} das{" "}
                  {formatarHoraExibicao(horaInicio)} às{" "}
                  {formatarHoraExibicao(horaFim)}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box sx={styles.inputGrid}>
                <DatePicker
                  value={dataInicioPeriodica}
                  onChange={(newValue) =>
                    newValue && setDataInicioPeriodica(newValue)
                  }
                  minDate={getToday()}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      label: "Data Início",
                      fullWidth: true,
                      sx: styles.pickerTextField,
                    },
                  }}
                />
                <DatePicker
                  value={dataFimPeriodica}
                  onChange={(newValue) =>
                    newValue && setDataFimPeriodica(newValue)
                  }
                  minDate={dataInicioPeriodica}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      label: "Data Fim",
                      fullWidth: true,
                      sx: styles.pickerTextField,
                    },
                  }}
                />
              </Box>

              <Box sx={styles.inputGrid}>
                <TimePicker
                  value={horaInicio}
                  onChange={(newValue) => {
                    if (newValue) {
                      const ajustada = new Date(newValue);
                      ajustada.setSeconds(0);
                      ajustada.setMilliseconds(0);
                      setHoraInicio(ajustada);
                      ajustarHoraFim(ajustada);
                    }
                  }}
                  ampm={false}
                  slotProps={{
                    textField: {
                      label: "Início",
                      fullWidth: true,
                      sx: styles.pickerTextField,
                    },
                  }}
                />

                <TimePicker
                  value={horaFim}
                  onChange={(newValue) => {
                    if (newValue) {
                      const ajustada = new Date(newValue);
                      ajustada.setSeconds(0);
                      ajustada.setMilliseconds(0);
                      setHoraFim(ajustada);
                    }
                  }}
                  ampm={false}
                  minTime={new Date(horaInicio.getTime() + 60 * 60 * 1000)}
                  slotProps={{
                    textField: {
                      label: "Fim",
                      fullWidth: true,
                      sx: styles.pickerTextField,
                    },
                  }}
                />
              </Box>

              <Box sx={styles.inputGroupFullWidth}>
                <TextField
                  label="Dias da Semana"
                  fullWidth
                  value={getSelectedDaysText()}
                  onClick={() => setShowDaySelectionModal(true)}
                  InputProps={{
                    readOnly: true,
                    endAdornment: <ArrowDropDownIcon sx={{ color: "#888" }} />,
                    sx: styles.pickerTextField,
                  }}
                />
              </Box>

              <Box sx={styles.summary}>
                <CalendarMonthIcon
                  fontSize="small"
                  sx={{ color: "rgba(177, 16, 16, 0.8)" }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: "#455A64",
                    flexShrink: 1,
                    flexWrap: "wrap",
                  }}
                >
                  De {formatarDataExibicao(dataInicioPeriodica)} a{" "}
                  {formatarDataExibicao(dataFimPeriodica)}, na(s){" "}
                  {getSelectedDaysText()}, das{" "}
                  {formatarHoraExibicao(horaInicio)} às{" "}
                  {formatarHoraExibicao(horaFim)}
                </Typography>
              </Box>
            </>
          )}

          <Button
            variant="contained"
            onClick={handleReserva}
            sx={styles.reserveButton}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirmar Reserva"
            )}
          </Button>
        </Box>
      </Modal>

      <CustomModal
        open={modalVisible}
        onClose={handleModalClose}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
      />

      {currentMode === "periodica" && (
        <DiasModal
          visible={showDaySelectionModal}
          onClose={() => setShowDaySelectionModal(false)}
          validDays={validDays}
          selectedDays={selectedDays}
          toggleDay={toggleDay}
          diasSemanaMap={diasSemanaMap}
        />
      )}
    </LocalizationProvider>
  );
}

function getStyles() {
  return {
    modalContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(8px)",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalBox: {
      position: "relative",
      width: { xs: "90%", sm: 400, md: 450 },
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: { xs: 3, sm: 4 },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
      outline: "none",
    },
    closeButton: {
      position: "absolute",
      top: 30,
      right: 40,
      color: "#616161",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
    },
    icon: {
      fontSize: 60,
      color: "rgba(177, 16, 16, 1)",
      marginBottom: 1,
    },
    title: {
      fontWeight: 700,
      color: "#212121",
      marginBottom: 0.5,
    },
    subTitle: {
      fontSize: "1rem",
      color: "#424242",
      marginBottom: 3,
      textAlign: "center",
    },
    modeToggleContainer: {
      marginBottom: 3,
      width: "100%",
      borderRadius: 10,
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
        fontSize: "0.9rem",
        fontWeight: "bold",
        color: "#555",
        paddingY: "12px",
      },
    },
    inputGrid: {
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
      gap: 2,
      width: "100%",
      maxWidth: "380px",
      marginBottom: 3,
    },
    inputGroupFullWidth: {
      width: "100%",
      maxWidth: "380px",
      marginBottom: 3,
    },
    summary: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      backgroundColor: "#f5f5f5",
      borderRadius: 8,
      padding: "12px 16px",
      width: "calc(100% - 35px)",
      maxWidth: "380px",
      marginTop: 1,
      marginBottom: 3,
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
      flexWrap: "wrap",
      textAlign: "center",
    },
    reserveButton: {
      width: { xs: "80%", sm: "60%" },
      padding: "12px 20px",
      borderRadius: 10,
      fontWeight: 700,
      fontSize: "1.05rem",
      backgroundColor: "rgba(177, 16, 16, 1)",
      color: "#fff",
      marginTop: 2,
      transition:
        "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: "#b11010",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(177, 16, 16, 0.4)",
      },
      "&:disabled": {
        backgroundColor: "rgba(177, 16, 16, 0.5)",
        color: "#f0f0f0",
        cursor: "not-allowed",
        transform: "none",
        boxShadow: "none",
      },
    },
    pickerTextField: {
      "& .MuiOutlinedInput-root": {
        backgroundColor: "#f5f5f5",
        "& fieldset": {
          borderColor: "#ddd",
        },
        "&:hover fieldset": {
          borderColor: "#bbb",
        },
        "&.Mui-focused fieldset": {
          borderColor: "rgb(177, 16, 16)",
        },
      },
    },
  };
}