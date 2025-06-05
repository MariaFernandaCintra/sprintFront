import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../services/axios";
import { getIdFromToken } from "../auth/auth";

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
          label="Nome"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          sx={styles.textField}
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={styles.textField}
        />
        <TextField
          label="Nova Senha"
          type={showSenha ? "text" : "password"}
          fullWidth
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          slotProps={{
            input: {
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
            },
          }}
          sx={styles.textField}
        />

        <TextField
          label="Confirmar Nova Senha"
          type={showConfirmarSenha ? "text" : "password"}
          fullWidth
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          slotProps={{
            input: {
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
            },
          }}
          sx={styles.textField}
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
      padding: 4,
      backgroundColor: "#FFFFFF",
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
      fontSize: "26px",
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
      marginBottom: 2,
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#E0E0E0",
        },
        "&:hover fieldset": {
          borderColor: "#90A4AE",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#E57373",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#90A4AE",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#E57373",
      },
    },
    updateButton: {
      backgroundColor: "rgb(161, 0, 0)",
      "&:hover": {
        backgroundColor: "rgba(161, 0, 0, 0.76)",
      },
      textTransform: "none",
      ml: "25%",
      width: "50%",
      paddingY: 1.5,
      fontSize: "15px",
      fontWeight: 600,
      borderRadius: 8,
      marginTop: 1,
    },
  };
}

export default UpdateUsuarioModal;
