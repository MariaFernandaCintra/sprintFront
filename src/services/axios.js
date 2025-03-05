import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/reservas/v1/",
  headers: { accept: "application/json" },
});

const sheets = {
  postLogin: (usuario) => api.post("login/", usuario),
  postCadastro: (usuario) => api.post("cadastro/", usuario),
  getSalas: (sala) => api.get("salas/", sala),
};

export default sheets;
