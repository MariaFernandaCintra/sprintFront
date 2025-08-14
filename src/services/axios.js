import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.253:5000/reservas/v1/",
  headers: { accept: "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("tokenUsuario");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const sheets = {
  postLogin: (usuario) => api.post(`login/`, usuario),
  postCadastro: (usuario) => api.post(`cadastro/`, usuario),

  updateUsuario: (usuario, id_usuario) => api.put(`usuario/${id_usuario}`, usuario),
  deleteUsuario: (id_usuario) => api.delete(`usuario/${id_usuario}`),
  verificarSenha: (senha, id_usuario) => api.post(`usuario/verificarsenha/${id_usuario}`, { senha }),

  getUsuarioById: (id_usuario) => api.get(`usuario/perfil/${id_usuario}`),
  getUsuarioReservasById: (id_usuario) => api.get(`usuario/perfil/${id_usuario}/reservas`),
  getHistoricoReservasById: (id_usuario) => api.get(`usuario/historico/${id_usuario}`),
  getReservasDeletadasById: (id_usuario) => api.get(`usuario/deletadas/${id_usuario}`),

  postReserva: (reserva) => api.post(`reserva/simples`, reserva),
  postReservaPeriodica: (reserva) => api.post(`reserva/periodica`, reserva),

  putReserva: (id_reserva, reservaAtualizada) => api.put(`/reserva/simples/${id_reserva}`, reservaAtualizada),
  putReservaPeriodica: (id_reserva, reservaAtualizada) => api.put(`/reserva/periodica/${id_reserva}`, reservaAtualizada),
  deleteReserva: (id_reserva, id_usuario) => api.delete(`reserva/${id_reserva}/${id_usuario}`),

  getSalas: () => api.get(`salas/`),
  getSalasDisponivelHorario: (sala) => api.post(`salasdisponivelhorario/`, sala),
};

export default sheets;