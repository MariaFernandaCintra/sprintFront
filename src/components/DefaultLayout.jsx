
// Componentes
import { Header, Footer } from "../components";

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default DefaultLayout;
