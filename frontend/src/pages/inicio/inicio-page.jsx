import "./inicio-page.css";
import { useEffect, useState } from "react";
import Cabecera_Inicio from "../../components/inicio-componentes/cabecera_inicio";
import Carta_producto from "../../components/reutulizables/cartas_productos";
import { obtenerProductosBackend } from "../../services/api/inicio/obtenerProductos";
import Detalle from "../detalleP/detalle";

export default function Incio_page() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // ===== PAGINACIÓN =====
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMITE = 12;

  // ===== FILTRO CATEGORÍA =====
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // ===== MODAL DETALLE =====
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // ===== CARGA DE PRODUCTOS =====
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);

        const datos = await obtenerProductosBackend(
          pagina,
          LIMITE,
          categoriaSeleccionada,
          busqueda
        );
        console.log("busqueda actual : ", busqueda )
        setProductos(datos.productos ?? []);
        setTotal(datos.total ?? 0);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProductos([]);
        setTotal(0);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, [pagina, categoriaSeleccionada, busqueda]);

  // 🔁 Reiniciar página al cambiar categoría
  useEffect(() => {
    setPagina(1);
  }, [categoriaSeleccionada]);

  // ===== PAGINACIÓN =====
  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE));
  const hayMas = pagina < totalPaginas;

  if (cargando) {
    return <p style={{ padding: 20 }}>Cargando productos...</p>;
  }

  return (
    <>
      {/* ===== CABECERA ===== */}
      <Cabecera_Inicio
          onCategoriaChange={(categoria) => {
            setCategoriaSeleccionada(categoria);
            setBusqueda("");      // 🔥 LIMPIA búsqueda
            setPagina(1);
          }}
          onBuscarChange={(texto) => {
            setBusqueda(texto);
            setCategoriaSeleccionada(null); // 🔥 LIMPIA categoría
            setPagina(1);
          }}
        />


 
      {/* ===== LISTA DE PRODUCTOS ===== */}
      <div className="Contendor_cartas_productos">
        {productos.length === 0 ? (
          <p style={{ padding: 20 }}>No hay productos disponibles</p>
        ) : (
          productos.map((producto) => (
            <Carta_producto
              key={producto.id_producto}
              id={producto.id_producto}
              nombre={producto.nombre}
              categoria={producto.id_categoria}
              precio={producto.precio}
              imagenUrl={producto.imagen_url}
              onClick={() => setProductoSeleccionado(producto)}
            />
          ))
        )}
      </div>

      {/* ===== PAGINACIÓN ===== */}
      <div className="paginacion">
        <button
          className="btn-paginacion"
          disabled={pagina === 1}
          onClick={() => setPagina((p) => p - 1)}
        >
          ⟵ Anterior
        </button>

        <span className="pagina-actual">
          Página <strong>{pagina}</strong> de {totalPaginas}
        </span>

        <button
          className="btn-paginacion"
          disabled={!hayMas}
          onClick={() => setPagina((p) => p + 1)}
        >
          Siguiente ⟶
        </button>
      </div>

      {/* ===== MODAL DETALLE ===== */}
      {productoSeleccionado && (
        <Detalle
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
        />
      )}
    </>
  );
}
