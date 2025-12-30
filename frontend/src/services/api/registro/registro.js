import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export const enviarRegistroABackend = async ({ usuario, correo }) => {
  const token = await obtenerTokenFirebase();

  const response = await fetch("//https: ruta al backend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      usuario,
      correo,
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el usuario en el backend");
  }

  return response.json();
};