import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import api from "../services/axios";
import { getIdFromToken } from "../auth/auth";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { ExitToApp as ExitToAppIcon } from "@mui/icons-material";

import AtualizarReservasModal from "../components/mod/AtualizarReservasModal";
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
      const responseReservas = await api.getUsuarioReservaById(idUsuario);
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
        const responseReservas = await api.getUsuarioReservaById(idUsuario);
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
          <img src={logo} alt="Logo" style={styles.logo} />
          <TextField
            id="nome"
            placeholder="nome"
            name="nome"
            margin="normal"
            value={usuario.nome || ""}
            sx={styles.textField}
            disabled
          />
          <TextField
            id="email"
            placeholder="e-mail"
            name="email"
            margin="normal"
            value={usuario.email || ""}
            sx={styles.textField}
            disabled
          />
          <TextField
            id="NIF"
            placeholder="NIF"
            name="NIF"
            margin="normal"
            disabled
            value={usuario.NIF || ""}
            sx={styles.textField}
          />
          <TextField
            id="senha"
            type="password"
            placeholder="senha"
            name="senha"
            margin="normal"
            value="********"
            sx={styles.textField}
            disabled
          />
          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleOpenUpdateProfileFlow}
              sx={styles.buttonAtualizar}
            >
              Editar Perfil
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenDeleteAccountFlow}
              sx={{
                ...styles.buttonAtualizar,
                backgroundColor: "rgb(157, 0, 0)",
                "&:hover": { backgroundColor: "rgba(157, 0, 0, 0.92)" },
              }}
            >
              Deletar Conta
            </Button>
          </Box>
          <Button
            variant="outlined"
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
        <AtualizarReservasModal
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
    body: { height: "78.5vh" },
    logo: {
      width: "280px",
      height: "auto",
      marginBottom: 10,
      border: "4.5px solid white",
      borderRadius: 15,
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
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      paddingRight: 8,
      paddingLeft: 8,
      paddingTop: 7,
      paddingBottom: 7,
      borderRadius: 10,
      mt: 8,
      height: "68.5%",
    },
    title: {
      fontWeight: 1000,
      marginBottom: 2,
      color: "rgb(202, 0, 0)",
      fontSize: 30,
      backgroundColor: "rgba(219, 112, 112, 0.67)",
      paddingTop: 1,
      paddingBottom: 1,
      paddingRight: 3,
      paddingLeft: 3,
      borderRadius: 10,
    },
    textField: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": { border: "none" },
        "&:hover fieldset": { border: "none" },
        "&.Mui-focused fieldset": { border: "none" },
        color: "gray",
        backgroundColor: "rgb(242, 242, 242)",
        borderRadius: 4,
      },
      "& input::placeholder": { fontSize: "17px", color: "gray" },
      width: "35vh",
      height: "6vh",
      backgroundColor: "white",
      display: "flex",
      border: "0px transparent",
      borderRadius: 4,
    },

    buttonAtualizar: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": { border: "none", backgroundColor: "rgba(255, 0, 0, 0.55)" },
      },
      mt: 1,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 160,
      height: 45,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    buttonMinhasReservas: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        backgroundColor: "transparent",
        "&:hover": {
          border: "none",
          backgroundColor: "transparent",
          boxShadow: "none",
          textDecoration: "underline",
          textDecorationColor: "rgba(177, 16, 16, 1)",
        },
      },
      mt: 3,
      color: "rgba(177, 16, 16, 1)",
      width: 200,
      height: 40,
      fontWeight: 600,
      fontSize: 15,
      textTransform: "none",
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