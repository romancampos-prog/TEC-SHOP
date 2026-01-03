import { obtenerTokenFirebase } from "../../firebase/autenticacion/obtenerIdToken";

export const enviarRegistroABackend = async ({ usuario, correo }) => {
  const token = await obtenerTokenFirebase();

  /* 🔴 BACKEND REAL (NO SE USA AÚN)
  const response = await fetch("https://ruta-real-backend/api/usuarios", {
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
  */

  // 🟢 MOCK TEMPORAL (SOLO FRONTEND)
  console.log("📦 MOCK → envío al backend:", {
    usuario,
    correo,
    token,
  });

  // Simulamos respuesta exitosa del backend
  return {
    success: true,
    usuario,
    correo,
    rol: "user",
  };
};
