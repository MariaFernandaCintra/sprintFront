import React from "react";
import home from "../../img/iconehome.png";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Header = () => {
  const styles = getStyles();
  return (
    <Box sx={styles.header}>
      <Button component={Link} to="/" sx={styles.buttonHome}>
        <img src={home} alt="Home" style={{ width: "65px", height: "65px" }} />
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
      mr:8,
    },
  };
}

export default Header;
