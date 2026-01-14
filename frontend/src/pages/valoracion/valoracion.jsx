import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./valoracion.css";

export default function Valoracion({
  abierto = true,
  cliente = {
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    avatarUrl: "",
  },
  onCancelar,          
  onEnviarValoracion,  
}) {
  const navigate = useNavigate();

  const [calificacion, setCalificacion] = useState(0);
  const [hoverCalificacion, setHoverCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const refDialogo = useRef(null);

  const cancelarLocal = useCallback(() => {
    if (typeof onCancelar === "function") return onCancelar();
    navigate("/chats"); 
  }, [onCancelar, navigate]);

  const puedeEnviar = useMemo(() => {
    return calificacion > 0 && comentario.trim().length > 0 && !enviando;
  }, [calificacion, comentario, enviando]);

  useEffect(() => {
    if (!abierto) return;

    const t = setTimeout(() => {
      refDialogo.current?.focus?.();
    }, 0);

    const manejarTecla = (e) => {
      if (e.key === "Escape") {
        cancelarLocal();
      }
    };

    window.addEventListener("keydown", manejarTecla);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", manejarTecla);
    };
  }, [abierto, cancelarLocal]);

  useEffect(() => {
    if (abierto) {
      setCalificacion(0);
      setHoverCalificacion(0);
      setComentario("");
      setEnviando(false);
    }
  }, [abierto]);

  const manejarClickFondo = (e) => {
    if (e.target.classList.contains("valoracion-overlay")) {
      cancelarLocal();
    }
  };

  const manejarSeleccionEstrella = (valor) => {
    setCalificacion(valor);
  };

  const manejarHoverEstrella = (valor) => {
    setHoverCalificacion(valor);
  };

  const manejarSalirHover = () => {
    setHoverCalificacion(0);
  };

  const manejarCambioComentario = (e) => {
    setComentario(e.target.value);
  };

  const enviarValoracion = async () => {
    if (!puedeEnviar) return;

    try {
      setEnviando(true);

      if (typeof onEnviarValoracion === "function") {
        await onEnviarValoracion({
          calificacion,
          comentario: comentario.trim(),
          cliente,
        });
      } else {
        console.log("Valoración enviada:", {
          calificacion,
          comentario: comentario.trim(),
          cliente,
        });
      }

      cancelarLocal(); 
    } finally {
      setEnviando(false);
    }
  };

  // Si se usa como modal controlado y te mandan abierto=false, no renderiza.
  // Como ruta, abierto default=true, así que se verá.
  if (!abierto) return null;

  const valorMostrado = hoverCalificacion || calificacion;

  return (
    <div className="valoracion-overlay" onMouseDown={manejarClickFondo}>
      <div
        className="valoracion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="valoracion-titulo"
        tabIndex={-1}
        ref={refDialogo}
      >
        <div className="valoracion-encabezado">
          <h1 id="valoracion-titulo" className="valoracion-titulo">
            Valorar Cliente
          </h1>
          <p className="valoracion-subtitulo">Comparte tu experiencia con este cliente</p>
        </div>

        <div className="valoracion-cliente">
          <div className="valoracion-avatar">
            {cliente.avatarUrl ? (
              <img
                src={cliente.avatarUrl}
                alt={`Avatar de ${cliente.nombre}`}
                className="valoracion-avatar-img"
              />
            ) : (
              <span className="valoracion-avatar-iniciales" aria-hidden="true">
                {obtenerIniciales(cliente.nombre)}
              </span>
            )}
          </div>

          <div className="valoracion-datos">
            <div className="valoracion-nombre">{cliente.nombre}</div>
            <div className="valoracion-email">{cliente.email}</div>
          </div>
        </div>

        <div className="valoracion-seccion">
          <label className="valoracion-label">Calificación</label>

          <div className="valoracion-estrellas" onMouseLeave={manejarSalirHover}>
            {Array.from({ length: 5 }).map((_, i) => {
              const valor = i + 1;
              const activa = valor <= valorMostrado;

              return (
                <button
                  key={valor}
                  type="button"
                  className={`valoracion-estrella-btn ${activa ? "activa" : ""}`}
                  onClick={() => manejarSeleccionEstrella(valor)}
                  onMouseEnter={() => manejarHoverEstrella(valor)}
                  aria-label={`${valor} estrella${valor === 1 ? "" : "s"}`}
                >
                  <EstrellaSVG activa={activa} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="valoracion-seccion">
          <label className="valoracion-label" htmlFor="valoracion-comentario">
            Comentario
          </label>

          <textarea
            id="valoracion-comentario"
            className="valoracion-textarea"
            placeholder="Cuéntanos sobre tu experiencia con este cliente..."
            value={comentario}
            onChange={manejarCambioComentario}
            rows={3}
          />
        </div>

        <div className="valoracion-acciones">
          <button
            type="button"
            className="btn-enviar"
            onClick={enviarValoracion}
            disabled={!puedeEnviar}
          >
            {enviando ? "Enviando..." : "Enviar Valoración"}
          </button>

          <button type="button" className="btn-cancelar" onClick={cancelarLocal}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function EstrellaSVG({ activa }) {
  return (
    <svg className="valoracion-estrella" width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={activa ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function obtenerIniciales(nombre = "") {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  const a = partes[0]?.[0] ?? "";
  const b = partes[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "U";
}
