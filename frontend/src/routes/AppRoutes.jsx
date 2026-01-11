import { BrowserRouter, Routes, Route } from "react-router-dom";
import Incio_page from "../pages/inicio/inicio-page";
import Login from "../pages/login/Login";
import AgregarProducto from "../pages/subirProducto/AgregarProducto";
import RecuperaC from "../pages/recuperar/recuperaC";
import RutaProtegida from "./RutaProtegida";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/recuperaC" element={<RecuperaC />} />
       

        {/* RUTAS PROTEGIDAS poner aqui las demas rutas */}
        <Route
          path="/inicio"
          element={
            <RutaProtegida>
              <Incio_page />
            </RutaProtegida>
          }
        />

        <Route
          path="/subirProducto"
          element={
            <RutaProtegida>
              <AgregarProducto />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
