# Contrato inicial de la API – TEC-SHOP

Este documento define los endpoints principales de la API.
No incluye lógica ni implementación, solo nombres y propósito.

## Autenticación

- POST /api/auth/register  
  Registro de usuario

- POST /api/auth/login  
  Inicio de sesión

## Usuarios

- GET /api/users/me  
  Obtener información del usuario autenticado

- PUT /api/users/me  
  Editar perfil del usuario

## Productos

- GET /api/products  
  Listar productos

- POST /api/products  
  Crear producto

- PUT /api/products/:id  
  Editar producto propio

- DELETE /api/products/:id  
  Eliminar producto propio

## Imágenes

- POST /api/images/upload  
  Subir imagen de producto (Firebase Storage)
