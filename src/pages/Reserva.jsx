import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useState } from "react";
import logo from "../../img/logo.png";
import Footer from "../components/Footer";
import Header from "../components/Header";
import api from "../services/axios";

function Reserva() {
  const styles = getStyles();
  const [reserva, setReserva] = useState({
    fk_id_usuario: "",
    fk_id_sala: "",
    data: "",
    hora_inicio: "",
    hora_fim: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setReserva({ ...reserva, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Reserva();
  };

  async function Reserva() {
    await api.postReserva(reserva).then(
      (response) => {
        alert(response.data.message);
      },
      (error) => {
        console.log(error);
        alert(error.response.data.error);
      }
    );
  }

  return (
    <Container component="main" sx={styles.container}>
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
      height: "auto",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "80.6vh",
      minWidth: "100%",
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
      "& input::placeholder": {
        fontSize: "17px",
        color: "black",
      },
      width: "35vh",
      height: "5.5vh",
      backgroundColor: "white",
      display: "flex",
      border: "0px transparent",
      borderRadius: 10,
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
  };
}

export default Reserva;
