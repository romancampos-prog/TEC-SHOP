const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Server } = require('socket.io');
const http = require('http');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000" } // Ajusta al puerto de tu React
});

// Inicializar Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const rutasBusqueda = require('./src/routes/busquedas'); 
app.use('/busquedas', rutasBusqueda);
const rutasChat = require('./src/routes/chat');
app.use('/chat', rutasChat);

app.use(cors({
  origin: [
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'resp',
    password: 'resp_01_02',
    database: 'campus_shop'
});

app.get('/chat/conversaciones', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("No token");
    
    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Buscamos chats donde el usuario sea comprador o vendedor
        // Nota: Ajusta los nombres de columnas según tu tabla 'chats'
        const query = `
            SELECT c.id_chat, 
            (SELECT nombre_completo FROM usuarios WHERE id_usuario = IF(c.id_comprador = ?, c.id_vendedor, c.id_comprador)) as nombre_contacto,
            (SELECT contenido FROM mensajes WHERE id_chat = c.id_chat ORDER BY fecha_envio DESC LIMIT 1) as ultimo_msj
            FROM chats c
            WHERE c.id_comprador = ? OR c.id_vendedor = ?`;

        db.query(query, [uid, uid, uid], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    } catch (e) { res.status(403).send("Token inválido"); }
});

// 2. Obtener mensajes de un chat específico
app.get('/chat/mensajes/:idChat', async (req, res) => {
    const { idChat } = req.params;
    const query = 'SELECT * FROM mensajes WHERE id_chat = ? ORDER BY fecha_envio ASC';
    db.query(query, [idChat], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});


// Lógica de Sockets
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Unirse a una sala específica (id_chat)
    socket.on('join_chat', (id_chat) => {
        socket.join(id_chat);
        console.log(`Usuario unido al chat: ${id_chat}`);
    });

    // Enviar mensaje
    socket.on('send_message', (data) => {
        const { id_chat, id_emisor, contenido } = data;
        const query = 'INSERT INTO mensajes (id_chat, id_emisor, contenido) VALUES (?, ?, ?)';
        
        db.query(query, [id_chat, id_emisor, contenido], (err, result) => {
            if (!err) {
                // Notificar a todos en la sala (incluyendo al emisor para confirmar)
                io.to(id_chat).emit('receive_message', {
                    id_mensaje: result.insertId,
                    ...data,
                    fecha_envio: new Date()
                });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// IMPORTANTE: Cambia app.listen por server.listen




app.post('/usuarios', async (req, res) => {
    const nombre_completo = req.body.usuario;
    const correo_institucional = req.body.correo;
    console.log("📦 BODY RECIBIDO:", nombre_completo, correo_institucional);


    // 1. Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No se proporcionó un token válido" });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // 2. VERIFICAR EL TOKEN (Aquí ocurre la "desencriptación" segura)
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_usuario = decodedToken.uid; // <--- ¡ESTE ES EL ID REAL!

        console.log(
            "Depuracion",
            id_usuario,
            "Token encriptado",
            token,
        )


        // 3. Validar datos
        if (!nombre_completo || !correo_institucional) {
            return res.status(400).json({ error: "Faltan datos en el body" });
        }

        // 4. Insertar en la BD usando el UID verificado
        const query = `INSERT INTO usuarios (id_usuario, nombre_completo, correo_institucional) VALUES (?, ?, ?)`;

        db.query(query, [id_usuario, nombre_completo, correo_institucional], (err, result) => {
            if (err) {
                console.log("Error 500:" + err.sqlMessage);
                return res.status(500).json({ error: err.sqlMessage });
            }
            res.status(201).json({ message: "Usuario verificado y creado", uid: id_usuario });
        });

    } catch (error) {
        console.error("Error verificando token:", error);
        res.status(403).json({ error: "Token inválido o expirado" });
    }
});


app.get('/usuarios', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // 1. Extraer el UID de forma segura desde Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_usuario = decodedToken.uid;

        // 2. Buscar solo el nombre en la base de datos
        const query = 'SELECT nombre_completo FROM usuarios WHERE id_usuario = ?';
        
        db.query(query, [id_usuario], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Error en base de datos" });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            // 3. Responder con el nombre
            res.json({ nombre: results[0].nombre_completo });
        });

    } catch (error) {
        console.error("Error de token:", error);
        res.status(403).json({ error: "Sesión inválida" });
    }
});

//ENDPOINT PRODUCTOS

// GET: Obtener SOLO los productos que yo vendo (Mis Publicaciones)
app.get('/mis-productos', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_usuario = decodedToken.uid; // Tu ID

        // Traemos todo lo que este usuario ha publicado
        const query = `
            SELECT 
                id_producto,
                id_categoria,
                nombre,
                descripcion, 
                precio, 
                imagen_url,     
                condicion,   
                fecha_publicacion
            FROM productos 
            WHERE id_vendedor = ? 
            ORDER BY fecha_publicacion DESC
        `;

        db.query(query, [id_usuario], (err, results) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.json(results);
        });

    } catch (error) {
        res.status(403).json({ error: "Token inválido" });
    }
});

//POST
app.post('/productos', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_vendedor = decodedToken.uid;

        // 1. Recibimos los datos.
        // OJO: El frontend te manda 'estado' con valor "nuevo" o "usado".
        const { id_categoria, nombre, descripcion, precio, imagen_url, estado } = req.body;

        // 2. Mapeamos los datos correctamente para la Base de Datos
        const condicionReal = estado; // Aquí guardamos "nuevo" o "usado"
        const estadoVenta = "Disponible"; // Forzamos que el producto nazca 'Disponible'

        if (!id_categoria || !nombre || !precio || !descripcion) {
            return res.status(400).json({ error: "Faltan datos obligatorios del producto" });
        }

        // 3. Insertamos en las columnas correctas:
        // 'condicion' recibe "nuevo/usado"
        // 'estado' recibe "Disponible"
        const query = `
            INSERT INTO productos (id_vendedor, id_categoria, nombre, descripcion, precio, imagen_url, condicion, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, 
            [id_vendedor, id_categoria, nombre, descripcion, precio, imagen_url, condicionReal, estadoVenta], 
            (err, result) => {
                if (err) {
                    console.error("Error MySQL:", err.sqlMessage);
                    return res.status(500).json({ error: "Error al publicar", detalle: err.sqlMessage });
                }
                res.status(201).json({
                    message: "Producto publicado con éxito",
                    id_producto: result.insertId
                });
        });

    } catch (error) {
        console.error("Token Error:", error);
        res.status(403).json({ error: "Sesión inválida o expirada" });
    }
});

//GET
router.get("/productos", async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 12;
    const categoria = req.query.categoria ?? null;

    const offset = (pagina - 1) * limite;

    let where = "";
    let params = [];

    if (categoria !== null) {
      where = "WHERE id_categoria = ?";
      params.push(categoria);
    }

    // 🔹 productos
    const [productos] = await db.query(
      `
      SELECT *
      FROM productos
      ${where}
      LIMIT ? OFFSET ?
      `,
      [...params, limite, offset]
    );

    // 🔹 total
    const [totalResult] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM productos
      ${where}
      `,
      params
    );

    res.json({
      productos,
      total: totalResult[0].total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});



//PUT
// PUT: Actualizar producto
app.put('/productos/:id', async (req, res) => {
    const id_producto = req.params.id;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_usuario_token = decodedToken.uid;

        // 🔍 DEBUG: Ver qué está llegando realmente
        console.log("Datos recibidos para UPDATE:", req.body);

        // 1. Recibimos todos los posibles datos
        const { id_categoria, nombre, descripcion, precio, imagen_url, estado, condicion } = req.body;
        
        // 2. LÓGICA ROBUSTA: 
        // Si mandan 'condicion', usamos esa. Si mandan 'estado', usamos esa.
        // Esto evita errores si el frontend cambia de nombre.
        const condicionReal = condicion || estado; 

        if (!condicionReal) {
             console.log("⚠️ Advertencia: No se recibió ni 'condicion' ni 'estado' en el body.");
        }

        // 3. QUERY CORREGIDA:
        // Actualizamos 'condicion' con el valor detectado
        const query = `
            UPDATE productos 
            SET id_categoria = ?, nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, condicion = ?
            WHERE id_producto = ? AND id_vendedor = ?
        `;

        db.query(query, 
            [id_categoria, nombre, descripcion, precio, imagen_url, condicionReal, id_producto, id_usuario_token], 
            (err, result) => {
            
            if (err) {
                console.error("Error SQL:", err.sqlMessage);
                return res.status(500).json({ error: err.sqlMessage });
            }

            // Si affectedRows es 0, es porque el ID no existe o NO eres el dueño
            if (result.affectedRows === 0) {
                return res.status(403).json({ error: "No se pudo actualizar. Verifica que el producto exista y sea tuyo." });
            }

            res.json({ message: "Producto actualizado correctamente", condicion_guardada: condicionReal });
        });

    } catch (error) {
        console.error("Error Token:", error);
        res.status(403).json({ error: "Token inválido" });
    }
});

// DELETE: Eliminar producto
// (Este se queda igual, borrar borra todo sin importar la condición)
app.delete('/productos/:id', async (req, res) => {
    const id_producto = req.params.id;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_usuario_token = decodedToken.uid;

        const query = 'DELETE FROM productos WHERE id_producto = ? AND id_vendedor = ?';

        db.query(query, [id_producto, id_usuario_token], (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });

            if (result.affectedRows === 0) {
                return res.status(403).json({ error: "No puedes eliminar un producto que no te pertenece." });
            }

            res.json({ message: "Producto eliminado exitosamente" });
        });

    } catch (error) {
        res.status(403).json({ error: "Token inválido" });
    }
});

// ✅ Arranque simple
server.listen(3001, () => {
    console.log("✅ Servidor con Sockets en puerto 3001");
});
