import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function obtenerProductosBackend(
  page = 1,
  limit = 12,
  categoria = null,
  busqueda = ""
) {
  const token = await obtenerTokenFirebase();

  let url = `https://tec-shop-production.up.railway.apps/productos?page=${page}&limit=${limit}`;

  // ===== filtro por categoría (texto) =====
  if (categoria !== null) {
    url += `&categoria=${encodeURIComponent(categoria)}`;
  }

  // ===== búsqueda por texto =====
  if (busqueda) {
    url += `&q=${encodeURIComponent(busqueda)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  const data = await response.json();

  // 🔍 Debug controlado
  console.log("Respuesta backend:", data);

  return data; // { productos, total, page, limit }
}
