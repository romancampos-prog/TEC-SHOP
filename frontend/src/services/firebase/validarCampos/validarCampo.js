export function validarCorreo (email) {
     const valor = typeof email === "string" ? email.trim() : "";

    if (valor === "") {
        return "El correo no puede estar vacío";
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!regex.test(valor)) {
        return "El correo no tiene un formato válido";
    }

    return null;
}


export function validarContrasena(contrasena) {
    if (contrasena === undefined || contrasena === null) {
        return "La contraseña es obligatoria";
    }

    if (typeof contrasena !== "string") {
        return "La contraseña debe ser un texto";
    }

    if (contrasena.includes(" ")) {
        return "La contraseña no puede contener espacios";
    }

    if (!/[a-zA-Z]/.test(contrasena)) {
        return "La contraseña debe contener al menos una letra";
    }

    if (!/[0-9]/.test(contrasena)) {
        return "La contraseña debe contener al menos un número";
    }

    return null; // sin errores
}


export function confirmarContrasena(contrasena1, contrasena2) {
    if(contrasena1 != contrasena2){
        return "Las contraseñas no coinciden"
    }

    return null;
}


export function validarNombreUsuario (username) {
    const valor = typeof username === "string" ? username.trim() : "";

  if (valor === "") {
    return "El nombre de usuario es obligatorio";
  }

  // Letras a-z, A-Z, ñ, Ñ
  const regex = /^[a-zA-ZñÑ]+$/;

  if (!regex.test(valor)) {
    return "El nombre de usuario solo puede contener letras";
  }

  return null;
}


