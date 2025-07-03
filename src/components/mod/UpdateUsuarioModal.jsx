import { useState, useEffect } from "react";
import { getIdFromToken } from "../../auth/auth";
import api from "../../services/axios";

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
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

function UpdateUsuarioModal({
  open,
  onClose,
  userData,
  setCustomModalOpen,
  setCustomModalTitle,
  setCustomModalMessage,
  setCustomModalType,
  onProfileUpdateSuccess,
}) {
  const [nome, setNome] = useState(userData.nome);
  const [email, setEmail] = useState(userData.email);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  useEffect(() => {
    setNome(userData.nome);
    setEmail(userData.email);
    setSenha("");
    setConfirmarSenha("");
  }, [userData]);

  const handleUpdate = async () => {
    if (senha && senha !== confirmarSenha) {
      setCustomModalTitle("Erro");
      setCustomModalMessage("As senhas não coincidem.");
      setCustomModalType("error");
      setCustomModalOpen(true);
      return;
    }

    const idUsuario = getIdFromToken();
    if (!idUsuario) {
      setCustomModalTitle("Erro");
      setCustomModalMessage("ID do usuário não encontrado.");
      setCustomModalType("error");
      setCustomModalOpen(true);
      return;
    }

    try {
      const updatedData = { nome, email };
      if (senha) {
        updatedData.senha = senha;
      }

      const response = await api.updateUsuario(updatedData, idUsuario);

      setCustomModalTitle("Sucesso");
      setCustomModalMessage(
        response.data?.message || "Perfil atualizado com sucesso!"
      );
      setCustomModalType("success");
      setCustomModalOpen(true);
      onProfileUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setCustomModalTitle("Erro");
      setCustomModalMessage(
        error.response?.data?.error || "Erro ao atualizar perfil"
      );
      setCustomModalType("error");
      setCustomModalOpen(true);
    }
  };

  const styles = getStyles();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="update-profile-modal-title"
      aria-describedby="update-profile-modal-description"
      sx={styles.modalContainer}
    >
      <Box sx={styles.modalBox}>
        <Box sx={styles.header}>
          <Typography id="update-profile-modal-title" sx={styles.title}>
            Editar Perfil
          </Typography>
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          margin="normal"
          label="nome"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          sx={styles.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          label="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={styles.textField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          label="nova-senha"
          type={showSenha ? "text" : "password"}
          fullWidth
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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
                  onClick={() => setShowSenha((prev) => !prev)}
                  edge="end"
                >
                  {showSenha ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          margin="normal"
          label="confirmar-senha"
          type={showConfirmarSenha ? "text" : "password"}
          fullWidth
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
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
                  onClick={() => setShowConfirmarSenha((prev) => !prev)}
                  edge="end"
                >
                  {showConfirmarSenha ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          onClick={handleUpdate}
          fullWidth
          sx={styles.updateButton}
        >
          Editar Perfil
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
    updateButton: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": { backgroundColor: "rgba(200, 0, 0, 1)" },
      },
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
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

export default UpdateUsuarioModal;