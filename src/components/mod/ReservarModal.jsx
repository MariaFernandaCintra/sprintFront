
import { getToday } from "../../utils/dateUtils";
import { getIdFromToken } from "../../auth/auth";
import api from "../../services/axios";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";

import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomModal from "./CustomModal";

export default function ReservarModal({ isOpen, onClose, idSala, roomNome }) {
  const styles = getStyles();

  const [data, setData] = useState(new Date());
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
  const idUsuario = getIdFromToken();
  const navigate = useNavigate();

  function ajustarHoraFim() {
    const novaHoraFim = new Date(horaInicio.getTime() + 60 * 60 * 1000);
    setHoraFim(novaHoraFim);
    setHoraFim(novaHoraFim);
  }

  function formatarHoraComSegundosZero(date) {
    const hora = date.getHours().toString().padStart(2, "0");
    const minuto = date.getMinutes().toString().padStart(2, "0");
    return `${hora}:${minuto}:00`;
  }

  async function handleReserva() {
    if (horaFim <= horaInicio) {
      ajustarHoraFim();
    }

    const reserva = {
      data: data.toISOString().split("T")[0],
      hora_inicio: formatarHoraComSegundosZero(horaInicio),
      hora_fim: formatarHoraComSegundosZero(horaFim),
      fk_id_usuario: idUsuario,
      fk_id_sala: idSala,
    };

    try {
      const response = await api.postReserva(reserva);
      setModalInfo({
        type: "success",
        title: "Sucesso",
        message: response.data.message,
      });
      setModalVisible(true);
    } catch (error) {
      setModalInfo({
        type: "error",
        title: "Erro",
        message: error.response?.data?.error || "Erro desconhecido",
      });
      setModalVisible(true);
    }
  }

  function handleModalClose() {
    setModalVisible(false);
    if (modalInfo.type === "success") {
      navigate("/principal");
      onClose();
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Modal open={isOpen} onClose={onClose} sx={styles.modalContainer}>
        <Box sx={styles.modalBox}>
          <Typography variant="h6" sx={styles.title}>
            Reservar Sala
          </Typography>

          <Typography variant="subtitle2" sx={styles.subTitle}>
            {roomNome}
          </Typography>

          <Typography variant="subtitle2" sx={styles.inputTitle}>
            Data
          </Typography>
          <DatePicker
            value={data}
            sx={styles.input}
            onChange={(newValue) => {
              if (newValue) setData(newValue);
            }}
            minDate={getToday()}
            format="dd/MM/yyyy"
            renderInput={(params) => (
              <TextField fullWidth margin="normal" {...params} />
            )}
          />

          <Typography variant="subtitle2" sx={styles.inputTitle}>
            Hora de Início
          </Typography>
          <TimePicker
            value={horaInicio}
            sx={styles.input}
            onChange={(newValue) => {
              if (newValue) {
                const ajustada = new Date(newValue);
                ajustada.setSeconds(0);
                setHoraInicio(ajustada);
                ajustarHoraFim();
              }
            }}
            ampm={false}
            renderInput={(params) => (
              <TextField fullWidth margin="normal" {...params} />
            )}
          />

          <Typography variant="subtitle2" sx={styles.inputTitle}>
            Hora de Fim
          </Typography>
          <TimePicker
            value={horaFim}
            sx={styles.input}
            onChange={(newValue) => {
              if (newValue) {
                const ajustada = new Date(newValue);
                ajustada.setSeconds(0);
                setHoraFim(ajustada);
              }
            }}
            ampm={false}
            renderInput={(params) => (
              <TextField fullWidth margin="normal" {...params} />
            )}
          />

          <Box sx={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
              sx={styles.buttonCancelar}
            >
              CANCELAR
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReserva}
              sx={styles.buttonReservar}
            >
              RESERVAR
            </Button>
          </Box>
        </Box>
      </Modal>

      <CustomModal
        open={modalVisible}
        onClose={handleModalClose}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type}
      />
    </LocalizationProvider>
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
      alignItems: "center",
      justifyContent: "center",
      width: 350,
      maxWidth: "90%",
      padding: 4,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
      outline: "none",
      animation: "scaleIn 0.2s ease-out",
      "@keyframes scaleIn": {
        "0%": { transform: "scale(0.95)" },
        "100%": { transform: "scale(1)" },
      },
    },
    title: {
      fontWeight: 600,
      color: "#263238",
      marginBottom: 1.5,
      fontSize: "2rem",
      textAlign: "center",
    },
    subTitle: {
      fontSize: "1.1rem",
      color: "#546E7A",
      marginBottom: 3,
      textAlign: "center",
    },
    inputTitle: {
      color: "#607D8B",
      marginTop: 1.5,
      marginBottom: 0.8,
      fontSize: "0.85rem",
      alignSelf: "flex-start",
      marginLeft: "10%",
    },
    input: {
      width: "80%",
      marginBottom: 1.5,
      "& .MuiOutlinedInput-root": {
        borderRadius: 8,
        "& fieldset": {
          borderColor: "#E0E0E0",
        },
        "&:hover fieldset": {
          borderColor: "#B0BEC5",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#EF5350",
          borderWidth: "2px",
        },
        "& .MuiInputBase-input": {
          padding: "10px 12px",
          color: "#455A64",
        },
      },
      "& .MuiSvgIcon-root": {
        color: "#90A4AE",
      },
    },
    buttonContainer: {
      marginTop: 3,
      marginBottom: 1,
      display: "flex",
      gap: 2.5,
      justifyContent: "center",
      width: "80%",
    },
    buttonCancelar: {
      backgroundColor: "#ECEFF1",
      color: "#546E7A",
      fontWeight: 500,
      padding: "10px 20px",
      borderRadius: 8,
      textTransform: "none",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#CFD8DC",
        boxShadow: "none",
      },
      "&:active": {
        backgroundColor: "#B0BEC5",
      },
    },
    buttonReservar: {
      backgroundColor: "#EF5350",
      color: "#FFFFFF",
      fontWeight: 500,
      padding: "10px 20px",
      borderRadius: 8,
      textTransform: "none",
      boxShadow: "0 4px 12px rgba(239, 83, 80, 0.3)",
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