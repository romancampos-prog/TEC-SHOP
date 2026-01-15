import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function eliminarProductoBack(idProducto) {
  const token = await obtenerTokenFirebase();

  const response = await fetch(
    `https://tec-shop-production.up.railway.app/productos/${idProducto}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo eliminar el producto");
  }

  return response.json();
}
