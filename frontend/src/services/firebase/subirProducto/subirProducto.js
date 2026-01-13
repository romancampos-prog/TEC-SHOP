import { validarNombreProducto, validarDescripcionProducto, validarPrecioProducto, validarCatergoriaProducto, validarEstadoProducto, validarFotoProducto } from "../validarCampos/validarCampo";


export function validarInformacion (producto) {
   let error

   error = validarNombreProducto (producto.nombre);
   if(error) throw new Error(error);

   error = validarDescripcionProducto (producto.descripcion);
   if(error) throw new Error(error);

   error = validarPrecioProducto (producto.precio);
   if(error) throw new Error(error);

   error = validarCatergoriaProducto (producto.categoria);
   if(error) throw new Error(error);

   error = validarEstadoProducto (producto.estado);
   if(error) throw new Error(error);

   error = validarFotoProducto (producto.foto);
   if(error) throw new Error(error);

}