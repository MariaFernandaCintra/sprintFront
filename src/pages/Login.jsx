import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/logo.png";
import api from "../services/axios";

function Login() {
  const styles = getStyles();
  const [usuario, setUsuario] = useState({ email: "", senha: ""});
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
  };

  async function handleLogin() {
    await api.postLogin(usuario).then(
      (response) => {
        alert(response.data.message);
        localStorage.setItem("authenticated", true);
        navigate("/principal");
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
        <Box component="img" src={logo} alt="Logo" sx={styles.logo} />
        <TextField
          id="email"
          placeholder="e-mail"
          name="email"
          margin="normal"
          value={usuario.email}
          onChange={onChange}
          sx={styles.textField}
        />
        <TextField
          id="senha"
          placeholder="senha"
          name="senha"
          margin="normal"
          value={usuario.senha}
          onChange={onChange}
          sx={{ ...styles.textField, mt: 3 }}
        />
        <Button sx={styles.buttonLogin} type="submit" variant="contained">
          Entrar
        </Button>
        <Button
          component={Link}
          to="/cadastro"
          sx={styles.buttonCadastro}
          variant="text"
        >
          Cadastre-se
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
      mt: 15,
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
    logo: {
      width: "280px",
      height: "auto",
      mb: 4,
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
