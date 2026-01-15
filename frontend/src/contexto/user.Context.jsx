import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { obtenerPerfilBackend } from "../services/api/login/login";
import { app } from "../services/firebase/firebase.config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    let activo = true; // 🔒 bandera de control (CLAVE)

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!activo) return;

      // 🔴 SIN SESIÓN
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // 🔑 Token Firebase
        const token = await firebaseUser.getIdToken();
        if (!activo) return;

        // 🧠 Perfil desde backend
        const perfil = await obtenerPerfilBackend(token);
        if (!activo) return;

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          nombre: perfil?.nombre ?? "",
        });
      } catch (error) {
        console.error("Error obteniendo perfil:", error);
        setUser(null);
      } finally {
        if (activo) setLoading(false);
      }
    });

    return () => {
      activo = false;   // 🔥 cancela async pendientes
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
