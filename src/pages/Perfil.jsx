import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/axios";
import { getIdFromToken } from "../auth/auth";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";

import AtualizarReservaModal from "../components/mod/AtualizarReservaModal";
import ReservasUsuarioModal from "../components/mod/ReservasUsuarioModal";
import CustomModal from "../components/mod/CustomModal";
import ConfirmarSenhaModal from "../components/mod/ConfirmarSenhaModal";
import UpdateUsuarioModal from "../components/mod/UpdateUsuarioModal";
import ConfirmarDelecaoModal from "../components/mod/ConfirmarDelecaoModal";

function Perfil() {
  const styles = getStyles();

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    NIF: "",
    senha: "",
  });

  const [reservas, setReservas] = useState([]);

  const [openReservasModal, setOpenReservasModal] = useState(false);

  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customModalTitle, setCustomModalTitle] = useState("");
  const [customModalMessage, setCustomModalMessage] = useState("");
  const [customModalType, setCustomModalType] = useState("info");

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const [openConfirmPasswordModal, setOpenConfirmPasswordModal] =
    useState(false);
  const [confirmPasswordAction, setConfirmPasswordAction] = useState(null);

  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);

  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  useEffect(() => {
    document.title = "Perfil | SENAI";
    fetchDados();
  }, []);

  const fetchDados = async () => {
    const idUsuario = getIdFromToken();
    if (!idUsuario) return;
    try {
      const responseUsuario = await api.getUsuarioById(idUsuario);
      setUsuario(responseUsuario.data.usuario);
      const responseReservas = await api.getUsuarioReservasById(idUsuario);
      setReservas(responseReservas.data.reservas || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleApagarReserva = async (idReserva) => {
    try {
      const idUsuario = getIdFromToken();
      await api.deleteReserva(idReserva, idUsuario);
      if (idUsuario) {
        const responseReservas = await api.getUsuarioReservasById(idUsuario);
        setReservas(responseReservas.data.reservas || []);
      }
      setCustomModalTitle("Sucesso");
      setCustomModalMessage("Reserva apagada com sucesso!");
      setCustomModalType("success");
      setCustomModalOpen(true);
    } catch (error) {
      console.error("Erro ao apagar reserva:", error);
      setCustomModalTitle("Erro");
      setCustomModalMessage("Erro ao apagar reserva.");
      setCustomModalType("error");
      setCustomModalOpen(true);
    }
  };

  const handleEditarReserva = (reserva) => {
    setSelectedReserva(reserva);
    setOpenReservasModal(false);
    setOpenUpdateModal(true);
  };

  const handleOpenUpdateProfileFlow = () => {
    setConfirmPasswordAction("updateProfile");
    setOpenConfirmPasswordModal(true);
  };

  const handleOpenDeleteAccountFlow = () => {
    setConfirmPasswordAction("deleteAccount");
    setOpenConfirmPasswordModal(true);
  };

  const handlePasswordConfirmation = async (enteredPassword) => {
    setOpenConfirmPasswordModal(false);
    const idUsuario = getIdFromToken();

    try {
      const response = await api.verificarSenha(enteredPassword, idUsuario);

      if (!response.data.valido) {
        setCustomModalTitle("Erro");
        setCustomModalMessage("Senha incorreta.");
        setCustomModalType("error");
        setCustomModalOpen(true);
        return;
      }

      if (confirmPasswordAction === "updateProfile") {
        setOpenEditProfileModal(true);
      } else if (confirmPasswordAction === "deleteAccount") {
        setOpenConfirmDeleteModal(true);
      }

      setConfirmPasswordAction(null);
    } catch (error) {
      console.error("Erro ao verificar senha:", error);
      setCustomModalTitle("Erro");
      setCustomModalMessage(
        error.response?.data?.error || "Erro ao verificar senha."
      );
      setCustomModalType("error");
      setCustomModalOpen(true);
    }
  };

  const handleDeleteAccount = async () => {
    setOpenConfirmDeleteModal(false);
    const idUsuario = getIdFromToken();
    try {
      await api.deleteUsuario(idUsuario);
      setCustomModalTitle("Sucesso");
      setCustomModalMessage("Conta deletada com sucesso!");
      setCustomModalType("success");
      setCustomModalOpen(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      setCustomModalTitle("Erro");
      setCustomModalMessage(
        error.response?.data?.error || "Erro ao deletar conta."
      );
      setCustomModalType("error");
      setCustomModalOpen(true);
    }
  };

  const handleProfileUpdateSuccess = () => {
    fetchDados();
  };

  return (
    <Container component="main" sx={styles.container}>
      <Box sx={styles.header}>
        <Button component={Link} to="/principal" sx={styles.buttonToPrincipal}>
          <ExitToAppIcon sx={styles.IconeLogout} />
        </Button>
      </Box>
      <Box sx={styles.body}>
        <Box component="form" sx={styles.form} noValidate>
          <Box sx={styles.profileIconBox}>
            <PersonIcon sx={styles.profileIcon} />
          </Box>
          <Typography component="h1" variant="h5" sx={styles.profileTitle}>
            Meu Perfil
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            id="nome"
            label="nome"
            name="nome"
            value={usuario.nome || ""}
            sx={styles.textField}
            disabled
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
            fullWidth
            id="email"
            label="email"
            name="email"
            value={usuario.email || ""}
            sx={styles.textField}
            disabled
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
            fullWidth
            id="NIF"
            label="NIF"
            name="NIF"
            disabled
            value={usuario.NIF || ""}
            sx={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ArticleIcon sx={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={styles.buttonGroup}>
            <Button
              variant="contained"
              onClick={handleOpenUpdateProfileFlow}
              sx={styles.buttonAtualizar}
            >
              Atualizar Perfil
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenDeleteAccountFlow}
              sx={styles.buttonDeletar}
            >
              Deletar Perfil
            </Button>
          </Box>
          <Button
            variant="text"
            onClick={() => setOpenReservasModal(true)}
            sx={styles.buttonMinhasReservas}
          >
            Minhas Reservas
          </Button>
        </Box>
      </Box>
      <Box sx={styles.footer}>
        <Typography sx={styles.footerText}>
          &copy; Desenvolvido por: Vinicius Fogaça, Maria Júlia e Maria Fernanda
        </Typography>
      </Box>

      {openReservasModal && (
        <ReservasUsuarioModal
          open={openReservasModal}
          onClose={() => setOpenReservasModal(false)}
          reservas={reservas}
          onApagarReserva={handleApagarReserva}
          onEditarReserva={handleEditarReserva}
          setCustomModalOpen={setCustomModalOpen}
          setCustomModalTitle={setCustomModalTitle}
          setCustomModalMessage={setCustomModalMessage}
          setCustomModalType={setCustomModalType}
        />
      )}
      {openUpdateModal && selectedReserva && (
        <AtualizarReservaModal
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          reserva={selectedReserva}
          onSuccess={async () => {
            const idUsuario = getIdFromToken();
            const response = await api.getUsuarioReservaById(idUsuario);
            setReservas(response.data.reservas || []);
          }}
          setCustomModalOpen={setCustomModalOpen}
          setCustomModalTitle={setCustomModalTitle}
          setCustomModalMessage={setCustomModalMessage}
          setCustomModalType={setCustomModalType}
        />
      )}

      <ConfirmarSenhaModal
        open={openConfirmPasswordModal}
        onClose={() => setOpenConfirmPasswordModal(false)}
        onConfirm={handlePasswordConfirmation}
      />

      <UpdateUsuarioModal
        open={openEditProfileModal}
        onClose={() => setOpenEditProfileModal(false)}
        userData={usuario}
        setCustomModalOpen={setCustomModalOpen}
        setCustomModalTitle={setCustomModalTitle}
        setCustomModalMessage={setCustomModalMessage}
        setCustomModalType={setCustomModalType}
        onProfileUpdateSuccess={handleProfileUpdateSuccess}
      />

      <ConfirmarDelecaoModal
        open={openConfirmDeleteModal}
        onClose={() => setOpenConfirmDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />

      <CustomModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        title={customModalTitle}
        message={customModalMessage}
        type={customModalType}
      />
    </Container>
  );
}

function getStyles() {
  return {
    container: {
      backgroundImage: `url(../../img/fundo.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      minWidth: "100%",
      pl: { sm: 0 },
      pr: { sm: 0 },
    },
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      borderBottom: "7px solid white",
    },
    body: {
      flexGrow: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    profileIconBox: {
      backgroundColor: "rgba(255, 0, 0, 1)",
      borderRadius: "50%",
      width: "80px",
      height: "80px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mb: 2,
    },
    profileIcon: {
      color: "white",
      fontSize: "40px",
    },
    profileTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      mb: 3,
      color: "#333",
    },
    IconeLogout: {
      width: 40,
      height: 40,
      mr: 3,
      borderRadius: "50%",
      backgroundColor: "darkred",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "4px solid white",
      padding: "7px",
      color: "white",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white",
      padding: "40px 30px",
      borderRadius: "20px",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
      mt: 0,
      mb: 0,
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
    buttonGroup: {
      display: "flex",
      gap: 2,
      mt: 3,
      width: "100%",
      justifyContent: "space-between",
    },
    buttonAtualizar: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": { backgroundColor: "rgba(200, 0, 0, 1)" },
      },
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: "48%",
      height: 45,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 10,
      textTransform: "none",
    },
    buttonDeletar: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": { backgroundColor: "rgba(120, 0, 0, 1)" },
      },
      color: "white",
      backgroundColor: "rgb(157, 0, 0)",
      width: "48%",
      height: 45,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 10,
      textTransform: "none",
    },
    buttonMinhasReservas: {
      color: "rgba(255, 0, 0, 1)",
      backgroundColor: "transparent",
      fontWeight: "bold",
      fontSize: 15.5,
      textDecoration: "none",
      textDecorationThickness: "1.5px",
      textUnderlineOffset: "4px",
      mt: 2,
      textTransform: "none",
      "&:hover": {
        textDecoration: "underline",
        textDecorationThickness: "1.5px",
        textUnderlineOffset: "4px",
        backgroundColor: "transparent",
        color: "rgb(231, 0, 0)",
      },
    },
    footer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "9vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTop: "7px solid white",
    },
    footerText: {
      color: "white",
      fontSize: 18,
    },
  };
}

export default Perfil;
