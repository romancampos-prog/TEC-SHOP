import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function actualizarProductoBack(producto) {
  const token = await obtenerTokenFirebase();

  const response = await fetch(
    `http://3.84.71.71:3001/productos/${producto.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_categoria: producto.id_categoria,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen_url: producto.imagen_url,
        estado: producto.estado,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo actualizar el producto");
  }

  return response.json();
}
