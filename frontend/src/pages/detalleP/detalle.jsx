import "../styles/detalle.css";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import xboxImg from "../styles/xbox.jpg";

export default function Detalle() {
  const [abierto, setAbierto] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();

  // ✅ si disponible > 1, se muestra el selector de cantidad
  const producto = useMemo(
    () => ({
      nombre: "Xbox Series X 1TB",
      categoria: "Consolas",
      descripcion:
        "Consola Xbox Series X con 1TB de almacenamiento. Incluye control inalámbrico. Ideal para jugar en 4K y tiempos de carga rápidos con SSD.",
      disponibilidad: "Disponible",
      precio: 12999,
      fotoUrl: xboxImg,

      // ✅ AGREGA ESTO: stock/cantidad disponible
      stock: 5, // <-- si es 1 o 0, NO se muestra selector
    }),
    []
  );

  const cerrar = () => {
    setAbierto(false);
    navigate("/");
  };

  const manejarClickFondo = (e) => {
    if (e.target.classList.contains("pd-overlay")) cerrar();
  };

  useEffect(() => {
    if (!abierto) return;

    const manejarTecla = (e) => {
      if (e.key === "Escape") cerrar();
    };

    document.addEventListener("keydown", manejarTecla);

    const anteriorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", manejarTecla);
      document.body.style.overflow = anteriorOverflow;
    };
  }, [abierto]);

  const precioFormateado = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(Number(producto.precio || 0));

  const precioSinMXN = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  })
    .format(Number(producto.precio || 0))
    .replace("MXN", "")
    .trim();

  // ✅ límite máximo = stock (si no hay, 1)
  const maxCantidad = Math.max(1, Number(producto.stock || 1));

  // si el stock baja, ajusta la cantidad para no pasarse
  useEffect(() => {
    setCantidad((c) => Math.min(Math.max(1, c), maxCantidad));
  }, [maxCantidad]);

  const dec = () => setCantidad((c) => Math.max(1, c - 1));
  const inc = () => setCantidad((c) => Math.min(maxCantidad, c + 1));

  if (!abierto) return null;

  return (
    <div
      className="pd-overlay"
      onMouseDown={manejarClickFondo}
      role="dialog"
      aria-modal="true"
    >
      <div className="pd-page">
        <div className="pd-card" onMouseDown={(e) => e.stopPropagation()}>
          <button className="pd-cerrar" type="button" onClick={cerrar} aria-label="Cerrar">
            ✕
          </button>

          {/* ===== Izquierda ===== */}
          <div className="pd-left">
            <div className="pd-foto">
              {producto.fotoUrl ? (
                <img className="pd-img" src={producto.fotoUrl} alt={producto.nombre} />
              ) : (
                <div className="pd-fotoVacia">
                  <div className="pd-fotoIcono">📷</div>
                  <div className="pd-fotoTexto">Sin foto (mock)</div>
                </div>
              )}
            </div>

            <div className="pd-precioTag">{precioSinMXN}</div>
          </div>

          {/* ===== Derecha ===== */}
          <div className="pd-derecha">
            <div className="pd-chip">{producto.categoria}</div>

            <h1 className="pd-tituloP">{producto.nombre}</h1>

            <div className="pd-priceRow">
              <div className="pd-precioBig">{precioFormateado}</div>
              <span className="pd-currency">MXN</span>
            </div>

            <div className="pd-status">
              <span className="pd-dot" aria-hidden="true" />
              <span className="pd-statusText">{producto.disponibilidad}</span>
            </div>

            <div className="pd-hr" />

            <div className="pd-sectionTitle">DESCRIPCIÓN</div>
            <p className="pd-desc">{producto.descripcion}</p>

            <div className="pd-hr" />

            {/* ===== Bottom ===== */}
            <div className="pd-bottom">
              {/* ✅ SOLO SI HAY MÁS DE 1 */}
              {maxCantidad > 1 && (
                <div className="pd-qtyRow">
                  <span className="pd-qtyLabel">Cantidad:</span>

                  <div className="pd-stepper" role="group" aria-label="Selector de cantidad">
                    <button
                      className="pd-stepBtn"
                      type="button"
                      onClick={dec}
                      aria-label="Disminuir"
                    >
                      −
                    </button>
                    <span className="pd-stepVal">{cantidad}</span>
                    <button
                      className="pd-stepBtn"
                      type="button"
                      onClick={inc}
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* ✅ Quitamos Carrito y Compartir */}
              <div className="pd-actionsRow pd-actionsRow--solo">
                <button className="pd-iconBtn" type="button" aria-label="Favorito">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M12 21s-7-4.6-9.5-8.6C.8 9.6 2.1 6.7 5 5.7c1.8-.6 3.7 0 5 1.4 1.3-1.4 3.2-2 5-1.4 2.9 1 4.2 3.9 2.5 6.7C19 16.4 12 21 12 21Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>

              <Link to="/chat" className="pd-contactBtn">
                Contactar Vendedor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}