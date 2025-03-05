import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/axios";
import logo from "../../img/logo.png";

function Cadastro() {
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    NIF: "",
    senha: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Cadastro();
  };

  const navigate = useNavigate();

  async function Cadastro() {
    await api.postCadastro(usuario).then(
      (response) => {
        alert(response.data.message);
        navigate("/principal");
      },
      (error) => {
        console.log(error);
        alert(error.response.data.error);
      }
    );
  }

  return (
    <Container
      component="main"
      sx={{
        mt: -1,
        mb: -1,
        ml: -1,
        mr: -1,
        backgroundImage: `url(../../img/fundo.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "300vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        maxHeight: "100vh",
        minWidth: "100.85%",
      }}
    >
      <Box
        sx={{
          mt: -10,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          component="form"
          sx={{
            mt: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            paddingRight: 6,
            paddingLeft: 6,
            paddingTop: 9,
            paddingBottom: 5,
            borderRadius: 10,
          }}
          onSubmit={handleSubmit}
          noValidate
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: "280px",
              height: "auto",
              mb: 4,
              border: 7,
              borderColor: "white",
              borderRadius: 4,
            }}
          />
          <TextField
            required
            fullWidth
            id="nome"
            placeholder="  nome"
            name="nome"
            margin="normal"
            value={usuario.nome}
            onChange={onChange}
            sx={{
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
            }}
          />
          <TextField
            required
            fullWidth
            id="email"
            placeholder="  e-mail"
            name="email"
            margin="normal"
            value={usuario.email}
            onChange={onChange}
            sx={{
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
            }}
          />
          <TextField
            required
            fullWidth
            id="NIF"
            placeholder="  NIF"
            name="NIF"
            margin="normal"
            value={usuario.NIF}
            onChange={onChange}
            sx={{
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
            }}
          />
          <TextField
            required
            fullWidth
            id="senha"
            placeholder="  senha"
            name="senha"
            type="senha"
            margin="normal"
            value={usuario.senha}
            onChange={onChange}
            sx={{
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
            }}
          />
          <Button
            sx={{
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
            }}
            type="submit"
            variant="contained"
          >
            Cadastrar-se
          </Button>
          <Button
            component={Link}
            to="/login"
            sx={{
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
                textDecorationThickness: "1.5px",
                textUnderlineOffset: "4px",
                color: "rgb(167, 63, 63)",
              },
              "&:focus": {
                textDecoration: "underline",
              },
              "&:active": {
                textDecoration: "underline",
              },
            }}
            type="submit"
            variant="text"
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Cadastro;
