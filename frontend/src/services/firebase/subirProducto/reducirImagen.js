export const reducirImagen = (file, maxWidth = 1200, calidad = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new Error("Archivo inválido"));
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      // 🔹 Nunca escalar hacia arriba
      const ratio = img.width > maxWidth ? maxWidth / img.width : 1;

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Error al procesar la imagen"));
            return;
          }

          // 🔹 Salida optimizada (JPEG)
          const optimizada = new File([blob], file.name, {
            type: "image/jpeg",
          });

          resolve(optimizada);
        },
        "image/jpeg",
        calidad
      );
    };

    reader.readAsDataURL(file);
  });
};
