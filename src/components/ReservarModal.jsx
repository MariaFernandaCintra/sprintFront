import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { getToday } from "../utils/dateUtils";
import CustomModal from "./CustomModal";

import { format, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [idUsuario] = useState(localStorage.getItem("idUsuario")); // Pega diretamente do localStorage
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
      fk_id_usuario: idUsuario, // Usa diretamente do localStorage
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
      backgroundColor: "rgba(161, 161, 161, 0.4)",
      backdropFilter: "blur(5px)",
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
      width: 380,
      height: "auto",
      backgroundColor: "rgba(100, 100, 100, 0.5)",
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(214, 214, 214, 0.1)",
      p: 4,
      borderRadius: 20,
    },
    title: {
      fontWeight: "bold",
      color: "white",
      marginBottom: 2,
      fontSize: 32,
    },
    subTitle: {
      fontSize: 22,
      color: "white",
      marginBottom: 1,
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
