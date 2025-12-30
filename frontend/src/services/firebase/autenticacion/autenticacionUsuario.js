import {validarCorreo, validarContrasena, confirmarContrasena, validarNombreUsuario} from "../validarCampos/validarCampo.js";
import { registrarUsuarioFirebase, loginUsuarioFirebase } from "../autenticacion.firebase.js";


//registro con firebase
export const registroUsuario = async ({usuario, correo, contrasena, confirmContra}) => {
  let error;

  error = validarNombreUsuario(usuario);
  if (error) throw new Error(error);

  error = validarCorreo(correo);
  if (error) throw new Error(error);

  error = validarContrasena(contrasena);
  if (error) throw new Error(error);

  error = confirmarContrasena(contrasena, confirmContra);
  if (error) throw new Error(error);

  // ✅ Si todo pasó → Firebase
  return registrarUsuarioFirebase(correo, contrasena);
};


//login con firebase
export const loginUsuario = async ({correo, contrasena}) => {
  let error;

  error = validarCorreo(correo);
  if (error) throw new Error(error);

  error = validarContrasena(contrasena);
  if (error) throw new Error(error);

  return loginUsuarioFirebase(correo, contrasena);
}