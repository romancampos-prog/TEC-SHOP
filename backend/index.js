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

//POST
app.post('/productos', async (req, res) => {
    const authHeader = req.headers.authorization;

    // 1. Verificación de Seguridad
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // 2. Extraer el UID del vendedor desde el Token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_vendedor = decodedToken.uid;

        // 3. Obtener datos del body
        const { id_categoria, nombre, descripcion, precio, imagen_url } = req.body;

        // 4. Validación de campos obligatorios
        if (!id_categoria || !nombre || !precio || !descripcion) {
            return res.status(400).json({ error: "Faltan datos obligatorios del producto" });
        }

        const query = `
            INSERT INTO productos (id_vendedor, id_categoria, nombre, descripcion, precio, imagen_url) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // 5. Insertar en MySQL
        db.query(query, [id_vendedor, id_categoria, nombre, descripcion, precio, imagen_url], (err, result) => {
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
app.get('/productos', async (req, res) => {
    const authHeader = req.headers.authorization;

    // 1. Verificación de Seguridad
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // 2. Extraer el UID del vendedor desde el Token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_vendedor = decodedToken.uid;

        // 3. inicializar el query
        const query = 'SELECT id_producto, id_categoria, nombre, descripcion, precio, imagen_url, fecha_publicacion FROM productos WHERE estado = "Disponible" AND id_vendedor != ? ORDER BY fecha_publicacion DESC';

        // 5. Extraer en MySQL
        db.query(query, [id_vendedor], (err, results) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.json(results);
        });

    } catch (error) {
        console.error("Token Error:", error);
        res.status(403).json({ error: "Sesión inválida o expirada" });
    }
});

//PUT
app.put('/productos/:id', async (req, res) => {
    const id_producto = req.params.id;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // 1. Extraer UID del token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_usuario_token = decodedToken.uid;

        // 2. Extraer datos a actualizar del body
        const { id_categoria, nombre, descripcion, precio, imagen_url, estado } = req.body;

        // 3. Ejecutar Update con doble validación en el WHERE
        // Solo actualizará si el id_producto existe Y el id_vendedor coincide con el token
        const query = `
            UPDATE productos 
            SET id_categoria = ?, nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, estado = ?
            WHERE id_producto = ? AND id_vendedor = ?
        `;

        db.query(query, [id_categoria, nombre, descripcion, precio, imagen_url, estado, id_producto, id_usuario_token], (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });

            // result.affectedRows será 0 si el producto no existe o si el usuario no es el dueño
            if (result.affectedRows === 0) {
                return res.status(403).json({ error: "No tienes permiso para editar este producto o no existe." });
            }

            res.json({ message: "Producto actualizado correctamente" });
        });

    } catch (error) {
        res.status(403).json({ error: "Token inválido" });
    }
});

//DELETE
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

        // Eliminar con validación de dueño
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
