import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function obtenerMensajes(idChat) {
  const token = await obtenerTokenFirebase();

  const response = await fetch(
    `https://tec-shop-production.up.railway.app/chat/mensajes/${idChat}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener mensajes");
  }

  return response.json();
}
