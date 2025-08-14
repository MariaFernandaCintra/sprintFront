import { useState } from "react";

import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from "@mui/icons-material";

import CloseIcon from "@mui/icons-material/Close";

export default function ConfirmarSenhaModal({ open, onClose, onConfirm }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onConfirm(password);
    setPassword("");
  };

  const styles = getStyles();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={styles.modalContainer}
    >
      <Box sx={styles.modalBox}>
        <Box sx={styles.header}>
          <Typography id="modal-title" sx={styles.title}>
            Confirmar Senha Atual
          </Typography>
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          margin="normal"
          label="Senha Atual"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={styles.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "gray" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={styles.confirmButton}
        >
          Confirmar
        </Button>
      </Box>
    </Modal>
  );
}

function getStyles() {
  return {
    modalContainer: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBox: {
      display: "flex",
      flexDirection: "column",
      width: 360,
      maxWidth: "90%",
      padding: "40px 30px",
      backgroundColor: "#FFFFFF",
      borderRadius: "20px",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      outline: "none",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 3,
    },
    title: {
      fontWeight: "bold",
      color: "#333",
      fontSize: "24px",
      textAlign: "center",
      flexGrow: 1,
    },
    closeButton: {
      color: "gray",
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    textField: {
      mb: 2,
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
        "& fieldset": {
          borderColor: "transparent",
        },
        "&:hover fieldset": {
          borderColor: "transparent",
        },
        "&.Mui-focused fieldset": {
          borderColor: "rgba(255, 0, 0, 0.5)",
          borderWidth: "1px",
        },
      },
      "& .MuiInputBase-input": {
        padding: "12px 14px",
        fontSize: "16px",
        color: "#333",
      },
      "& .MuiInputLabel-root": {
        color: "gray",
        "&.Mui-focused": {
          color: "rgba(255, 0, 0, 1)",
        },
        transform: "translate(40px, 12px) scale(1)",
        "&.MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)",
        },
      },
    },
    confirmButton: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": { backgroundColor: "rgba(200, 0, 0, 1)" },
      },
      color: "white",
      backgroundColor: "rgb(177, 16, 16)",
      width: "100%",
      height: 45,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 10,
      textTransform: "none",
      mt: 3,
      ml: 0,
    },
  };
}
