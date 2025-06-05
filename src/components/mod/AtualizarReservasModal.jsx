
import { useState, useEffect } from "react";
import { getIdFromToken } from "../../auth/auth";
import api from "../../services/axios";

import { Modal, Box, Typography, Button, TextField } from "@mui/material";

import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function AtualizarReservasUsuario({
  open,
  onClose,
  reserva,
  onSuccess,
  setCustomModalOpen,
  setCustomModalTitle,
  setCustomModalMessage,
  setCustomModalType,
}) {
  const styles = getStyles();

  const [date, setDate] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFim, setHoraFim] = useState(new Date());

  useEffect(() => {
    if (reserva) {
      const [day, month, year] = reserva.data.split("-");
      const parsedDate = new Date(`${year}-${month}-${day}`);
      setDate(parsedDate);

      const [hiHour, hiMin, hiSec] = reserva.hora_inicio.split(":");
      const [hfHour, hfMin, hfSec] = reserva.hora_fim.split(":");

      const now = new Date();
      const startTime = new Date(now);
      const endTime = new Date(now);
      startTime.setHours(+hiHour, +hiMin, +hiSec || 0);
      endTime.setHours(+hfHour, +hfMin, +hfSec || 0);
      setHoraInicio(startTime);
      setHoraFim(endTime);
    }
  }, [reserva]);

  const formatarHoraComSegundosZero = (date) => {
    const hora = date.getHours().toString().padStart(2, "0");
    const minuto = date.getMinutes().toString().padStart(2, "0");
    return `${hora}:${minuto}:00`;
  };

  const handleSubmit = async () => {
    const idUsuario = getIdFromToken();
    const fk_id_usuario = Number(idUsuario);

    const reservaAtualizada = {
      data: date.toISOString().split("T")[0],
      hora_inicio: formatarHoraComSegundosZero(horaInicio),
      hora_fim: formatarHoraComSegundosZero(horaFim),
      fk_id_usuario,
    };

    try {
      const response = await api.updateReserva(
        reserva.id_reserva,
        reservaAtualizada
      );

      setCustomModalTitle("Sucesso");
      setCustomModalMessage(
        response.data?.message || "Reserva atualizada com sucesso!"
      );
      setCustomModalType("success");
      setCustomModalOpen(true);
      onSuccess();
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.error || "Não foi possível atualizar a reserva.";
      setCustomModalTitle("Erro");
      setCustomModalMessage(msg);
      setCustomModalType("error");
      setCustomModalOpen(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Modal open={open} onClose={onClose} sx={styles.modalContainer}>
        <Box sx={styles.modalBox}>
          <Typography variant="h6" sx={styles.title}>
            Atualizar Reserva
          </Typography>

          <Typography variant="subtitle2" sx={styles.inputTitle}>
            Data
          </Typography>
          <DatePicker
            value={date}
            onChange={(newValue) => {
              if (newValue) setDate(newValue);
            }}
            sx={styles.input}
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
            onChange={(newValue) => {
              if (newValue) setHoraInicio(newValue);
            }}
            ampm={false}
            sx={styles.input}
            renderInput={(params) => (
              <TextField fullWidth margin="normal" {...params} />
            )}
          />

          <Typography variant="subtitle2" sx={styles.inputTitle}>
            Hora de Fim
          </Typography>
          <TimePicker
            value={horaFim}
            onChange={(newValue) => {
              if (newValue) setHoraFim(newValue);
            }}
            ampm={false}
            sx={styles.input}
            renderInput={(params) => (
              <TextField fullWidth margin="normal" {...params} />
            )}
          />

          <Box sx={styles.buttonContainer}>
            <Button
              variant="contained"
              onClick={onClose}
              sx={styles.buttonCancelar}
            >
              CANCELAR
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={styles.buttonReservar}
            >
              SALVAR
            </Button>
          </Box>
        </Box>
      </Modal>
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
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: 360,
      maxWidth: "90%",
      padding: 4,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      outline: "none",
    },
    title: {
      fontWeight: 600,
      color: "#263238",
      marginBottom: 3,
      fontSize: "24px",
    },
    inputTitle: {
      color: "#455A64",
      marginTop: 2,
      marginBottom: 1,
      fontSize: "15px",
      alignSelf: "flex-start",
      marginLeft: "10%",
    },
    input: {
      borderRadius: 8,
      marginBottom: 1,
      marginTop: 1,
      width: "80%",
      "& .MuiInputBase-input": {
        padding: "12px 16px",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#CFD8DC",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#90A4AE",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#EF5350",
        borderWidth: "2px",
      },
    },
    buttonContainer: {
      marginTop: 4,
      display: "flex",
      justifyContent: "space-around",
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
