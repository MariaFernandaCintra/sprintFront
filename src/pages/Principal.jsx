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

function Principal() {
  const styles = getStyles();

  const [salas, setSalas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSalaId, setSelectedSalaId] = useState(null);

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

  function handleCellClick(idSala) {
    setSelectedSalaId(idSala);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedSalaId(null);
  }

  const listSalas = salas.map((sala) => (
    <TableRow key={sala.id_sala}>
      <TableCell
        align="center"
        sx={styles.tableBodyCell}
        onClick={() => handleCellClick(sala.id_sala)}
        style={{ cursor: "pointer" }}
      >
        {sala.nome}
      </TableCell>
      <TableCell
        align="center"
        sx={styles.tableBodyCell}
        onClick={() => handleCellClick(sala.id_sala)}
        style={{ cursor: "pointer" }}
      >
        {sala.descricao}
      </TableCell>
      <TableCell
        align="center"
        sx={styles.tableBodyCell}
        onClick={() => handleCellClick(sala.id_sala)}
        style={{ cursor: "pointer" }}
      >
        {sala.bloco}
      </TableCell>
      <TableCell
        align="center"
        sx={styles.tableBodyCell}
        onClick={() => handleCellClick(sala.id_sala)}
        style={{ cursor: "pointer" }}
      >
        {sala.tipo}
      </TableCell>
      <TableCell
        align="center"
        sx={styles.tableBodyCell}
        onClick={() => handleCellClick(sala.id_sala)}
        style={{ cursor: "pointer" }}
      >
        {sala.capacidade}
      </TableCell>
    </TableRow>
  ));

  return (
    <div>
      {salas.length === 0 ? (
        <Container sx={styles.container}>
          <Box>
            <p style={{ color: "white", fontSize: 55, margin: 365 }}>
              Carregando Salas...
            </p>
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
                localStorage.removeItem("authenticated");
              }}
            >
              <ExitToAppIcon sx={styles.IconeLogout} />
            </Button>
          </Box>

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

      {selectedSalaId && (
        <ReservarModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          idSala={selectedSalaId}
        />
      )}
    </div>
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
      marginRight: "1350px",
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
