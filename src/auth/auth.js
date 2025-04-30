export const isAuthenticated = () => {
  const token = localStorage.getItem("tokenUsuario");
  return !!token;
};

// Ou com verificação de expiração:
import jwt_decode from "jwt-decode";

export const isTokenValid = () => {
  const token = localStorage.getItem("tokenUsuario");
  if (!token) return false;

  try {
    const { exp } = jwt_decode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};
