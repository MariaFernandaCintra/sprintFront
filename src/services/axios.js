import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.253:5000/reservas/v1/",
  headers: { accept: "application/json" },
});

// Interceptor para adicionar o token no cabeçalho de todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("tokenUsuario"); // pega o token armazenado
    if (token) {
      config.headers["Authorization"] = token; // adiciona o token no cabeçalho
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
  getUsuarioById: (id_usuario) => api.get(`/usuario/perfil/${id_usuario}`),
  getUsuarioReservaById: (id_usuario) => api.get(`/usuario/perfil/${id_usuario}/reservas`),
  postReserva: (reserva) => api.post(`reserva/`, reserva),
  deleteReserva: (id_reserva, id_usuario) => api.delete(`reserva/${id_reserva}/${id_usuario}`),
  getSalas: () => api.get(`salas/`),
  getSalasDisponivelHorario: (sala) => api.post(`salasdisponivelhorario/`, sala),
};

export default sheets;
