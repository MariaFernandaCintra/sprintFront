export const isAuthenticated = () => {
  const token = localStorage.getItem("tokenUsuario");
  return !!token;
};
