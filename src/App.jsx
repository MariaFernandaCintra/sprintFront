import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Principal from "./pages/Principal";
import Home from "./pages/Home";
import ProtectedRouter from "./components/ProjetectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/principal" element={
          <ProtectedRouter>
            <Principal/>
          </ProtectedRouter> } />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;