import { useEffect, useRef, useState } from "react";
import Input_texto from "../reutulizables/inputs";
import Menu_Barra from "../reutulizables/menu_barra";
import "./cabecera_Inicio.css";


const CATEGORIAS = [
  { id: null, label: "Categorías", emoji: "📦" }, // default: todas
  { id: 1, label: "Computadoras", emoji: "💻" },
  { id: 2, label: "Celulares", emoji: "📱" },
  { id: 3, label: "Audio y Video", emoji: "🎧" },
  { id: 4, label: "Componentes", emoji: "🧩" },
  { id: 5, label: "Accesorios", emoji: "🔌" },
];

export default function Cabecera_Inicio({ onCategoriaChange }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  // ===== Categorías (dropdown) =====
  const [openCategorias, setOpenCategorias] = useState(false);
  const selectorCategoriasRef = useRef(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(CATEGORIAS[0]);

  const abrir_menu = () => setMenuAbierto(true);
  const cerrar_Menu = () => setMenuAbierto(false);

  // Bloquear scroll del fondo cuando el menú esté abierto
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menuAbierto]);

  // Cerrar dropdown al click fuera / ESC
  useEffect(() => {
    function onDocClick(e) {
      if (selectorCategoriasRef.current && !selectorCategoriasRef.current.contains(e.target)) {
        setOpenCategorias(false);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpenCategorias(false);
    }

    document.addEventListener("click", onDocClick);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function toggleCategorias(e) {
    e.stopPropagation();
    setOpenCategorias((v) => !v);
  }

  function elegirCategoria(cat) {
    setCategoriaSeleccionada(cat);
    setOpenCategorias(false);
    onCategoriaChange?.(cat.id); 
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="contenedor-Padre-Cabecera">
        <div className="contendor-Hijo-arriba">
          <div className="contendor-hijo-izquierda-arriba">
            <h2 className="h2-TecShop">TECSHOP</h2>
          </div>

          <div className="contendor-hijo-buscador-derecha-arriba">
            <div className="buscador-con-usuario">
              {/* ===== Buscador ===== */}
              <div className="buscador-unido">
                <div
                  className={`selector-categorias ${openCategorias ? "open" : ""}`}
                  ref={selectorCategoriasRef}
                >
                  <button
                    type="button"
                    className="btn-categorias"
                    aria-expanded={openCategorias ? "true" : "false"}
                    aria-haspopup="true"
                    onClick={toggleCategorias}
                  >
                    <span>
                      {categoriaSeleccionada.id == null
                        ? "Categorías"
                        : `${categoriaSeleccionada.emoji} ${categoriaSeleccionada.label}`}
                    </span>

                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>

                  <div className="menu-categorias" aria-hidden={openCategorias ? "false" : "true"}>
                    <button
                      type="button"
                      className="menu-enlace"
                      onClick={() => elegirCategoria(CATEGORIAS[0])}
                    >
                      📦 Todas
                    </button>

                    {CATEGORIAS.slice(1).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className="menu-enlace"
                        onClick={() => elegirCategoria(cat)}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Input_texto className="input_buscador" />

                {/* Buscador */}
                <button className="btn-buscar" aria-label="Buscar" type="button">
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
              {/*Icono de usurio y cuenta */}
              <button
                type="button"
                className="btn-menu"
                onClick={abrir_menu}
                aria-label="Cuenta / Usuario"
                title="Usuario"
              >
                <svg
                  className="icon-user"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 13.5c-4.1 0-7.5 2.2-7.5 5.2V20h15v-1.3c0-3-3.4-5.2-7.5-5.2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="contenedor-Hijo-abajo">hola</div>
      </header>

      {/* ================= OVERLAY ================= */}
      {menuAbierto && <div className="overlay-menu" onClick={cerrar_Menu}></div>}

      {/* ================= SIDEBAR ================= */}
      <Menu_Barra abierto={menuAbierto} onClose={cerrar_Menu} />
    </>
  );
}
