import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function obtenerConversaciones() {
  const token = await obtenerTokenFirebase();

  const resp = await fetch("http://3.84.71.71:3001/chat/conversaciones", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    throw new Error("No se pudieron obtener las conversaciones");
  }

  return resp.json();
}
