import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.83:5000/reservas/v1/",
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
  getUsuarioById: (id) => api.get(`/usuario/perfil/${id}`),
  getUsuarioReservaById: (id) => api.get(`/usuario/perfil/${id}/reservas`),
  postReserva: (reserva) => api.post(`reserva/`, reserva),
  getSalas: () => api.get(`salas/`),
  getSalasDisponivelHorario: (sala) => api.post(`salasdisponivelhorario/`, sala),
};

export default sheets;
