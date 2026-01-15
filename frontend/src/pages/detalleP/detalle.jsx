import "./detalle.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearOObtenerChat } from "../../services/socket/chat/crear_chats";

export default function Detalle({ producto, onClose }) {
  const [abierto, setAbierto] = useState(true);
  const navigate = useNavigate();

  const cerrar = () => {
    setAbierto(false);
    onClose?.();
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

  if (!abierto || !producto) return null;

  const precioFormateado = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(Number(producto.precio || 0));

  const precioSinMXN = precioFormateado.replace("MXN", "").trim();

  /* =========================
     CONTACTAR VENDEDOR (CHAT)
     ========================= */
  const contactarVendedor = async () => {
    try {
      const { id_chat } = await crearOObtenerChat(producto.id_producto);
      cerrar();
      navigate(`/chats?idChat=${id_chat}`);
    } catch (error) {
      console.error("Error al contactar vendedor:", error);
    }
  };

  return (
    <div
      className="pd-overlay"
      onMouseDown={manejarClickFondo}
      role="dialog"
      aria-modal="true"
    >
      <div className="pd-page">
        <div className="pd-card" onMouseDown={(e) => e.stopPropagation()}>
          <button
            className="pd-cerrar"
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Izquierda */}
          <div className="pd-left">
            <div className="pd-foto">
              {producto.imagen_url ? (
                <img
                  className="pd-img"
                  src={producto.imagen_url}
                  alt={producto.nombre}
                />
              ) : (
                <div className="pd-fotoVacia">
                  <div className="pd-fotoIcono">📷</div>
                  <div className="pd-fotoTexto">Sin foto</div>
                </div>
              )}
            </div>

            <div className="pd-precioTag">{precioSinMXN}</div>
          </div>

          {/* Derecha */}
          <div className="pd-derecha">
            <div className="pd-chip">{producto.id_categoria}</div>

            <h1 className="pd-tituloP">{producto.nombre}</h1>

            <div className="pd-priceRow">
              <div className="pd-precioBig">{precioFormateado}</div>
              <span className="pd-currency">MXN</span>
            </div>

            <div className="pd-status">
              <span className="pd-dot" aria-hidden="true" />
              <span className="pd-statusText">Disponible</span>
            </div>

            <div className="pd-hr" />

            <div className="pd-sectionTitle">DESCRIPCIÓN</div>
            <p className="pd-desc">{producto.descripcion}</p>

            <div className="pd-hr" />

            {/* Bottom (solo contacto) */}
            <div className="pd-bottom">
              <button
                type="button"
                className="pd-contactBtn"
                onClick={contactarVendedor}
              >
                Contactar Vendedor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
