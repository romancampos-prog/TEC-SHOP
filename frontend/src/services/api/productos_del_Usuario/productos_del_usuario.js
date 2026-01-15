import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function obtenerProductosBack() {
  const token = await obtenerTokenFirebase();

  const response = await fetch("https://tec-shop-production.up.railway.app/mis-productos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  const data = await response.json();

  console.log("mis productos que llegan del back: ", data)
  return data.productos ?? data;
}
