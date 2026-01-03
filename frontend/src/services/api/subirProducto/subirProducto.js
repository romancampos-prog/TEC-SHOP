import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function subirProductoBackend(producto) {
  const token = await obtenerTokenFirebase();

  const response = await fetch("https://TU_BACKEND/api/productos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el producto");
  }

  return response.json();
}