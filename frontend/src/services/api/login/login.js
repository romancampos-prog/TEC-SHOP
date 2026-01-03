export async function obtenerPerfilBackend(token) {
  if (!token) {
    throw new Error("Token no proporcionado");
  }

  const response = await fetch("https://TU_BACKEND/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // opcional: leer mensaje de error del backend
    const errorText = await response.text();
    throw new Error(errorText || "Error al obtener perfil del backend");
  }

  const data = await response.json();

  // data debería traer: { nombre, rol }
  return data;
}
