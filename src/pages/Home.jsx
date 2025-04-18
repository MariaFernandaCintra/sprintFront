import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Footer from "../components/Footer"

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
      <Footer />
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
      length: "100%",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "end",
      borderBottom: "7px solid white",
    },
    logo: {
      width: "230px",
      height: "auto",
      marginRight: "1370px",
      border: "4.5px solid white",
      borderRadius: 15,
    },
    buttonToCadastro: {
      "&.MuiButton-root": {
        border: "2.5px solid white",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 140,
      height: 55,
      fontWeight: 600,
      fontSize: 17,
      borderRadius: 15,
      textTransform: "none",
    },
    buttonToLogin: {
      "&.MuiButton-root": {
        border: "2.5px solid white",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      mr: 8,
      ml: 3,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 90,
      height: 55,
      fontWeight: 600,
      fontSize: 17,
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
  };
}

export default Home;
