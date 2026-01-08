import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function obtenerProductosBackend() {
  const token = await obtenerTokenFirebase();

  const response = await fetch("http://localhost:3001/productos", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  return response.json();
}
