import { useEffect, useState } from "react";
import Boton_Menu from "./menu-boton"
import Menu_Barra from "./menu_barra"
import "./menuDeslizable.css";

export default function MenuDeslizable({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const abrirMenu = () => setMenuAbierto(true);
  const cerrarMenu = () => setMenuAbierto(false);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menuAbierto]);

  return (
    <>
      {/* Botón fijo o header */}
      <Boton_Menu onClick={abrirMenu} />

      {/* Contenido de la página */}
      {children}

      {/* Overlay */}
      {menuAbierto && (
        <div className="overlay-menu" onClick={cerrarMenu}></div>
      )}

      {/* Sidebar */}
      <Menu_Barra abierto={menuAbierto} onClose={cerrarMenu} />
    </>
  );
}
