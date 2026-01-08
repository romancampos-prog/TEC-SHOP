import { BrowserRouter, Routes, Route } from "react-router-dom";
import Incio_page from "../pages/inicio/inicio-page";
import Login from "../pages/login/Login";
import AgregarProducto from "../pages/subirProducto/AgregarProducto";
import RecuperaC from "../pages/recuperar/recuperaC";
import CambioContrasena from "../pages/cambiar/cambioContrasena"; 




export default function AppRoutes() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/subirProducto" element={<AgregarProducto />} />
        <Route path="/inicio" element={<Incio_page />} />
        <Route path="/" element={<Login />} />


       <Route path="/recuperaC" element={<RecuperaC />} />
       <Route path="/cambioContrasena" element={<CambioContrasena />} />

      
      </Routes>
    </BrowserRouter>
  );
}
