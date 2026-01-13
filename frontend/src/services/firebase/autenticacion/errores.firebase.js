export const mapearErrorFirebase = (error) => {
  // 🔴 Error lanzado por tus validaciones (new Error)
  if (!error.code && error.message) {
    return error.message;
  }

  // 🔵 Errores reales de Firebase
  switch (error.code) {
    case "auth/user-not-found":
      return "No existe una cuenta con ese correo";

    case "auth/wrong-password":
      return "La contraseña es incorrecta";

    case "auth/invalid-email":
      return "El correo no tiene un formato válido";

    case "auth/email-already-in-use":
      return "Este correo ya está registrado";

    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta más tarde";

    case "auth/user-disabled":
      return "Esta cuenta fue deshabilitada";

    default:
      return "Ocurrió un error de autenticación";
  }
};
