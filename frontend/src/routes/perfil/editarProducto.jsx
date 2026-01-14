import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./editarProducto.css";

export default function EditarProducto({
  alGuardarProducto,   // (productoActualizado) => {}
  alEliminarProducto,  // (producto) => {}
  regresarA = "/perfil",


  tokenProp = "",      
  onClose,            
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => {
    if (tokenProp) return tokenProp;
    const params = new URLSearchParams(location.search);
    return params.get("token") || "";
  }, [location.search, tokenProp]);

  const productoRecibido = useMemo(() => {
    if (!token) return null;
    try {
      const raw = localStorage.getItem(`producto_editar_${token}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [token]);

  const p = useMemo(
    () =>
      productoRecibido || {
        id: null,
        nombre: "",
        descripcion: "",
        precio: "",
        estado: "Seminuevo",
        categoria: "",
      },
    [productoRecibido]
  );

  const esNuevo = !p.id;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState("Seminuevo");

  useEffect(() => {
    setNombre(p.nombre ?? "");
    setDescripcion(p.descripcion ?? "");
    setPrecio(typeof p.precio === "number" ? String(p.precio) : (p.precio ?? ""));
    setEstado(p.estado ?? "Seminuevo");
  }, [p]);

  const cerrar = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (window.opener && !window.opener.closed) {
      window.close();
      return;
    }

    navigate(regresarA, { replace: true });
  };

  useEffect(() => {
    const manejarEsc = (e) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", manejarEsc);
    return () => window.removeEventListener("keydown", manejarEsc);
  }, []);

  const guardar = (e) => {
    e.preventDefault();

    const productoActualizado = {
      ...p,
      id: p.id ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: precio === "" ? "" : Number(precio),
      estado,
    };

    alGuardarProducto?.(productoActualizado);

    const eventoKey = `evento_producto_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(
      eventoKey,
      JSON.stringify({ tipo: "guardar", producto: productoActualizado })
    );

    if (token) localStorage.removeItem(`producto_editar_${token}`);

    cerrar();
  };

  const eliminar = () => {
    const nombreSeguro = (p.nombre || "este producto").trim();
    const ok = window.confirm(`¿Seguro que quieres eliminar "${nombreSeguro}"?`);
    if (!ok) return;

    alEliminarProducto?.(p);

    const eventoKey = `evento_producto_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(
      eventoKey,
      JSON.stringify({ tipo: "eliminar", producto: p })
    );

    if (token) localStorage.removeItem(`producto_editar_${token}`);

    cerrar();
  };

  const clicFondo = (e) => {
    if (e.target.classList.contains("overlay-editar-producto")) cerrar();
  };

  return (
    <div className="overlay-editar-producto" onMouseDown={clicFondo}>
      <div className="tarjeta-editar-producto" role="dialog" aria-modal="true">
        <button
          type="button"
          className="boton-cerrar"
          aria-label="Cerrar"
          onClick={cerrar}
          title="Cerrar"
        >
          ✕
        </button>

        <h1 className="titulo-editar-producto">
          {esNuevo ? "Editar Producto" : "Editar Producto"}
        </h1>

        <p className="subtitulo-editar-producto">
          {esNuevo ? "Agrega la información de tu producto" : "Actualiza la información de tu producto"}
        </p>

        <form className="formulario-editar-producto" onSubmit={guardar}>
          <div className="grupo-campo">
            <label className="etiqueta-campo">Nombre del producto</label>
            <input
              className="campo-texto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. iPhone 13 Pro"
              required
            />
          </div>

          <div className="grupo-campo">
            <label className="etiqueta-campo">Descripción</label>
            <textarea
              className="campo-textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe tu producto..."
              rows={4}
            />
            <div className="contador-caracteres">{descripcion.length} caracteres</div>
          </div>

          <div className="fila-dos-columnas">
            <div className="grupo-campo">
              <label className="etiqueta-campo">Precio (MXN)</label>
              <div className="campo-precio">
                <span className="prefijo-precio">$</span>
                <input
                  className="input-precio"
                  value={precio}
                  onChange={(e) => setPrecio(indicarSoloNumeros(e.target.value))}
                  placeholder="12000"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">Estado</label>
              <select
                className="campo-select"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option>Nuevo</option>
                <option>Seminuevo</option>
                <option>Usado</option>
              </select>
            </div>
          </div>

          <div className="acciones-editar-producto">
            <button type="submit" className="boton-guardar">
              {esNuevo ? "Crear" : "Guardar Cambios"}
            </button>

            <button type="button" className="boton-cancelar" onClick={cerrar}>
              Cancelar
            </button>
          </div>

          {!esNuevo && (
            <div className="contenedor-eliminar">
              <button type="button" className="boton-eliminar" onClick={eliminar}>
                Eliminar Producto
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function indicarSoloNumeros(valor) {
  return String(valor).replace(/[^\d.]/g, "");
}

