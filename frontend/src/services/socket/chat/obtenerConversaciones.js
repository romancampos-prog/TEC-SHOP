import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export async function obtenerConversaciones() {
  const token = await obtenerTokenFirebase();

  const resp = await fetch("https://tec-shop-production.up.railway.app/chat/conversaciones", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    throw new Error("No se pudieron obtener las conversaciones");
  }

  return resp.json();
}
