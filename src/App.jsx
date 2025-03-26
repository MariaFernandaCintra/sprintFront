import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProtectedRouter from "./components/ProtectedRoute";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Principal from "./pages/Principal";
import Reserva from "./pages/Reserva";
import "@fontsource/roboto-mono";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto Mono, monospace",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
