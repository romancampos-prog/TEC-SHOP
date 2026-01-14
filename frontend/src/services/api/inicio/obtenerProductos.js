import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function obtenerProductosBackend() {
  const token = await obtenerTokenFirebase();

  const response = await fetch("http://3.84.71.71:3001/productos", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  const productoBack = await response.json(); // ✅ CLAVE
  console.log("Producto del back:", productoBack);

  return productoBack; // ← ahora SÍ es un array
}
