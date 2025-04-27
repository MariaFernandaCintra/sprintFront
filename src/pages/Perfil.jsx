// React
import * as React from "react";
import { useState, useEffect } from "react";

// React Router
import { useNavigate, Link } from "react-router-dom";

// MUI - Componentes
import {
  Box,
  Button,
  Container,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  MenuItem,
  Select,
} from "../components";

// MUI - Ícones
import {
  Visibility,
  VisibilityOff,
  ExitToAppIcon,
} from "../components";

// Assets e serviços
import logo from "../../img/logo.png";
import api from "../services/axios";

function Perfil() {
  const styles = getStyles();
  useEffect(() => {
    document.title = "Perfil | SENAI";
  }, []);
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();
  const [reservaSelecionada, setReservaSelecionada] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    NIF: "",
    senha: "",
  });

  useEffect(() => {
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

  useEffect(() => {
    const fetchUsuario = async () => {
      const idUsuario = localStorage.getItem("idUsuario");

      if (!idUsuario) {
        console.error("ID do usuário não encontrado no localStorage");
        return;
      }

      try {
        const response = await api.getUsuarioById(idUsuario);
        setUsuario(response.data.usuario);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUsuario();
  }, []);

  const handleChangeReserva = (event) => {
    const valor = event.target.value;
    if (valor === "verTodas") {
      navigate("/reservas");
    } else {
      setReservaSelecionada(valor);
    }
  };

  return (
    <Container component="main" sx={styles.container}>
      <Box sx={styles.header}>
        <Button component={Link} to="/principal" sx={styles.buttonToPrincipal}>
          <ExitToAppIcon sx={styles.IconeLogout} />
        </Button>
      </Box>
      <Box component="form" sx={styles.form} noValidate>
        <Box component="img" src={logo} alt="Logo" sx={styles.logo} />
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
          value={usuario.senha || ""}
          sx={{ ...styles.textField, mt: 2 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setMostrarSenha((previousState) => !previousState)
                    }
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
        <Select
          value={reservaSelecionada}
          onChange={handleChangeReserva}
          displayEmpty
          sx={{ ...styles.textField, mt: 2, color: "gray" }}
        >
          <MenuItem disabled value="">
            Minhas Reservas
          </MenuItem>
          {reservas.slice(0, 4).map((reserva) => (
            <MenuItem
              key={reserva.id}
              value={reserva.id}
              sx={{ fontWeight: "bold", color: "gray" }}
            >
              {reserva.sala} - {reserva.data}
            </MenuItem>
          ))}
          <MenuItem
            value="verTodas"
            sx={{ fontWeight: "bold", color: "darkred" }}
          >
            Ver todas as reservas
          </MenuItem>
        </Select>
        <Button variant="contained" sx={styles.buttonAtualizar}>
          Atualizar Perfil
        </Button>
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
      display: "flex",
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      minHeight: "75vh",
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
    Iconeperfil: {
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
    logo: {
      width: "280px",
      height: "auto",
      mb: 4,
      border: 5,
      borderColor: "white",
      borderRadius: 4,
    },
    form: {
      mt: 5,
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
      borderRadius: 4,
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
    footer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "7vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTop: "7px solid white",
      mt: 5,
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Perfil;
