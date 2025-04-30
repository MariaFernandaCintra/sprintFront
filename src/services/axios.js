import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.82:5000/reservas/v1/",
  headers: { accept: "application/json" },
});

const sheets = {
  postLogin: (usuario) => api.post(`login/`, usuario),
  postCadastro: (usuario) => api.post(`cadastro/`, usuario),
  getUsuarioById: (id) => api.get(`/usuario/perfil/${id}`),
  getUsuarioReservaById: (id) => api.get(`/usuario/perfil/${id}/reservas`),
  postReserva: (reserva) => api.post(`reserva/`, reserva),
  getSalas: (sala) => api.get(`salas/`, sala),
  getSalasDisponivelHorario: (sala) => api.post(`salasdisponivelhorario/`, sala),
};

export default sheets;
