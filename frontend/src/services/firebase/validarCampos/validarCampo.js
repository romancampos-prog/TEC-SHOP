//---LOGIN Y REGISTRO---//

export function validarCorreo(email) {
    const valor = typeof email === "string" ? email.trim() : "";

    if (valor === "") {
        return "El correo no puede estar vacío";
    }

    // Solo correos institucionales @leon.tecnm.mx
    const regex = /^[^\s@]+@leon\.tecnm\.mx$/;
      //const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(valor)) {
        return "Correo: Solo correos institucionales";
    }

    return null;
}



export function validarContrasena(contrasena) {
    if (contrasena.includes(" ")) {
        return "Contraseña: sin espacios";
    }

    if (!/[a-zA-Z]/.test(contrasena)) {
        return "Contraseña: contener al menos una letra Mayucula y minuscula";
    }

    if (!/[0-9]/.test(contrasena)) {
        return "Contraseña: debe contener al menos un numero";
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

    // Permite:
    // - Una palabra (Roman)
    // - Dos palabras (Roman Campos)
    // No permite más de dos
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)?$/;

    if (!regex.test(valor)) {
        return "Usa solo nombre o nombre y apellido (máx. dos palabras)";
    }

  return null;
}

//-----------------------------------------------------------------------------------
//---SUBIR PRODUCTO---//

export function validarNombreProducto(nombre) {
    if (!nombre || nombre.trim() === "") {
        return "El nombre del producto es obligatorio";
    }

    const limpio = nombre.trim();

    if (limpio.length < 3) {
        return "El nombre debe tener al menos 3 caracteres";
    }

    if (limpio.length > 24) {
        return "El nombre no puede exceder 24 caracteres";
    }

    // No solo números o símbolos
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(limpio)) {
        return "El nombre debe contener letras";
    }
}

export function validarDescripcionProducto(descripcion) {
    if (!descripcion || descripcion.trim() === "") {
        return "La descripción es obligatoria";
    }

    const texto = descripcion.trim();

    if (texto.length < 15) {
        return "La descripción debe tener al menos 15 caracteres";
    }

    if (texto.length > 200) {
        return "La descripción no puede exceder 800 caracteres";
    }

    // Debe contener letras
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(texto)) {
        return "La descripción debe contener texto válido";
    }

    // Lista básica de palabras ofensivas (ejemplo)
    const palabrasProhibidas = ["idiota", "estúpido", "mierda", "pendejo"];

    const textoLower = texto.toLowerCase();
    const contieneOfensivas = palabrasProhibidas.some((palabra) =>
        textoLower.includes(palabra)
    );

    if (contieneOfensivas) {
        return "La descripción contiene lenguaje inapropiado";
    }

    return null; // ✔ válida
}


export function validarPrecioProducto(precio) {
    // Normalizar como string
    const limpio = String(precio).trim().replace(",", ".");

    // Obligatorio
    if (limpio === "") {
        return "El precio es obligatorio";
    }

    // Convertir solo para validar
    const valor = Number(limpio);

    if (!Number.isFinite(valor)) {
        return "El precio debe ser un número válido";
    }

    // Reglas de negocio
    if (valor <= 0) {
        return "El precio debe ser mayor a 0";
    }

    if (valor > 1_000_000) {
        return "El precio excede el límite permitido";
    }

    // 🔹 Decimales OPCIONALES (máx 2 si existen)
    if (limpio.includes(".")) {
        const decimales = limpio.split(".")[1];
        if (decimales.length > 2) {
        return "El precio solo puede tener hasta 2 decimales";
        }
    }

    return null; // ✔ válido
}



export function validarCatergoriaProducto(categoria) {
    if (!categoria || categoria === "") {
        return "Debes seleccionar una categoría";
    }

    const categoriasPermitidas = [
        "tecnologia",
        "libros",
        "ropa",
        "hogar",
        "otros",
    ];

    if (!categoriasPermitidas.includes(categoria)) {
        return "Categoría no válida";
    }

    return null; // ✔ válida
}

export function validarEstadoProducto(estado) {
    if (!estado || estado === "") {
        return "Debes seleccionar el estado del producto";
    }

    const estadosPermitidos = ["nuevo", "usado"];

    if (!estadosPermitidos.includes(estado)) {
        return "Estado del producto no válido";
    }

    return null; // ✔ válido
}


export function validarFotoProducto(foto) {
    // 1️⃣ Obligatoria
    if (!foto) {
        return "La imagen del producto es obligatoria";
    }

    // 2️⃣ Debe ser un archivo válido
    if (!(foto instanceof File)) {
        return "El archivo seleccionado no es válido";
    }

    // 3️⃣ Tipos permitidos
    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (!tiposPermitidos.includes(foto.type)) {
        return "Formato no permitido. Usa JPG, PNG o WEBP";
    }

    // 4️⃣ Tamaño máximo ORIGINAL (antes de reducir)
    const MAX_MB = 8;
    const MAX_BYTES = MAX_MB * 1024 * 1024;

    if (foto.size > MAX_BYTES) {
        return `La imagen no debe superar los ${MAX_MB} MB`;
    }

    // 5️⃣ Nombre sospechoso (opcional pero recomendable)
    if (foto.name.length > 120) {
        return "El nombre del archivo es demasiado largo";
    }

    return null; // ✔ Imagen válida
}



