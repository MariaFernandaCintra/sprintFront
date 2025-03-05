import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import * as React from "react";
import { Link } from "react-router-dom";

function Principal() {
  return (
    <Container component="main" maxWidth="xs">
      <Button
        component={Link}
        to="/login"
        sx={{
          mt: 3,
          mb: 2,
          color: "white",
          backgroundColor: "#000000",
          display: "flex",
        }}
        fullWidth
        type="submit"    
        variant="contained"
      >
        Home
      </Button>
    </Container>
  );
}

export default Principal;
