// React
import * as React from "react";

// MUI - Componentes
import {
  Box,
  Typography,
} from "../components";

const Footer = () => {
  const styles = getStyles();
  return (
    <Box sx={styles.footer}>
      <Typography sx={styles.footerText}>
        &copy; Desenvolvido por: Vinicius Fogaça, Maria Júlia e Maria Fernanda
      </Typography>
    </Box>
  );
};

function getStyles() {
  return {
    footer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "7vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTop: "7px solid white",
      marginTop: "auto",
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Footer;
