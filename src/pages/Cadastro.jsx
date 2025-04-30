// React
import * as React from "react";
import { useEffect, useState } from "react";

// React Router
import { Link, useNavigate } from "react-router-dom";

// MUI - Componentes
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from "../components";

// MUI - Ícones
import { Visibility, VisibilityOff } from "../components";

// Componentes
import CustomModal from "../components/CustomModal";

// Assets e serviços
import logo from "../../img/logo.png";
import api from "../services/axios";

function Cadastro() {
  const styles = getStyles();
  useEffect(() => {
    document.title = "Cadastro | SENAI";
  }, []);

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    NIF: "",
    senha: "",
    confirmarSenha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

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
    CadastroUsuario();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (modalInfo.isSuccess) {
      navigate("/principal");
    }
  };

  async function CadastroUsuario() {
    await api.postCadastro(usuario).then(
      (response) => {
        setModalInfo({
          title: "Sucesso!",
          message: response.data.message,
          isSuccess: true,
          type: "success",
        });
        setModalOpen(true);
        localStorage.setItem("tokenUsuario", response.data.token);
      },
      (error) => {
        console.log(error);
        setModalInfo({
          title: "Erro!",
          message: error.response?.data?.error || "Erro ao cadastrar usuário",
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
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: "280px",
            height: "auto",
            mb: 2,
            border: 5,
            borderColor: "white",
            borderRadius: 4,
          }}
        />
        <TextField
          id="nome"
          autoComplete="off"
          label="nome"
          name="nome"
          margin="normal"
          value={usuario.nome}
          onChange={onChange}
          sx={styles.textField}
        />
        <TextField
          id="email"
          autoComplete="off"
          label="e-mail"
          name="email"
          margin="normal"
          value={usuario.email}
          onChange={onChange}
          sx={styles.textField}
        />
        <TextField
          id="NIF"
          autoComplete="off"
          label="NIF"
          type="number"
          name="NIF"
          margin="normal"
          value={usuario.NIF}
          onChange={onChange}
          sx={styles.textField}
        />
        <TextField
          id="senha"
          type={mostrarSenha ? "text" : "password"}
          autoComplete="off"
          label="senha"
          name="senha"
          margin="normal"
          value={usuario.senha}
          onChange={onChange}
          sx={styles.textField}
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
        <TextField
          id="confirmarSenha"
          label="confirmar-senha"
          name="confirmarSenha"
          type={mostrarConfirmarSenha ? "text" : "password"}
          margin="normal"
          autoComplete="off"
          value={usuario.confirmarSenha}
          onChange={onChange}
          sx={styles.textField}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setMostrarConfirmarSenha(
                        (previousState) => !previousState
                      )
                    }
                    edge="end"
                    sx={{ color: "gray", mr: 0.1 }}
                  >
                    {mostrarConfirmarSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          onClick={CadastroUsuario}
          sx={styles.buttonCadastro}
        >
          Cadastre-se
        </Button>
        <Button
          component={Link}
          to="/login"
          variant="text"
          sx={styles.buttonToLogin}
        >
          Login
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
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "80.5vh",
      minWidth: "100%",
    },
    form: {
      mt: 7.5,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      paddingRight: 6,
      paddingLeft: 6,
      paddingTop: 7,
      paddingBottom: 4,
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
      "& .MuiInputLabel-root.Mui-focused": {
        color: "white",
      },
      width: "35vh",
      height: "5.5vh",
      backgroundColor: "white",
      display: "flex",
      border: 0,
      borderRadius: 4,
    },
    buttonCadastro: {
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
      mt: 2,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 135,
      height: 45,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    buttonToLogin: {
      color: "rgb(152, 0, 0)",
      backgroundColor: "transparent",
      fontWeight: "bold",
      fontSize: 15.5,
      textDecoration: "underline",
      textDecorationThickness: "1.5px",
      textUnderlineOffset: "4px",
      mt: 1,
      textTransform: "none",
      "&:hover": {
        textDecoration: "underline",
        backgroundColor: "transparent",
        textDecorationThickness: "1.5px",
        textUnderlineOffset: "4px",
        color: "rgb(167, 63, 63)",
      },
      "&:focus": { textDecoration: "underline" },
      "&:active": { textDecoration: "underline" },
    },
  };
}

export default Cadastro;
