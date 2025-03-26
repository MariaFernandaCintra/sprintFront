import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";


const Header = ({}) => {
  const styles = getStyles();
  return (
    <Box sx={styles.header}>
      <Button component={Link} to="/" sx={styles.buttonHome}>
        <HomeIcon sx={styles.HomeIcon} />
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
    buttonHome: {
      mr: 8,
    },
    HomeIcon: {
      width: 50, // Tamanho do círculo
      height: 50,
      borderRadius: "50%",
      backgroundColor: "darkred", // Cor de fundo do círculo
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "4px solid white", // Borda branca ao redor
      color: "white",
      padding: 0.5,
    },
  };
}

export default Header;
