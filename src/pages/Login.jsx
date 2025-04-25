// React
import * as React from "react";
import { useState, useEffect } from "react";

// React Router
import { Link, useNavigate } from "react-router-dom";

// MUI - Componentes
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  IconButton,
} from "../components";

// MUI - Ícones
import { Visibility, VisibilityOff } from "../components";

// Componentes
import CustomModal from "../components/CustomModal";

// Assets e serviços
import logo from "../../img/logo.png";
import api from "../services/axios";

function Login() {
  const styles = getStyles();
  useEffect(() => {
    document.title = "Login | SENAI";
  }, []);
  const [usuario, setUsuario] = useState({ email: "", senha: "" });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: "",
    message: "",
    isSuccess: false,
    type: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    LoginUsuario();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalInfo.isSuccess) {
      navigate("/principal");
    }
  };

  async function LoginUsuario() {
    await api.postLogin(usuario).then(
      (response) => {
        setModalInfo({
          title: "Sucesso!",
          message: response.data.message,
          isSuccess: true,
          type: "success",
        });
        setModalOpen(true);
        const idUsuario = response.data.usuario.id_usuario;
        localStorage.setItem("idUsuario", idUsuario);
        localStorage.setItem("authenticated", true);
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
      <Box component="form" sx={styles.form} onSubmit={handleSubmit} noValidate>
        <Box component="img" src={logo} alt="Logo" sx={styles.logo} />
        <TextField
          id="email"
          label="e-mail"
          name="email"
          margin="normal"
          autoComplete="off"
          value={usuario.email}
          onChange={onChange}
          sx={styles.textField}
        />

        <TextField
          id="senha"
          type={mostrarSenha ? "text" : "password"}
          label="senha"
          name="senha"
          margin="normal"
          autoComplete="off"
          value={usuario.senha}
          onChange={onChange}
          sx={{
            ...styles.textField,
            mt: 3,
          }}
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
                    sx={{ color: "gray", mr: 0 }}
                  >
                    {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          onClick={LoginUsuario}
          sx={styles.buttonLogin}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/cadastro"
          sx={styles.buttonCadastro}
          variant="text"
        >
          Cadastre-se
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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "80.5vh",
      minWidth: "100%",
    },
    form: {
      mt: 19,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      paddingRight: 6,
      paddingLeft: 6,
      paddingTop: 8,
      paddingBottom: 4,
      borderRadius: 10,
    },
    logo: {
      width: "280px",
      height: "auto",
      mb: 2,
      border: 5,
      borderColor: "white",
      borderRadius: 4,
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
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#FFFFFF",
      },
      width: "35vh",
      height: "5.5vh",
      backgroundColor: "white",
      display: "flex",
      border: 0,
      borderRadius: 4,
    },
    buttonLogin: {
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
      width: 85,
      height: 45,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    buttonCadastro: {
      color: "rgb(152, 0, 0)",
      backgroundColor: "transparent",
      fontWeight: "bold",
      fontSize: 15.5,
      textDecoration: "underline",
      textDecorationThickness: "1.5px",
      textUnderlineOffset: "4px",
      mt: 2,
      textTransform: "none",
      "&:hover": {
        textDecoration: "underline",
        backgroundColor: "transparent",
        color: "rgb(167, 63, 63)",
      },
    },
  };
}

export default Login;
