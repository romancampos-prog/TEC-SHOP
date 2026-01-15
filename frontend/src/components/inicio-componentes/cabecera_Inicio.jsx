import { useEffect, useRef, useState } from "react";
import Input_texto from "../reutulizables/inputs";
import Menu_Barra from "../reutulizables/menu_barra";
import "./cabecera_Inicio.css";

const CATEGORIAS = [
  { id: null, label: "Categorías" },
  { id: "Computadoras", label: "Computadoras" },
  { id: "Celulares", label: "Celulares" },
  { id: "Audio y Video", label: "Audio y Video" },
  { id: "Componentes", label: "Componentes" },
  { id: "Accesorios", label: "Accesorios" },
];


export default function Cabecera_Inicio({  onCategoriaChange, onBuscarChange}) {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  // ===== Categorías =====
  const [openCategorias, setOpenCategorias] = useState(false);
  const selectorCategoriasRef = useRef(null);

  // ⚠️ IMPORTANTE: iniciar con el objeto completo
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    CATEGORIAS[0]
  );

  const abrir_menu = () => setMenuAbierto(true);
  const cerrar_Menu = () => setMenuAbierto(false);

  // Bloquear scroll cuando menú esté abierto
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menuAbierto]);

  // Cerrar dropdown al click fuera / ESC
  useEffect(() => {
    function onDocClick(e) {
      if (
        selectorCategoriasRef.current &&
        !selectorCategoriasRef.current.contains(e.target)
      ) {
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

    // 🔥 enviar SOLO el id al padre (Inicio)
    onCategoriaChange?.(cat.id);
  }

  return (
    <>
      <header className="contenedor-Padre-Cabecera">
        <div className="contendor-Hijo-arriba">
          <div className="contendor-hijo-izquierda-arriba">
            <h2 className="h2-TecShop">TECSHOP</h2>
          </div>

          <div className="contendor-hijo-buscador-derecha-arriba">
            <div className="buscador-con-usuario">
              <div className="buscador-unido">
                {/* ===== SELECTOR CATEGORÍAS ===== */}
                <div
                  className={`selector-categorias ${
                    openCategorias ? "open" : ""
                  }`}
                  ref={selectorCategoriasRef}
                >
                  <button
                    type="button"
                    className="btn-categorias"
                    onClick={toggleCategorias}
                  >
                    <span>
                      {categoriaSeleccionada.id === null
                        ? "Categorías"
                        : `${categoriaSeleccionada.emoji} ${categoriaSeleccionada.label}`}
                    </span>

                    <svg width="14" height="14" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>

                  <div className="menu-categorias">
                    {CATEGORIAS.map((cat) => (
                      <button
                        key={cat.id ?? "all"}
                        type="button"
                        className="menu-enlace"
                        onClick={() => elegirCategoria(cat)}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Input_texto
                  className="input_buscador"
                  value={textoBusqueda}
                  onChange={(e) => setTextoBusqueda(e.target.value)}
                  placeholder="Buscar productos..."
                />


                <button className="btn-buscar" type="button"  onClick={() => onBuscarChange?.(textoBusqueda)} >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      fill="currentColor"
                      d="M10 2a8 8 0 105.293 14.293l4.207 4.207 1.414-1.414-4.207-4.207A8 8 0 0010 2z"
                    />
                  </svg>
                </button>
              </div>

              <button className="btn-menu" onClick={abrir_menu}>
                <svg viewBox="0 0 24 24" width="22" height="22">
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
      </header>

      {menuAbierto && (
        <div className="overlay-menu" onClick={cerrar_Menu}></div>
      )}

      <Menu_Barra abierto={menuAbierto} onClose={cerrar_Menu} />
    </>
  );
}
