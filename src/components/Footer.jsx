import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

const Footer = () => {
  const style = footerStyle;
  return (
    <Box sx={style.footer}>
      <Typography sx={style.footerText}>
        &copy; Desenvolvido por: Vinicius Fogaça, Maria Júlia e Maria Fernanda
      </Typography>
    </Box>
  );
};

const footerStyle = {
  footer: {
    mt: 9,
    backgroundColor: "rgba(177, 16, 16, 1)",
    width: "210vh",
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

export default Footer;
