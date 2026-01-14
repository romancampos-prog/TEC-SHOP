import "./inicio-page.css";
import { useEffect, useState } from "react";
import Cabecera_Inicio from "../../components/inicio-componentes/cabecera_inicio";
import Carta_producto from "../../components/reutulizables/cartas_productos";
import { obtenerProductosBackend } from "../../services/api/inicio/obtenerProductos";

// PÁGINA DE INICIO
export default function Incio_page() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const datos = await obtenerProductosBackend();
        setProductos(datos);
        console.log("datos ya en el front: ", datos)
      } catch (error) {
        console.error("Error al cargar productos", error);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  if (cargando) {
    return <p>Cargando productos...</p>;
  }

  return (
    <>
      <Cabecera_Inicio />

      <div className="Contendor_cartas_productos">
        {productos.map((producto) => (
          <Carta_producto
            key={producto.id_producto}
            nombre={producto.nombre}
            categoria={producto.id_categoria}
            precio={producto.precio}
            imagenUrl={producto.imagen_url}
          />
        ))}
      </div>
    </>
  );
}
