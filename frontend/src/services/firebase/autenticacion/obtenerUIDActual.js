import { getAuth } from "firebase/auth";
import { app } from "../firebase.config";

export function obtenerUidActual() {
  const auth = getAuth(app);
  return auth.currentUser?.uid || null;
}
