import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function obtenerMensajes(idChat) {
  const token = await obtenerTokenFirebase();

  const response = await fetch(
    `http://3.84.71.71:3001/chat/mensajes/${idChat}`,
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
