import { Link } from "react-router-dom";
import logo from "../../img/logo.png";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function Home() {
  const styles = getStyles();

  return (
    <Container sx={styles.container}>
      <Box sx={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <Button
          component={Link}
          to="/cadastro"
          sx={styles.buttonToCadastro}
          variant="text"
        >
          Cadastre-se
        </Button>
        <Button
          component={Link}
          to="/login"
          sx={styles.buttonToLogin}
          variant="text"
        >
          Login
        </Button>
      </Box>
      <Box sx={styles.body}>
        <Typography sx={styles.bodyText}>
          Seja Bem-vindo ao site de Reservas do SENAI
        </Typography>
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
      backgroundImage: `url(../../img/fundoinicial.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "auto",
      minWidth: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "210vh",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "end",
      borderBottom: "5px solid white",
    },
    logo: {
      width: "230px",
      height: "auto",
      marginRight: "1370px",
      border: "4px solid white",
      borderRadius: 15,
    },
    buttonToCadastro: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 130,
      height: 45,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    buttonToLogin: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      mr: 8,
      ml: 3,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 80,
      height: 45,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    body: {
      mt: 8,
      mr: 110,
      width: "70vh",
      height: "74.2vh",
    },
    bodyText: {
      color: "white",
      fontSize: 100,
      fontWeight: 760,
    },
    footer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "210vh",
      height: "7vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTop: "5px solid white",
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Home;
