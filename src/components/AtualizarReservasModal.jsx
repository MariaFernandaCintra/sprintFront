import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import api from "../services/axios";

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
    const fk_id_usuario = Number(localStorage.getItem("idUsuario"));

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
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(10px)",
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
      width: 320,
      height: 500,
      backgroundColor: "rgba(44, 44, 44, 0.8)",
      boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      p: 4,
      borderRadius: 20,
    },
    title: {
      fontWeight: "bold",
      color: "white",
      marginBottom: 2,
      fontSize: 29,
    },
    inputTitle: {
      color: "white",
      marginTop: 1,
      marginBottom: 1,
      fontSize: 15,
    },
    input: {
      borderRadius: 2,
      mb: 0.5,
      mt: 1,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      width: "80%",
      color: "#fff",
      "& .MuiInputBase-input": {
        padding: "12px 16px",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(80, 80, 80, 0.7)",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(150, 150, 150, 0.7)",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#64b5f6",
      },
    },
    buttonContainer: {
      mt: 3,
      mb: 2,
      gap: 5,
      display: "flex",
      justifyContent: "space-between",
    },
    buttonCancelar: {
      backgroundColor: "rgba(209, 19, 19, 0.7)",
      color: "#eee",
      fontWeight: 1000,
      padding: 1.5,
      borderRadius: 6,
      "&:hover": {
        backgroundColor: "rgba(177, 16, 16, 0.7)",
      },
    },
    buttonReservar: {
      backgroundColor: "rgba(209, 19, 19, 0.7)",
      color: "#eee",
      fontWeight: 500,
      padding: 1.5,
      borderRadius: 6,
      "&:hover": {
        backgroundColor: "rgba(177, 16, 16, 0.7)",
      },
    },
  };
}
