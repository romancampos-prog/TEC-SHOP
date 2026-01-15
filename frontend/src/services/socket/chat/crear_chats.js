import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function crearOObtenerChat(id_producto) {
  const token = await obtenerTokenFirebase();

  const resp = await fetch(
    "http://3.84.71.71:3001/chat/crear-o-obtener",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_producto }),
    }
  );

  if (!resp.ok) {
    throw new Error("No se pudo crear/obtener el chat");
  }

  return resp.json(); // { id_chat }
}
