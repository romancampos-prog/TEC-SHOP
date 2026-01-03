import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export const enviarRegistroABackend = async ({ nombre_completo, correo_institucional }) => {
  const token = await obtenerTokenFirebase();

  console.log("🪪 TOKEN EN FRONT:", token);

  const response = await fetch("http://98.92.93.155:3001/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 👈 aquí va
    },
    body: JSON.stringify({
      nombre_completo,
      correo_institucional,
    }),
  });

  const data = await response.json();
  console.log("📥 RESPUESTA BACK:", data);

  return data;
};

