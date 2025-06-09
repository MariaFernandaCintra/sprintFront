
import { useState } from 'react';

import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import CloseIcon from "@mui/icons-material/Close";

function ConfirmarSenhaModal({ open, onClose, onConfirm }) {
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
          label="Senha Atual"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
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
          sx={styles.textField}
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
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBox: {
      display: "flex",
      flexDirection: "column",
      width: 360,
      maxWidth: "90%",
      padding: 4,
      backgroundColor: "rgb(255, 255, 255)",
      borderRadius: 10,
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
      outline: "none",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    title: {
      fontWeight: 600,
      color: "#37474F",
      fontSize: "22px",
      textAlign: "center",
      flexGrow: 1,
    },
    closeButton: {
      color: "#E57373",
      "&:hover": {
        backgroundColor: "rgba(239, 83, 80, 0.08)",
      },
    },
    textField: {
      marginBottom: 3,
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#E0E0E0',
        },
        '&:hover fieldset': {
          borderColor: '#90A4AE',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#E57373',
        },
      },
      '& .MuiInputLabel-root': {
        color: '#90A4AE',
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#E57373',
      },
    },
    confirmButton: {
      backgroundColor: "rgb(161, 0, 0)",
      "&:hover": {
        backgroundColor: "rgba(161, 0, 0, 0.76)",
      },
      textTransform: "none",
      ml:"30%",
      width: "40%",
      paddingY: 1.5,
      fontSize: "16px",
      fontWeight: 600,
      borderRadius: 8,
    },
  };
}

export default ConfirmarSenhaModal;