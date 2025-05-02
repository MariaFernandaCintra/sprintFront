// React
import * as React from "react";
import { useState, useEffect } from "react";

// React Router
import { Link } from "react-router-dom";

// MUI - Componentes
import {
  Box,
  Button,
  Container,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from "../components";

// MUI - Ícones
import { Visibility, VisibilityOff, ExitToAppIcon } from "../components";

// Assets e serviços
import logo from "../../img/logo.png";
import api from "../services/axios";

// Modal
import ReservasUsuarioModal from "../components/ReservasUsuarioModal"; // Ajuste o caminho conforme seu projeto

function Perfil() {
  const styles = getStyles();

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    NIF: "",
    senha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [openReservasModal, setOpenReservasModal] = useState(false);

  useEffect(() => {
    document.title = "Perfil | SENAI";
    const fetchDados = async () => {
      const idUsuario = localStorage.getItem("idUsuario");
      if (!idUsuario) return;

      try {
        const responseUsuario = await api.getUsuarioById(idUsuario);
        setUsuario(responseUsuario.data.usuario);

        const responseReservas = await api.getUsuarioReservaById(idUsuario);
        setReservas(responseReservas.data.reservas || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, []);

  return (
    <Container component="main" sx={styles.container}>
      <Box sx={styles.header}>
        <Button component={Link} to="/principal" sx={styles.buttonToPrincipal}>
          <ExitToAppIcon sx={styles.IconeLogout} />
        </Button>
      </Box>
      <Box component="form" sx={styles.body}>
        <Box component="form" sx={styles.form} noValidate>
        <img src={logo} alt="Logo" style={styles.logo} />
          <TextField
            id="nome"
            placeholder="nome"
            name="nome"
            margin="normal"
            disabled
            value={usuario.nome || ""}
            sx={styles.textField}
          />
          <TextField
            id="email"
            placeholder="e-mail"
            name="email"
            margin="normal"
            disabled
            value={usuario.email || ""}
            sx={styles.textField}
          />
          <TextField
            id="NIF"
            placeholder="NIF"
            name="NIF"
            margin="normal"
            disabled
            value={usuario.NIF || ""}
            sx={styles.textField}
          />
          <TextField
            id="senha"
            type={mostrarSenha ? "text" : "password"}
            placeholder="senha"
            name="senha"
            margin="normal"
            disabled
            value={usuario.senha}
            sx={styles.passwordField}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setMostrarSenha((prev) => !prev)}
                      edge="end"
                      sx={{ color: "gray", mr: 0.1 }}
                    >
                      {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button variant="contained" sx={styles.buttonAtualizar}>
            Atualizar Perfil
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenReservasModal(true)}
            sx={styles.buttonMinhasReservas}
          >
            Minhas Reservas
          </Button>
        </Box>
      </Box>
      <Box sx={styles.footer}>
        <Typography sx={styles.footerText}>
          &copy; Desenvolvido por: Vinicius Fogaça, Maria Júlia e Maria Fernanda
        </Typography>
      </Box>

      {openReservasModal && (
        <ReservasUsuarioModal
          open={openReservasModal}
          onClose={() => setOpenReservasModal(false)}
          reservas={reservas}
        />
      )}
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
      display: "flex",
      flex: 1,
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
    body: { height: "78.5vh" },
    logo: {
      width: "280px",
      height: "auto",
      marginBottom: 10,
      border: "4.5px solid white",
      borderRadius: 15,
    },
    IconeLogout: {
      width: 40,
      height: 40,
      mr: 3,
      borderRadius: "50%",
      backgroundColor: "darkred",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "4px solid white",
      padding: "7px",
      color: "white",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      paddingRight: 6,
      paddingLeft: 6,
      paddingTop: 9,
      paddingBottom: 7,
      borderRadius: 10,
      mt: 10,
      height: "62.5%",
    },
    title: {
      fontWeight: 1000,
      marginBottom: 2,
      color: "rgb(202, 0, 0)",
      fontSize: 30,
      backgroundColor: "rgba(219, 112, 112, 0.67)",
      paddingTop: 1,
      paddingBottom: 1,
      paddingRight: 3,
      paddingLeft: 3,
      borderRadius: 10
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
      borderRadius: 4,
    },
    passwordField: {
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
      borderRadius: 4,
      color: "gray",
    },
    selectField: {
      mt: 2,
      width: "35vh",
      height: "5.5vh",
      backgroundColor: "white",
      display: "flex",
      borderRadius: 4,
      color: "gray",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      textTransform: "none",
    },
    buttonAtualizar: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      mt: 4,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 180,
      height: 45,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    buttonMinhasReservas: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        backgroundColor: "transparent",
        "&:hover": {
          border: "none",
          backgroundColor: "transparent",
          boxShadow: "none",
          textDecoration: "underline",
          textDecorationColor: "rgba(177, 16, 16, 1)",
        },
      },
      color: "rgba(177, 16, 16, 1)",
      width: 180,
      height: 40,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },

    footer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "9vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTop: "7px solid white",
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Perfil;
