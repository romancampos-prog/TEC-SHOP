import { Navigate } from "react-router-dom";
import { useAuth } from "../contexto/user.Context"; // ajusta ruta exacta

export default function RutaProtegida({ children }) {
  const { user } = useAuth();

  // Tu Provider NO renderiza children hasta que loading = false,
  // así que aquí solo validamos user
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
