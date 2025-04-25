// React
import * as React from "react";

// React Router
import { Link } from "react-router-dom";

// MUI - Componentes e Ícones
import {
  Box,
  Button,
  HomeIcon,
} from "../components";

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
      width: "100%",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "end",
      borderBottom: "7px solid white",
    },
    buttonHome: {
      mr: 3,
    },
    HomeIcon: {
      width: 50,
      height: 50,
      borderRadius: "50%",
      backgroundColor: "darkred",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "4px solid white",
      color: "white",
      padding: 0.5,
    },
  };
}

export default Header;
