import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./editarProducto.css";
import { actualizarProductoBack } from "../../services/api/editarProducto/editarProducto";

export default function EditarProducto({
  regresarA = "/perfil",
  tokenProp = "",
  onClose,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  /* =======================
     TOKEN Y PRODUCTO
     ======================= */

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
        id_producto: null,
        id_categoria: "",
        nombre: "",
        descripcion: "",
        precio: "",
        imagen_url: "",
        estado: "",
      },
    [productoRecibido]
  );

  /* =======================
     ESTADO FORMULARIO
     ======================= */

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setNombre(p.nombre ?? "");
    setDescripcion(p.descripcion ?? "");
    setPrecio(
      typeof p.precio === "number" ? String(p.precio) : (p.precio ?? "")
    );
    setEstado(p.condicion ?? "");
  }, [p]);

  /* =======================
     CERRAR
     ======================= */

  const cerrar = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate(regresarA, { replace: true });
  };

  useEffect(() => {
    const manejarEsc = (e) => {
      if (e.key === "Escape" && !guardando) cerrar();
    };
    window.addEventListener("keydown", manejarEsc);
    return () => window.removeEventListener("keydown", manejarEsc);
  }, [guardando]);

  /* =======================
     GUARDAR (PUT BACKEND)
     ======================= */

  const guardar = async (e) => {
    e.preventDefault();
    if (guardando) return;

    const productoActualizado = {
      id: p.id_producto,          // /productos/:id
      id_categoria: p.id_categoria,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: precio === "" ? 0 : Number(precio),
      estado,
      imagen_url: p.imagen_url,   // se reenvía sin tocar
    };

    try {
      setGuardando(true);

      // 🔥 LLAMADA REAL AL BACKEND (PUT)
      await actualizarProductoBack(productoActualizado);

      // 🔔 Avisar a Perfil que refresque
      window.dispatchEvent(new Event("producto-actualizado"));

      if (token) localStorage.removeItem(`producto_editar_${token}`);
      cerrar();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("No se pudo actualizar el producto");
    } finally {
      setGuardando(false);
    }
  };

  const clicFondo = (e) => {
    if (e.target.classList.contains("overlay-editar-producto") && !guardando) {
      cerrar();
    }
  };

  /* =======================
     RENDER
     ======================= */

  return (
    <div className="overlay-editar-producto" onMouseDown={clicFondo}>
      <div className="tarjeta-editar-producto" role="dialog" aria-modal="true">
        <button
          type="button"
          className="boton-cerrar"
          aria-label="Cerrar"
          onClick={cerrar}
          disabled={guardando}
        >
          ✕
        </button>

        <h1 className="titulo-editar-producto">Editar Producto</h1>
        <p className="subtitulo-editar-producto">
          Actualiza la información de tu producto
        </p>

        <form className="formulario-editar-producto" onSubmit={guardar}>
          <div className="grupo-campo">
            <label className="etiqueta-campo">Nombre del producto</label>
            <input
              className="campo-texto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={guardando}
            />
          </div>

          <div className="grupo-campo">
            <label className="etiqueta-campo">Descripción</label>
            <textarea
              className="campo-textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              disabled={guardando}
            />
            <div className="contador-caracteres">
              {descripcion.length} caracteres
            </div>
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
                  inputMode="numeric"
                  disabled={guardando}
                />
              </div>
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">Estado</label>
              <select
                className="campo-select"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                disabled={guardando}
              >
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
              </select>
            </div>
          </div>

          <div className="acciones-editar-producto">
            <button
              type="submit"
              className="boton-guardar"
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>

            <button
              type="button"
              className="boton-cancelar"
              onClick={cerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =======================
   UTIL
   ======================= */
function indicarSoloNumeros(valor) {
  return String(valor).replace(/[^\d.]/g, "");
}
