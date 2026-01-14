import React, { useEffect, useMemo, useCallback, useState } from "react";
import "./perfil.css";
import EditarProducto from "./editarProducto"; 


export default function Perfil({
  usuario,
  productos = [],
  alEditarPerfil,
  alGuardarProducto,   // (productoActualizado) => {}
  alEliminarProducto,  // (producto) => {}
}) {
  const u = useMemo(
    () => ({
      nombre: usuario?.nombre ?? "Roman",
      correo: usuario?.correo ?? "21240198@leon.tecnm.mx",
      fotoUrl: usuario?.fotoUrl ?? "",
    }),
    [usuario]
  );

  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [tokenEditor, setTokenEditor] = useState("");

  const generarToken = useCallback(() => {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }, []);

  const productoVacio = useMemo(
    () => ({
      id: null,
      nombre: "",
      descripcion: "",
      precio: "",
      estado: "Seminuevo",
      categoria: "",
    }),
    []
  );

  
  useEffect(() => {
    if (mostrarEditor) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [mostrarEditor]);

 
  const abrirEditorProducto = useCallback(
    (evento, producto) => {
      evento?.stopPropagation?.();

      const token = generarToken();
      localStorage.setItem(`producto_editar_${token}`, JSON.stringify(producto));

      setTokenEditor(token);
      setMostrarEditor(true);
    },
    [generarToken]
  );

  const cerrarEditorProducto = useCallback(() => {
    // limpieza por si cerró sin guardar
    if (tokenEditor) {
      localStorage.removeItem(`producto_editar_${tokenEditor}`);
    }
    setTokenEditor("");
    setMostrarEditor(false);
  }, [tokenEditor]);

  const eliminarDesdeLista = useCallback(
    (evento, producto) => {
      evento?.stopPropagation?.();
      const nombreSeguro = (producto?.nombre || "este producto").trim();
      const ok = window.confirm(`¿Seguro que quieres eliminar "${nombreSeguro}"?`);
      if (!ok) return;
      alEliminarProducto?.(producto);
    },
    [alEliminarProducto]
  );

  return (
    <div className="pagina-perfil">
      <header className="barra-superior-perfil">
        <h1 className="titulo-barra-superior">Mi Perfil</h1>
      </header>

      <main className="contenedor-perfil">
        <section className="tarjeta-perfil" aria-label="Perfil de usuario">
          <div className="encabezado-tarjeta">
            <h2 className="titulo-encabezado">Información Personal</h2>

            <button
              type="button"
              className="boton-icono"
              aria-label="Editar información personal"
              onClick={() => alEditarPerfil?.()}
              title="Editar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="cuerpo-tarjeta">
            {/* Avatar */}
            <div className="seccion-avatar">
              <div className="avatar" aria-label="Foto de perfil">
                {u.fotoUrl ? (
                  <img className="avatar-imagen" src={u.fotoUrl} alt={`Foto de ${u.nombre}`} />
                ) : (
                  <div className="avatar-placeholder" aria-hidden="true">
                    <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                        stroke="rgba(255,255,255,.9)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M4 20a8 8 0 0 1 16 0"
                        stroke="rgba(255,255,255,.9)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="nombre-perfil">{u.nombre}</h3>
              <p className="correo-perfil">{u.correo}</p>
            </div>

            {/* Contacto */}
            <h3 className="subtitulo-seccion">Detalles de Contacto</h3>
            <div className="lista-contacto">
              <div className="elemento-contacto">
                <div className="icono-contacto" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16v12H4V6Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    <path d="m4 7 8 6 8-6" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="texto-contacto">
                  <div className="etiqueta-contacto">Email</div>
                  <div className="valor-contacto">{u.correo}</div>
                </div>
              </div>
            </div>

            {/* Productos */}
            <h3 className="subtitulo-seccion">Productos subidos</h3>

            <div className="seccion-productos">
              {(!productos || productos.length === 0) ? (
                <div
                  className="estado-vacio estado-vacio--clic"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => abrirEditorProducto(e, productoVacio)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") abrirEditorProducto(e, productoVacio);
                  }}
                  title="Prueba"
                >
                  <div className="estado-vacio__titulo">Aún no has subido productos</div>
                  <div className="estado-vacio__texto">
                    prueba(quitar)
                  </div>

                  <button
                    type="button"
                    className="boton-pequeno boton-pequeno--contorno"
                    onClick={(e) => abrirEditorProducto(e, productoVacio)}
                    style={{ marginTop: 12, alignSelf: "flex-start" }}
                  >
                    Editar producto
                  </button>
                </div>
              ) : (
                <div className="lista-productos">
                  {productos.map((p, idx) => (
                    <div
                      key={p.id ?? `${p.nombre}-${idx}`}
                      className="producto-item producto-item--clic"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => abrirEditorProducto(e, p)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") abrirEditorProducto(e, p);
                      }}
                      title="Haz clic para editar"
                    >
                      <div className="producto-info">
                        <div className="producto-nombre">{p.nombre ?? "Producto"}</div>

                        <div className="producto-detalle">
                          <span>{p.categoria ?? "Sin categoría"}</span>
                          <span className="punto-separador">•</span>
                          <span>
                            {typeof p.precio === "number"
                              ? new Intl.NumberFormat("es-MX", {
                                  style: "currency",
                                  currency: "MXN",
                                  maximumFractionDigits: 2,
                                }).format(p.precio)
                              : (p.precio ?? "Precio no disponible")}
                          </span>
                        </div>
                      </div>

                      <div className="producto-acciones">
                        <button
                          type="button"
                          className="boton-pequeno boton-pequeno--contorno"
                          onClick={(e) => abrirEditorProducto(e, p)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="boton-pequeno boton-pequeno--peligro"
                          onClick={(e) => eliminarDesdeLista(e, p)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="acciones-perfil">
              <button
                type="button"
                className="boton boton-principal"
                onClick={() => alEditarPerfil?.()}
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </section>
      </main>

      {mostrarEditor && (
        <EditarProducto
          tokenProp={tokenEditor}
          onClose={cerrarEditorProducto}
          alGuardarProducto={alGuardarProducto}
          alEliminarProducto={alEliminarProducto}
        />
      )}
    </div>
  );
}
