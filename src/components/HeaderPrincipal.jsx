import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from "react-router-dom";
import logo from '../../img/logo.png'
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function Logout() {
    console.log("teste logout");
    localStorage.removeItem("authenticated");
    navigate("/");
  }

const HeaderPrincipal = ({}) => {
  const styles = getStyles();
  return (
    <Box sx={styles.header}>
            <img src={logo} alt="Logo" style={styles.logo} />
            <Button component={Link} to="/principal" sx={styles.buttonPerfil}>
              <PersonIcon sx={styles.Iconeperfil} />
            </Button>

            <Button component={Link} to="/" sx={styles.buttonHome} onClick={Logout}>
              <ExitToAppIcon sx={styles.IconeLogout} />
            </Button>
    </Box>
    
  );
};

function getStyles() {
  return {
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "210vh",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "end",
      borderBottom: "7px solid white",
    },
    logo: {
        width: "230px",
        height: "auto",
        marginRight: "1500px",
        border: "4px solid white",
        borderRadius: 15,
      },
      Iconeperfil: {
        width: 60, // Tamanho do círculo
        height: 60,
        borderRadius: "50%",
        backgroundColor: "darkred", // Cor do fundo
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "4px solid white", // Borda branca ao redor
        color: "white",
      },
      IconeLogout: {
        width: 50, // Tamanho do círculo
        height: 50,
        borderRadius: "50%",
        backgroundColor: "darkred", // Cor de fundo vermelho escuro
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "4px solid white", // Borda branca
        padding: "7px",
        color: "white"
      },
      buttonHome: {
        mr: 10,
      },
      buttonPerfil: {
        mr: 3,
      },
  };
}

export default HeaderPrincipal;
