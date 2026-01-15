import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../firebase.config";

const storage = getStorage(app);

/**
 * Elimina una imagen de Firebase Storage usando su URL completa
 * @param {string} imagenUrl
 */
export async function eliminarImagenFirebase(imagenUrl) {
  if (!imagenUrl) return;

  try {
    const imageRef = ref(storage, imagenUrl);
    await deleteObject(imageRef);
    console.log("Imagen eliminada de Firebase");
  } catch (error) {
    console.error("Error al eliminar imagen de Firebase:", error);
    throw error;
  }
}