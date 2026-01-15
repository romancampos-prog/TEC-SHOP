export async function obtenerPerfilBackend(token) {
  if (!token) {
    throw new Error("Token no proporcionado");
  }

  const response = await fetch("http://3.84.71.71:3001/usuarios", {
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
  console.log("usuario con get ", data)
  return data;
}
