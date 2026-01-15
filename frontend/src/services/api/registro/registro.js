import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export const enviarRegistroABackend = async ({ usuario, correo }) => {
  const token = await obtenerTokenFirebase();

  console.log("🪪 TOKEN EN FRONT:", token);

  const response = await fetch("http://3.84.71.71:3001/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 👈 aquí va
    },
    body: JSON.stringify({
      usuario,
      correo,
    }),
  });

  const data = await response.json();
  console.log("📥 RESPUESTA BACK:", data);

  return data;
};

