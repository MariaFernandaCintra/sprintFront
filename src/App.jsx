import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

import ProtectedRouter from "./components/secure/ProtectedRoute";

import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Principal from "./pages/Principal";
import Perfil from "./pages/Perfil";

import DefaultLayout from "./components/layout/DefaultLayout";

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto Mono', monospace",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <DefaultLayout>
                <Login />
              </DefaultLayout>
            }
          />
          <Route
            path="/cadastro"
            element={
              <DefaultLayout>
                <Cadastro />
              </DefaultLayout>
            }
          />
          <Route
            path="/principal"
            element={
              <ProtectedRouter>
                <Principal />
              </ProtectedRouter>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRouter>
                <Perfil />
              </ProtectedRouter>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
