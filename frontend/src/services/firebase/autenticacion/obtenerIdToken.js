import { getAuth } from "firebase/auth";

export const obtenerTokenFirebase = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay usuario autenticado");
  }

  // true = fuerza refresh si está expirado
  const token = await user.getIdToken(true);

  return token;
};
