import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.12.225:5000/reservas/v1/",
  headers: { accept: "application/json" },
});

const sheets = {
  postLogin: (usuario) => api.post(`login/`, usuario),
  postCadastro: (usuario) => api.post(`cadastro/`, usuario),
  getUsuarioById: (id) => api.get(`/usuario/perfil/${id}`),
  getUsuarioReservaById: (id) => api.get(`/usuario/perfil/${id}/reservas`),
  postReserva: (reserva) => api.post(`reserva/`, reserva),
  getSalas: (sala) => api.get(`salas/`, sala),
};

export default sheets;
