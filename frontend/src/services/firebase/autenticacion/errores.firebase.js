export const mapearErrorFirebase = (error) => {
  switch (error.code) {
    case "auth/user-not-found":
      return "No existe una cuenta con ese correo";

    case "auth/wrong-password":
      return "La contraseña es incorrecta";

    case "auth/invalid-email":
      return "El correo no tiene un formato válido";

    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta más tarde";

    case "auth/user-disabled":
      return "Esta cuenta fue deshabilitada";

    default:
      return "Correo o contraseña incorrectos";
  }
};
