import React from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import HeaderPrincipal from "./HeaderPrincipal";
import Footer from "./Footer";

const DefaultLayout = ({ children, headerRender }) => {
  return (
    <div>
      {headerRender === 1 ? (
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100px" }}
        >
          <Header />
          {/* aqui vem o conteudo da pagina */}
          <Box
            sx={{
              border:'none',
              margin:0,
              padding:0,
            }}
          >
            {children}
          </Box>
          <Footer />
        </Box>
      ) : (
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100px" }}
        >
          <HeaderPrincipal />
          {/* aqui vem o conteudo da pagina */}
            <Box
            sx={{
              border:'none',
              margin:0,
              padding:0,
            }}
            >{children}</Box>
          <Footer />
        </Box>
      )}
    </div>
  );
};

export default DefaultLayout;
