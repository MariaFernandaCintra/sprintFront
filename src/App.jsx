import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRouter from "./components/ProjetectedRoute";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Principal from "./pages/Principal";
import Reserva from "./pages/Reserva";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/principal"
          element={
            <ProtectedRouter>
              <Principal />
            </ProtectedRouter>
          }
        />
        <Route
          path="/reserva"
          element={
            <ProtectedRouter>
              <Reserva />
            </ProtectedRouter>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
