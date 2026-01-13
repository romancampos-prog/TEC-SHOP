import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/login/Login";
import RecuperaC from "../pages/recuperar/recuperaC";

import Incio_page from "../pages/inicio/inicio-page";
import AgregarProducto from "../pages/subirProducto/AgregarProducto";

import CambioContrasena from "../pages/cambiar/cambioContrasena.jsx";
import Chats from "../pages/chats/chats";
import Chat from "../pages/chat/Chat";
import Detalle from "../pages/detalleP/detalle";

import RutaProtegida from "./RutaProtegida";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== RUTAS PÚBLICAS ===== */}
        <Route path="/" element={<Login />} />
        <Route path="/recuperaC" element={<RecuperaC />} />

        {/* ===== RUTAS PROTEGIDAS ===== */}
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

        <Route
          path="/cambioContrasena"
          element={
            <RutaProtegida>
              <CambioContrasena />
            </RutaProtegida>
          }
        />

        <Route
          path="/chats"
          element={
            <RutaProtegida>
              <Chats />
            </RutaProtegida>
          }
        />

        <Route
          path="/chat"
          element={
            <RutaProtegida>
              <Chat />
            </RutaProtegida>
          }
        />

        <Route
          path="/detalle"
          element={
            <RutaProtegida>
              <Detalle />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
