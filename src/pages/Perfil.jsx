import { useState, useEffect } from "react";
 import { Link } from "react-router-dom";
 import {
   Box,
   Button,
   Container,
   TextField,
   IconButton,
   InputAdornment,
   Typography,
 } from "../components";
 import { Visibility, VisibilityOff, ExitToAppIcon } from "../components";

 import logo from "../../img/logo.png";
 import api from "../services/axios";
 import { getIdFromToken } from "../auth/auth";

 import AtualizarReservasUsuario from "../components/AtualizarReservasModal";
 import ReservasUsuarioModal from "../components/ReservasUsuarioModal";
 import CustomModal from "../components/CustomModal";

 function Perfil() {
   const styles = getStyles();

   const [usuario, setUsuario] = useState({
     nome: "",
     email: "",
     NIF: "",
     senha: "",
   });
   const [mostrarSenha, setMostrarSenha] = useState(false);
   const [reservas, setReservas] = useState([]);
   const [openReservasModal, setOpenReservasModal] = useState(false);

   // Estados para o CustomModal
   const [customModalOpen, setCustomModalOpen] = useState(false);
   const [customModalTitle, setCustomModalTitle] = useState("");
   const [customModalMessage, setCustomModalMessage] = useState("");
   const [customModalType, setCustomModalType] = useState("info");

   const [openUpdateModal, setOpenUpdateModal] = useState(false);
   const [selectedReserva, setSelectedReserva] = useState(null);

   useEffect(() => {
     document.title = "Perfil | SENAI";
     const fetchDados = async () => {
       const idUsuario = getIdFromToken();
       console.log("ID do usuário:", idUsuario);
       if (!idUsuario) return;
       try {
         const responseUsuario = await api.getUsuarioById(idUsuario);
         console.log("Usuário retornado:", responseUsuario.data);
         setUsuario(responseUsuario.data.usuario);
         const responseReservas = await api.getUsuarioReservaById(idUsuario);
         setReservas(responseReservas.data.reservas || []);
       } catch (error) {
         console.error("Erro ao buscar dados:", error);
       }
     };
     fetchDados();
   }, []);

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

   const handleAtualizarPerfil = async () => {
     try {
       const idUsuario = getIdFromToken();
       if (!idUsuario) {
         setCustomModalTitle("Erro");
         setCustomModalMessage("ID do usuário não encontrado.");
         setCustomModalType("error");
         setCustomModalOpen(true);
         return;
       }

       const usuarioParaAtualizar = {
         nome: usuario.nome,
         email: usuario.email,
         senha: usuario.senha,
       };

       const response = await api.updateUsuario(usuarioParaAtualizar, idUsuario);
       setCustomModalTitle("Sucesso");
       setCustomModalMessage(response.data?.message || "Perfil atualizado com sucesso!");
       setCustomModalType("success");
       setCustomModalOpen(true);
     } catch (error) {
       console.error("Erro ao atualizar perfil:", error);
       setCustomModalTitle("Erro");
       setCustomModalMessage(error.response?.data?.error || "Erro ao atualizar perfil");
       setCustomModalType("error");
       setCustomModalOpen(true);
     }
   };

   const handleChange = (e) => {
     const { name, value } = e.target;
     setUsuario((prev) => ({ ...prev, [name]: value }));
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
             onChange={handleChange}
             sx={styles.textField}
           />
           <TextField
             id="email"
             placeholder="e-mail"
             name="email"
             margin="normal"
             value={usuario.email || ""}
             onChange={handleChange}
             sx={styles.textField}
           />
           <TextField
             id="NIF"
             placeholder="NIF"
             name="NIF"
             margin="normal"
             disabled
             value={usuario.NIF || ""}
             sx={styles.nifField} 
           />
           <TextField
             id="senha"
             type={mostrarSenha ? "text" : "password"}
             placeholder="senha"
             name="senha"
             margin="normal"
             value={usuario.senha}
             onChange={handleChange}
             sx={styles.passwordField}
             slotProps={{
               input: {
                 endAdornment: (
                   <InputAdornment position="end">
                     <IconButton
                       aria-label="toggle password visibility"
                       onClick={() => setMostrarSenha((prev) => !prev)}
                       edge="end"
                       sx={{ color: "gray", mr: 0.1 }}
                     >
                       {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                     </IconButton>
                   </InputAdornment>
                 ),
               },
             }}
           />
           <Button
             variant="contained"
             onClick={handleAtualizarPerfil}
             sx={styles.buttonAtualizar}
           >
             Atualizar Perfil
           </Button>
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
         <AtualizarReservasUsuario
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

       <CustomModal
         open={customModalOpen}
         onClose={() => setCustomModalOpen(false)} // Directly pass the state updater
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
       paddingRight: 6,
       paddingLeft: 6,
       paddingTop: 7,
       paddingBottom: 7,
       borderRadius: 10,
       mt: 10,
       height: "64.5%",
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
       },
       "& input::placeholder": { fontSize: "17px", color: "gray" },
       width: "35vh",
       height: "6vh",
       backgroundColor: "white",
       display: "flex",
       border: "0px transparent",
       borderRadius: 4,
     },

     nifField: {
       "& .MuiOutlinedInput-root": {
         "& fieldset": { border: "none" },
         "&:hover fieldset": { border: "none" },
         "&.Mui-focused fieldset": { border: "none" },
         backgroundColor: "rgb(242, 242, 242)",
         color: "gray",
         borderRadius: 4,
       },
       "& input::placeholder": { fontSize: "17px", color: "gray" },
       width: "35vh",
       height: "6vh",
       display: "flex",
       border: "0px transparent",
       borderRadius: 4,
     },
     passwordField: {
       "& .MuiOutlinedInput-root": {
         "& fieldset": { border: "none" },
         "&:hover fieldset": { border: "none" },
         "&.Mui-focused fieldset": { border: "none" },
         color: "gray",
       },
       "& input::placeholder": { fontSize: "17px", color: "gray" },
       width: "35vh",
       height: "6vh",
       backgroundColor: "white",
       display: "flex",
       borderRadius: 4,
       color: "gray",
     },
     selectField: {
       mt: 2,
       width: "35vh",
       height: "5.5vh",
       backgroundColor: "white",
       display: "flex",
       borderRadius: 4,
       color: "gray",
       justifyContent: "center",
       alignItems: "center",
       fontWeight: "bold",
       textTransform: "none",
     },
     buttonAtualizar: {
       "&.MuiButton-root": {
         border: "none",
         boxShadow: "none",
         "&:hover": { border: "none", backgroundColor: "rgba(255, 0, 0, 0.55)" },
       },
       mt: 4,
       color: "white",
       backgroundColor: "rgba(255, 0, 0, 1)",
       width: 180,
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
       color: "rgba(177, 16, 16, 1)",
       width: 180,
       height: 40,
       fontWeight: 600,
       fontSize: 15,
       borderRadius: 15,
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