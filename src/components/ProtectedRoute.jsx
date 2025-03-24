import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authenticated");
  return isAuthenticated ? children : <Navigate to="/" />;
};
export default ProtectedRouter;
