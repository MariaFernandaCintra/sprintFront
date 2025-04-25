// React
import * as React from "react";
import { useState, useEffect } from "react";

// React Router
import { Link } from "react-router-dom";

// MUI - Componentes
import { Box, Button, Container, TextField, Typography } from "../components";

// MUI - Ícones
import { PersonIcon, ExitToAppIcon } from "../components";

// Componentes
import CustomModal from "../components/CustomModal";

// Assets e serviços
import logo from "../../img/logo.png";
import api from "../services/axios";

function Reserva() {
  const styles = getStyles();

  useEffect(() => {
    document.title = "Reserva | SENAI";
  }, []);

  const [reserva, setReserva] = useState({
    fk_id_usuario: "",
    fk_id_sala: "",
    data: "",
    hora_inicio: "",
    hora_fim: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: "",
    message: "",
    isSuccess: false,
    type: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setReserva({ ...reserva, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    cadastrarReserva();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  async function cadastrarReserva() {
    await api.postReserva(reserva).then(
      (response) => {
        setModalInfo({
          title: "Sucesso!",
          message: response.data.message,
          isSuccess: true,
          type: "success",
        });
        setModalOpen(true);
      },
      (error) => {
        console.log(error);
        setModalInfo({
          title: "Erro!",
          message: error.response?.data?.error || "Erro ao fazer Login",
          isSuccess: false,
          type: "error",
        });
        setModalOpen(true);
      }
    );
  }

  return (
    <Container component="main" sx={styles.container}>
      <Box sx={styles.header}>
        <Button component={Link} to="/perfil" sx={styles.buttonToPerfil}>
          <PersonIcon sx={styles.IconeToPerfil} />
        </Button>

        <Button component={Link} to="/principal" sx={styles.buttonToPrincipal}>
          <ExitToAppIcon sx={styles.IconeToPrincipal} />
        </Button>
      </Box>
      <Box component="form" sx={styles.form} onSubmit={handleSubmit} noValidate>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: "280px",
            height: "auto",
            mb: 4,
            border: 5,
            borderColor: "white",
            borderRadius: 4,
          }}
        />
        <TextField
          id="fk_id_usuario"
          label="ID do Usuário"
          name="fk_id_usuario"
          margin="normal"
          value={reserva.fk_id_usuario}
          onChange={onChange}
          sx={styles.textField}
        />
        <TextField
          id="fk_id_sala"
          label="ID da Sala"
          name="fk_id_sala"
          margin="normal"
          value={reserva.fk_id_sala}
          onChange={onChange}
          sx={styles.textField}
        />
        <TextField
          id="data"
          name="data"
          label="Data"
          margin="normal"
          type="date"
          value={reserva.data}
          onChange={onChange}
          sx={styles.textField}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          id="hora_inicio"
          name="hora_inicio"
          label="Hora de Início"
          margin="normal"
          type="time"
          value={reserva.hora_inicio}
          onChange={onChange}
          sx={styles.textField}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          id="hora_fim"
          name="hora_fim"
          label="Hora de Fim"
          margin="normal"
          type="time"
          value={reserva.hora_fim}
          onChange={onChange}
          sx={styles.textField}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button type="submit" variant="contained" sx={styles.buttonReservar}>
          Reservar
        </Button>
        <CustomModal
          open={modalOpen}
          onClose={handleCloseModal}
          title={modalInfo.title}
          message={modalInfo.message}
          type={modalInfo.type}
          buttonText="Fechar"
        />
      </Box>
      <Box sx={styles.footer}>
        <Typography sx={styles.footerText}>
          &copy; Desenvolvido por: Vinicius Fogaça, Maria Júlia e Maria Fernanda
        </Typography>
      </Box>
    </Container>
  );
}

function getStyles() {
  return {
    container: {
      backgroundImage: `url(../../img/fundo.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      minWidth: "100%",
      pl: { sm: 0 },
      pr: { sm: 0 },
    },
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      borderBottom: "7px solid white",
    },
    IconeToPerfil: {
      width: 54,
      height: 54,
      borderRadius: "50%",
      backgroundColor: "darkred",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "4px solid white",
      color: "white",
    },
    buttonToPerfil: {
      mr: 0.9,
    },
    IconeToPrincipal: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "darkred",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "4px solid white",
      padding: "7px",
      color: "white",
    },
    buttonToPrincipal: {
      mr: 2,
    },
    form: {
      mt: 5.2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      paddingRight: 6,
      paddingLeft: 6,
      paddingTop: 9,
      paddingBottom: 7,
      borderRadius: 10,
    },
    textField: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": { border: "none" },
        "&:hover fieldset": { border: "none" },
        "&.Mui-focused fieldset": { border: "none" },
      },
      "& .MuiOutlinedInput-input": {
        color: "gray",
        fontSize: "16px",
      },
      "& .MuiInputLabel-shrink": {
        fontSize: "18px",
        marginTop: -1.39,
        color: "white",
      },
      "& input[type='date']": {
        color: "gray",
        fontSize: "16px",
      },
      "& input[type='time']": {
        color: "gray",
        fontSize: "16px",
      },
      "& input[type='date']::-webkit-calendar-picker-indicator": {
        filter: "invert(50%)",
      },
      "& input[type='time']::-webkit-calendar-picker-indicator": {
        filter: "invert(50%)",
      },
      width: "35vh",
      height: "5.5vh",
      backgroundColor: "white",
      display: "flex",
      border: 0,
      borderRadius: 4,
    },    
    buttonReservar: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
        "&:focus": { border: "none", outline: "none" },
        "&:active": {
          border: "none",
          outline: "none",
          boxShadow: "none",
        },
      },
      mt: 4,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 135,
      height: 45,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    footer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "7vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTop: "7px solid white",
      marginTop: "auto",
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Reserva;
