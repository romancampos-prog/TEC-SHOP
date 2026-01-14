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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 🔑 Token Firebase
      const token = await firebaseUser.getIdToken();

      // 🧠 Perfil desde backend (mock)
      const perfil = await obtenerPerfilBackend(token);

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        nombre: perfil.nombre,
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
