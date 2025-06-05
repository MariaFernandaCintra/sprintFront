import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "../components";
import { PersonIcon, ExitToAppIcon } from "../components";
import logo from "../../img/logo.png";
import api from "../services/axios";
import ReservarModal from "../components/ReservarModal";
import CustomModal from "../components/CustomModal";

import { getToday } from "../utils/dateUtils";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import { format, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";

function Principal() {
  const styles = getStyles();

  const [salas, setSalas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSalaId, setSelectedSalaId] = useState(null);
  const [selectedSalaNome, setSelectedSalaNome] = useState("");

  // Inicializar filtros com data atual, hora atual e hora atual + 1h
  const now = new Date();
  const [filters, setFilters] = useState({
    data: now,
    hora_inicio: now,
    hora_fim: addHours(now, 1),
  });

  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  useEffect(() => {
    document.title = "Principal | SENAI";
    getSalas();
  }, []);

  async function getSalas() {
    try {
      const response = await api.getSalas();
      setSalas(response.data.salas);
    } catch (error) {
      console.log("Erro", error);
    }
  }

  async function handleFilter() {
    try {
      // Envia no formato ISO (yyyy-MM-dd) e horário (HH:mm)
      const filtroFormatado = {
        data: filters.data ? format(filters.data, "yyyy-MM-dd") : "",
        hora_inicio: filters.hora_inicio
          ? format(filters.hora_inicio, "HH:mm")
          : "",
        hora_fim: filters.hora_fim ? format(filters.hora_fim, "HH:mm") : "",
      };

      const response = await api.getSalasDisponivelHorario(filtroFormatado);
      setSalas(response.data.salas);

      setModalTitle("Resultado da Filtragem");
      setModalMessage(response.data.message || "Salas filtradas com sucesso!");
      setModalType("success");
      setCustomModalOpen(true);
    } catch (error) {
      console.log("Erro ao filtrar salas", error);

      setModalTitle("Erro ao Filtrar");
      setModalMessage(
        error.response?.data?.error ||
          "Não foi possível buscar as salas disponíveis."
      );
      setModalType("error");
      setCustomModalOpen(true);
    }
  }

  function handleCellClick(idSala, nomeSala) {
    setSelectedSalaId(idSala);
    setSelectedSalaNome(nomeSala);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedSalaId(null);
  }

  const listSalas = salas.map((sala) => (
    <TableRow key={sala.id_sala}>
      {["nome", "descricao", "bloco", "tipo", "capacidade"].map((campo) => (
        <TableCell
          key={campo}
          align="center"
          sx={styles.tableBodyCell}
          onClick={() => handleCellClick(sala.id_sala, sala.nome)}
          style={{ cursor: "pointer" }}
        >
          {sala[campo]}
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <div>
        {salas.length === 0 ? (
          <Container sx={styles.container}>
            <Box sx={styles.header}>
              <img src={logo} alt="Logo" style={styles.logo} />
              <Button component={Link} to="/perfil" sx={styles.buttonPerfil}>
                <PersonIcon sx={styles.IconeToPerfil} />
              </Button>
              <Button
                component={Link}
                to="/"
                sx={styles.buttonLogout}
                onClick={() => {
                  localStorage.removeItem("tokenUsuario");
                }}
              >
                <ExitToAppIcon sx={styles.IconeLogout} />
              </Button>
            </Box>
            <Box>
              <Typography
                style={{ color: "white", fontSize: 55, margin: 350 }}
                sx={{
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                Carregando Salas...
              </Typography>
            </Box>
            <Box sx={styles.footer}>
              <Typography sx={styles.footerText}>
                &copy; Desenvolvido por: Vinicius Fogaça, Maria Júlia e Maria
                Fernanda
              </Typography>
            </Box>
          </Container>
        ) : (
          <Container sx={styles.container}>
            <Box sx={styles.header}>
              <img src={logo} alt="Logo" style={styles.logo} />
              <Button component={Link} to="/perfil" sx={styles.buttonPerfil}>
                <PersonIcon sx={styles.IconeToPerfil} />
              </Button>
              <Button
                component={Link}
                to="/"
                sx={styles.buttonLogout}
                onClick={() => {
                  localStorage.removeItem("tokenUsuario");
                }}
              >
                <ExitToAppIcon sx={styles.IconeLogout} />
              </Button>
            </Box>

            {/* Filtros */}
            <Box sx={styles.containerFiltro}>
              <DatePicker
                label="Data"
                value={filters.data}
                minDate={getToday()}
                onChange={(newValue) =>
                  setFilters({ ...filters, data: newValue })
                }
                slotProps={{
                  textField: {
                    sx: styles.inputFiltro,
                    InputLabelProps: { shrink: true },
                  },
                }}
              />
              <TimePicker
                label="Hora Início"
                value={filters.hora_inicio}
                onChange={(newValue) =>
                  setFilters({ ...filters, hora_inicio: newValue })
                }
                ampm={false}
                slotProps={{
                  textField: {
                    sx: styles.inputFiltro,
                    InputLabelProps: { shrink: true },
                  },
                }}
              />
              <TimePicker
                label="Hora Fim"
                value={filters.hora_fim}
                onChange={(newValue) =>
                  setFilters({ ...filters, hora_fim: newValue })
                }
                ampm={false}
                slotProps={{
                  textField: {
                    sx: styles.inputFiltro,
                    InputLabelProps: { shrink: true },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleFilter}
                sx={styles.buttonFiltrar}
              >
                Filtrar
              </Button>
            </Box>

            {/* Tabela */}
            <Box sx={styles.boxFundoTabela}>
              <TableContainer sx={styles.tableContainer}>
                <Table size="small" sx={styles.table}>
                  <TableHead sx={styles.tableHead}>
                    <TableRow sx={styles.tableRow}>
                      <TableCell align="center" sx={styles.tableCell}>
                        Nome
                      </TableCell>
                      <TableCell align="center" sx={styles.tableCell}>
                        Descrição
                      </TableCell>
                      <TableCell align="center" sx={styles.tableCell}>
                        Bloco
                      </TableCell>
                      <TableCell align="center" sx={styles.tableCell}>
                        Tipo
                      </TableCell>
                      <TableCell align="center" sx={styles.tableCell}>
                        Capacidade
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={styles.tableBody}>{listSalas}</TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={styles.footer}>
              <Typography sx={styles.footerText}>
                &copy; Desenvolvido por: Vinicius Fogaça, Maria Júlia e Maria
                Fernanda
              </Typography>
            </Box>
          </Container>
        )}

        {/* Modal de Reserva */}
        {selectedSalaId && (
          <ReservarModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            idSala={selectedSalaId}
            roomNome={selectedSalaNome}
          />
        )}

        {/* Custom Modal */}
        <CustomModal
          open={customModalOpen}
          onClose={() => setCustomModalOpen(false)}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
        />
      </div>
    </LocalizationProvider>
  );
}

function getStyles() {
  return {
    container: {
      backgroundImage: `url(../../img/fundo.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "auto",
      minWidth: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
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
    logo: {
      width: "230px",
      height: "auto",
      marginRight: "1415px",
      border: "4px solid white",
      borderRadius: 15,
    },
    IconeToPerfil: {
      width: 54,
      height: 54,
      borderRadius: "50%",
      backgroundColor: "darkred",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "4px solid white",
      color: "white",
    },
    IconeLogout: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "darkred",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "4px solid white",
      padding: "7px",
      color: "white",
    },
    buttonLogout: {
      mr: 1,
    },
    tableContainer: {
      backgroundColor: "transparent",
    },
    table: {
      backgroundColor: "#949494",
      marginTop: 2.5,
      marginBottom: 2.5,
      marginLeft: "auto",
      marginRight: "auto",
      width: "calc(100% - 40px)",
      borderRadius: "15px",
    },
    tableHead: {
      backgroundColor: "gray",
      borderRadius: "50px",
      border: "2px solid white",
    },
    containerFiltro: {
      mt: 4,
      display: "flex",
      gap: 10,
      backgroundColor: "#B5B5B5",
      margin: "30px",
      marginBottom: 1,
      border: "5px solid white",
      borderRadius: "15px",
      width: "90%",
      alignItems: "center",
      height: 80,
    },
    inputFiltro: {
      borderRadius: 5,
      ml: 5,
      mb: 0.5,
      mt: 1,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      width: "22%",
      color: "#fff",
      "& .MuiPickersInputBase-root": {
        borderRadius: "20px",
        color: "gray",
        fontSize: 16,
        fontWeight: 1000,
      },
      "& .MuiInputLabel-root": {
        fontWeight: 1000,
        fontSize: "20px",
        color: "gray",
        backgroundColor: "none",
      },
    },
    buttonFiltrar: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      textTransform: "none",
      width: "8%",
      height: "60%",
      marginRight: 5,
      fontSize: 18,
      fontWeight: "bold",
    },
    boxFundoTabela: {
      margin: "25px",
      border: "5px solid white",
      borderRadius: "15px",
      backgroundColor: "#B5B5B5",
      width: "90%",
    },
    tableCell: {
      backgroundColor: "#D9D9D9",
      border: "2px solid white",
      fontWeight: "bold",
      fontSize: 22,
      paddingTop: 2,
    },
    tableBody: {
      backgroundColor: "#949494",
      border: "3px solid white",
      borderRadius: 10,
    },
    tableBodyCell: {
      backgroundColor: "#949494",
      border: "1px solid white",
      borderRadius: 10,
      color: "white",
      fontSize: 20,
      paddingTop: 1.2,
      paddingBottom: 1.2,
    },
    footer: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
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
}

export default Principal;
