import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from "./firebase.config";

export async function subirFotoFirebase(foto) {
  if (!(foto instanceof File)) {
    throw new Error("Archivo inválido para subir");
  }

  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const storage = getStorage(app);

  // 🔹 nombre único (uid + timestamp)
  const nombreArchivo = `${user.uid}_${Date.now()}.jpg`;

  // 🔹 ruta recomendada
  const storageRef = ref(storage, `productos/${user.uid}/${nombreArchivo}`);

  // 1️⃣ Subir archivo
  await uploadBytes(storageRef, foto);

  // 2️⃣ Obtener URL pública
  const url = await getDownloadURL(storageRef);

  return url; // ✅ ESTA es la URL que guardas en BD
}
