import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.70:5000/reservas/v1/",
  headers: { accept: "application/json" },
});

const sheets = {
  postLogin: (usuario) => api.post("login/", usuario),
  postCadastro: (usuario) => api.post("cadastro/", usuario),
  postReserva: (reserva) => api.post("reserva/", reserva),
  getSalas: (sala) => api.get("salas/", sala),
};

export default sheets;
