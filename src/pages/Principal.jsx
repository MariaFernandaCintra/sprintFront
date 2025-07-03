import { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import api from "../services/axios";

import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";

import ReservarModal from "../components/mod/ReservarModal";
import CustomModal from "../components/mod/CustomModal";
import FiltroModal from "../components/mod/FiltroModal"; // Importe o FiltroModal

import { getToday } from "../utils/dateUtils"; // Provavelmente não será mais necessário diretamente para a lógica de filtros de data/hora no Principal

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";

function Principal() {
  const styles = getStyles();

  const [salas, setSalas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // Para ReservarModal
  const [selectedSalaId, setSelectedSalaId] = useState(null);
  const [selectedSalaNome, setSelectedSalaNome] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [filtroModalOpen, setFiltroModalOpen] = useState(false); // Novo estado para FiltroModal
  const [appliedFilters, setAppliedFilters] = useState(null); // Estado para armazenar os filtros aplicados pelo FiltroModal

  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  useEffect(() => {
    document.title = "Principal | SENAI";
    getSalas(); // Carrega as salas inicialmente sem filtros
  }, []);

  // UseEffect para aplicar filtros quando appliedFilters mudar
  useEffect(() => {
    if (appliedFilters) {
      applyAdvancedFilters(appliedFilters);
    } else {
      getSalas(); // Se os filtros forem resetados, busca todas as salas
    }
  }, [appliedFilters]); // Dependência: re-executa quando appliedFilters muda

  async function getSalas() {
    try {
      const response = await api.getSalas();
      setSalas(response.data.salas);
    } catch (error) {
      console.log("Erro ao buscar salas: ", error);
      setModalTitle("Erro");
      setModalMessage("Não foi possível carregar as salas.");
      setModalType("error");
      setCustomModalOpen(true);
    }
  }

  // Nova função para aplicar os filtros recebidos do FiltroModal
  async function applyAdvancedFilters(filtersFromModal) {
    try {
      const response = await api.getSalasDisponivelHorario(filtersFromModal);
      setSalas(response.data.salas);

      setModalTitle("Resultado da Filtragem Avançada");
      setModalMessage(response.data.message || "Salas filtradas com sucesso!");
      setModalType("success");
      setCustomModalOpen(true);
    } catch (error) {
      console.log("Erro ao filtrar salas avançado", error);

      setModalTitle("Erro ao Filtrar");
      setModalMessage(
        error.response?.data?.error ||
          "Não foi possível buscar as salas com os filtros aplicados."
      );
      setModalType("error");
      setCustomModalOpen(true);
      setSalas([]); // Limpa as salas em caso de erro
    }
  }

  function handleCellClick(idSala, nomeSala) {
    setSelectedSalaId(idSala);
    setSelectedSalaNome(nomeSala);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false); // Fecha ReservarModal
    setSelectedSalaId(null);
  }

  const filteredSalas = salas.filter((sala) =>
    sala.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Fragment>
        {salas.length === 0 && !appliedFilters ? ( // Renderiza carregando apenas se não houver salas e não houver filtros aplicados ainda
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
                style={{ color: "black", fontSize: 55, margin: 350 }}
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

            <Box sx={styles.searchAndFilterContainer}>
              <TextField
                variant="outlined"
                placeholder="Pesquisar por Tipo (ex: Laboratório)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={styles.searchBar}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                sx={styles.advancedFilterButton}
                onClick={() => setFiltroModalOpen(true)} // Abre o FiltroModal
              >
                Filtros Avançados
              </Button>
            </Box>

            <Box sx={styles.salasGridContainer}>
              {filteredSalas.length > 0 ? (
                filteredSalas.map((sala) => (
                  <Box key={sala.id_sala} sx={styles.salaCard}>
                    <Box sx={styles.salaCardHeader}>
                      <Typography variant="h6" sx={styles.salaCardTitle}>
                        {sala.nome} - {sala.tipo}
                      </Typography>
                    </Box>
                    <Box sx={styles.salaCardBody}>
                      <Typography sx={styles.salaCardText}>
                        <span style={styles.salaCardLabel}>Descrição:</span>{" "}
                        {sala.descricao}
                      </Typography>
                      <Typography sx={styles.salaCardText}>
                        <span style={styles.salaCardLabel}>Bloco:</span>{" "}
                        {sala.bloco}
                      </Typography>
                      <Typography sx={styles.salaCardText}>
                        <span style={styles.salaCardLabel}>Tipo:</span>{" "}
                        {sala.tipo}
                      </Typography>
                      <Typography sx={styles.salaCardText}>
                        <span style={styles.salaCardLabel}>Capacidade:</span>{" "}
                        {sala.capacidade}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={styles.reserveButton}
                        onClick={() =>
                          handleCellClick(sala.id_sala, sala.nome)
                        }
                      >
                        Reservar
                      </Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography sx={{ gridColumn: '1 / -1', textAlign: 'center', mt: 4, fontSize: '1.2rem', color: 'gray' }}>
                  Nenhuma sala encontrada com os filtros aplicados.
                </Typography>
              )}
            </Box>

            <Box sx={styles.footer}>
              <Typography sx={styles.footerText}>
                &copy; Desenvolvido por: Vinicius Fogaça, Maria Júlia e Maria
                Fernanda
              </Typography>
            </Box>
          </Container>
        )}

        {/* ReservarModal permanece inalterado */}
        {selectedSalaId && (
          <ReservarModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            idSala={selectedSalaId}
            roomNome={selectedSalaNome}
          />
        )}

        {/* CustomModal permanece inalterado */}
        <CustomModal
          open={customModalOpen}
          onClose={() => setCustomModalOpen(false)}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
        />

        {/* Novo FiltroModal */}
        <FiltroModal
          visible={filtroModalOpen}
          onClose={() => setFiltroModalOpen(false)}
          onApplyFilters={(filters) => {
            setAppliedFilters(filters); // Armazena os filtros aplicados
            setFiltroModalOpen(false); // Fecha o modal
          }}
        />
      </Fragment>{" "}
    </LocalizationProvider>
  );
}

function getStyles() {
  return {
    container: {
      backgroundColor: "rgb(224, 224, 224)",
      height: "auto",
      minHeight: "100vh",
      minWidth: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "column",
      pl: { sm: 0 },
      pr: { sm: 0 },
      paddingTop: "11vh",
    },
    header: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      width: "100%",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      borderBottom: "7px solid white",
      position: "fixed",
      top: 0,
      zIndex: 1000,
    },
    logo: {
      width: "230px",
      height: "auto",
      marginRight: "auto",
      marginLeft: "20px",
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
    searchAndFilterContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "90%",
      marginTop: "20px",
      marginBottom: "10px",
    },
    searchBar: {
      width: "87%",
      "& .MuiOutlinedInput-root": {
        borderRadius: "20px",
        backgroundColor: "rgb(255, 255, 255)",
        "& fieldset": {
          borderColor: "transparent",
        },
        "&:hover fieldset": {
          borderColor: "transparent",
        },
        "&.Mui-focused fieldset": {
          borderColor: "transparent",
        },
      },
      "& .MuiInputBase-input": {
        padding: "18px 14px",
      },
    },
    advancedFilterButton: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      textTransform: "none",
      fontSize: 16,
      fontWeight: "bold",
      borderRadius: "20px",
      padding: "15px 20px",
      marginBottom: "-2px",
      "&:hover": {
        backgroundColor: "darkred",
      },
    },
    inputFiltro: {
      borderRadius: 5,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      width: "25%",
      color: "#fff",
      "& .MuiInputBase-root": {
        borderRadius: "10px",
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
      width: "15%",
      height: "60%",
      fontSize: 18,
      fontWeight: "bold",
      borderRadius: "10px",
    },
    salasGridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      backgroundColor: "rgb(224, 224, 224)",
      gap: "20px",
      width: "90%",
      marginTop: "20px",
      marginBottom: "20px",
    },
    salaCard: {
      backgroundColor: "rgb(255, 255, 255)",
      border: "2px solid rgb(85, 85, 85)",
      borderRadius: "15px",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    salaCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #B5B5B5",
      paddingBottom: "10px",
      marginBottom: "10px",
    },
    salaCardTitle: {
      fontWeight: "bold",
      fontSize: 20,
      color: "#333",
    },
    collapseIcon: {
      cursor: "pointer",
      color: "#B11010",
    },
    salaCardBody: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    salaCardText: {
      fontSize: 16,
      color: "#555",
    },
    salaCardLabel: {
      fontWeight: "bold",
    },
    reserveButton: {
      backgroundColor: "rgba(177, 16, 16, 1)",
      textTransform: "none",
      marginTop: "-40px",
      marginBottom: "2px",
      alignSelf: "flex-end",
      "&:hover": {
        backgroundColor: "darkred",
      },
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