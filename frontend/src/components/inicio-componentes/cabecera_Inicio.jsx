import { useEffect, useState } from "react";
import Input_texto from "../reutulizables/inputs";
import Boton_Menu from "../reutulizables/menu-boton";
import Menu_Barra from "../reutulizables/menu_barra";
import "./cabecera_Inicio.css";

export default function Cabecera_Inicio() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const abrir_menu = () => setMenuAbierto(true);
  const cerrar_Menu = () => setMenuAbierto(false);

  //Bloquear scroll del fondo cuando el menú esté abierto
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuAbierto]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="contenedor-Padre-Cabecera">
        <div className="contendor-Hijo-arriba">
          <div className="contendor-hijo-izquierda-arriba">
            <Boton_Menu onClick={abrir_menu} />
            <h2 className="h2-TecShop">TECSHOP</h2>
          </div>

          <div className="contendor-hijo-buscador-derecha-arriba">
            <Input_texto className="input_buscador" />

            <button className="btn-buscar" aria-label="Buscar">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  d="M10 2a8 8 0 105.293 14.293l4.207 4.207 1.414-1.414-4.207-4.207A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="contenedor-Hijo-abajo">
          hola
        </div>
      </header>

      {/* ================= OVERLAY ================= */}
      {menuAbierto && (
        <div className="overlay-menu" onClick={cerrar_Menu}></div>
      )}

      {/* ================= SIDEBAR ================= */}
      <Menu_Barra abierto={menuAbierto} onClose={cerrar_Menu} />
    </>
  );
}
