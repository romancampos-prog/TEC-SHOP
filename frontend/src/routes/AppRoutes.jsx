import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/login/Login";
import RecuperaC from "../pages/recuperar/recuperaC";

import Incio_page from "../pages/inicio/inicio-page";
import AgregarProducto from "../pages/subirProducto/AgregarProducto";
import CambioContrasena from "../pages/cambiar/cambioContrasena";
import Chats from "../pages/chats/chats";
import Chat from "../pages/chat/Chat";
import Detalle from "../pages/detalleP/detalle";
import Perfil from "./perfil/perfil";
import EditarProducto from "./perfil/editarProducto";
import Valoracion from "../pages/valoracion/valoracion";

import ProtectedLayout from "../contexto/ProtectedLayouts";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===== RUTAS PÚBLICAS (SIN CONTEXTO) ===== */}
        <Route path="/" element={<Login />} />
        <Route path="/recuperaC" element={<RecuperaC />} />

        {/* ===== RUTAS PROTEGIDAS (CON CONTEXTO) ===== */}
        <Route element={<ProtectedLayout />}>
          <Route path="/inicio" element={<Incio_page />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/editarProducto" element={<EditarProducto />} />
          <Route path="/subirProducto" element={<AgregarProducto />} />
          <Route path="/cambioContrasena" element={<CambioContrasena />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/detalle" element={<Detalle />} />
          <Route path="/valoracion" element={<Valoracion />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
