const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// --- CONFIGURACIÓN DE EXPRESS ---
const app = express();

// 1. Configuración de CORS Actualizada
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://tec-shop-4b242.web.app" // <-- Nueva URL de Hosting agregada
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SERVIDOR HTTP Y SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: { 
        origin: [
            "http://localhost:5173", 
            "http://localhost:3000",
            "https://tec-shop-4b242.web.app" // <-- También actualizar aquí para los Sockets
        ],
        methods: ["GET", "POST"]
    }
});

// --- INICIALIZAR FIREBASE ADMIN ---
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// --- CONEXIÓN A BASE DE DATOS ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'resp',
    password: 'resp_01_02',
    database: 'campus_shop'
});

db.connect((err) => {
    if (err) console.error("❌ Error conectando a MySQL:", err);
    else console.log("✅ Conectado a MySQL");
});

// --- RUTAS EXTERNAS ---
const rutasBusqueda = require('./src/routes/busquedas'); 
app.use('/busquedas', rutasBusqueda);
const rutasChat = require('./src/routes/chat');
app.use('/chat', rutasChat);

// --- ENDPOINTS DE CHAT (HISTORIAL) ---

//APIs Chat

app.post("/chat/crear-o-obtener", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token");

  try {
    const token = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const id_comprador = decoded.uid;

    const { id_producto } = req.body;
    if (!id_producto) return res.status(400).send("Falta id_producto");

    // 1. Obtener vendedor del producto
    const qProducto = `
      SELECT id_vendedor 
      FROM productos 
      WHERE id_producto = ?
    `;

    db.query(qProducto, [id_producto], (err, prod) => {
      if (err) return res.status(500).json(err);
      if (prod.length === 0) return res.status(404).send("Producto no existe");

      const id_vendedor = prod[0].id_vendedor;

      // 2. Buscar chat existente
      const qChat = `
        SELECT id_chat 
        FROM chats
        WHERE id_producto = ?
        AND id_comprador = ?
        AND id_vendedor = ?
        LIMIT 1
      `;

      db.query(
        qChat,
        [id_producto, id_comprador, id_vendedor],
        (err, chat) => {
          if (err) return res.status(500).json(err);

          // 3. Si existe, regresar
          if (chat.length > 0) {
            return res.json({ id_chat: chat[0].id_chat });
          }

          // 4. Crear chat
          const qCrear = `
            INSERT INTO chats (id_comprador, id_vendedor, id_producto)
            VALUES (?, ?, ?)
          `;

          db.query(
            qCrear,
            [id_comprador, id_vendedor, id_producto],
            (err, result) => {
              if (err) return res.status(500).json(err);

              res.json({ id_chat: result.insertId });
            }
          );
        }
      );
    });
  } catch (e) {
    res.status(403).send("Token inválido");
  }
});


// 1. Obtener lista de conversaciones
app.get('/chat/conversaciones', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("No token");
    
    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

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

// --- LÓGICA DE SOCKETS (TIEMPO REAL) ---
// io.on('connection', (socket) => {
//     console.log('🟢 Usuario conectado al Socket:', socket.id);

//     // Unirse a una sala específica
//     socket.on('join_chat', (id_chat) => {
//         socket.join(id_chat);
//         console.log(`📥 Usuario ${socket.id} unido al chat: ${id_chat}`);
//     });

//     // Salir de una sala
//     socket.on('leave_chat', (id_chat) => {
//         socket.leave(id_chat);
//         console.log(`📤 Usuario ${socket.id} salió del chat: ${id_chat}`);
//     });

//     // Enviar y recibir mensajes
//     socket.on('send_message', (data) => {
//         const { id_chat, id_emisor, contenido } = data;
//         const query = 'INSERT INTO mensajes (id_chat, id_emisor, contenido) VALUES (?, ?, ?)';
        
//         db.query(query, [id_chat, id_emisor, contenido], (err, result) => {
//             if (err) return console.error("❌ Error al guardar mensaje:", err);

//             // Notificar a todos en la sala el nuevo mensaje
//             io.to(id_chat).emit('receive_message', {
//                 id_mensaje: result.insertId,
//                 id_chat,
//                 id_emisor,
//                 contenido,
//                 fecha_envio: new Date()
//             });
//         });
//     });

//     socket.on('disconnect', () => {
//         console.log('🔴 Usuario desconectado del Socket');
//     });
// });


io.on('connection', (socket) => {
    console.log('🟢 Usuario conectado al Socket:', socket.id);

    // Unirse a una sala específica
    socket.on('join_chat', (id_chat) => {
        socket.join(id_chat);
        console.log(`📥 Usuario ${socket.id} unido al chat: ${id_chat}`);
    });

    // Salir de una sala
    socket.on('leave_chat', (id_chat) => {
        socket.leave(id_chat);
        console.log(`📤 Usuario ${socket.id} salió del chat: ${id_chat}`);
    });

    // Enviar y recibir mensajes
    socket.on('send_message', (data) => {
        const { id_chat, id_emisor, contenido } = data;
        const query = 'INSERT INTO mensajes (id_chat, id_emisor, contenido) VALUES (?, ?, ?)';
        
        db.query(query, [id_chat, id_emisor, contenido], (err, result) => {
            if (err) return console.error("❌ Error al guardar mensaje:", err);

            // Notificar a todos en la sala el nuevo mensaje
            io.to(id_chat).emit('receive_message', {
                id_mensaje: result.insertId,
                id_chat,
                id_emisor,
                contenido,
                fecha_envio: new Date()
            });
        });
    });

    socket.on('disconnect', () => {
        console.log('🔴 Usuario desconectado del Socket');
    });
});


// --- ENDPOINTS DE USUARIOS ---

app.post('/usuarios', async (req, res) => {
    const { usuario, correo } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: "Token faltante" });

    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id_usuario = decodedToken.uid;

        const query = `INSERT INTO usuarios (id_usuario, nombre_completo, correo_institucional) VALUES (?, ?, ?)`;
        db.query(query, [id_usuario, usuario, correo], (err) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.status(201).json({ message: "Usuario creado", uid: id_usuario });
        });
    } catch (error) { res.status(403).json({ error: "Token inválido" }); }
});

app.get('/usuarios', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: "No autorizado" });

    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const query = 'SELECT nombre_completo FROM usuarios WHERE id_usuario = ?';
        db.query(query, [decodedToken.uid], (err, results) => {
            if (err) return res.status(500).json({ error: "Error BD" });
            if (results.length === 0) return res.status(404).json({ error: "No encontrado" });
            res.json({ nombre: results[0].nombre_completo });
        });
    } catch (error) { res.status(403).json({ error: "Sesión inválida" }); }
});

// --- ENDPOINTS DE PRODUCTOS ---

app.get('/mis-productos', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const query = 'SELECT * FROM productos WHERE id_vendedor = ? ORDER BY fecha_publicacion DESC';
        db.query(query, [decodedToken.uid], (err, results) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.json(results);
        });
    } catch (error) { res.status(403).json({ error: "Token inválido" }); }
});

app.post('/productos', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { id_categoria, nombre, descripcion, precio, imagen_url, estado } = req.body;
        const query = `INSERT INTO productos (id_vendedor, id_categoria, nombre, descripcion, precio, imagen_url, condicion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(query, [decodedToken.uid, id_categoria, nombre, descripcion, precio, imagen_url, estado, "Disponible"], (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.status(201).json({ message: "Producto publicado", id_producto: result.insertId });
        });
    } catch (error) { res.status(403).json({ error: "Token inválido" }); }
});

app.get("/productos", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  try {
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const id_vendedor_actual = decodedToken.uid;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const busqueda = req.query.q ? `%${req.query.q}%` : null;

    let where = 'WHERE estado = "Disponible" AND id_vendedor != ?';
    let params = [id_vendedor_actual];

    if (busqueda) {
      where += " AND (nombre LIKE ? OR descripcion LIKE ?)";
      params.push(busqueda, busqueda);
    }

    /* ========= 1️⃣ PRODUCTOS PAGINADOS ========= */
    const queryProductos = `
      SELECT *
      FROM productos
      ${where}
      ORDER BY fecha_publicacion DESC
      LIMIT ? OFFSET ?
    `;

    /* ========= 2️⃣ TOTAL DE PRODUCTOS ========= */
    const queryTotal = `
      SELECT COUNT(*) AS total
      FROM productos
      ${where}
    `;

    db.query(queryTotal, params, (errTotal, totalResult) => {
      if (errTotal) {
        return res.status(500).json({ error: errTotal.sqlMessage });
      }

      const total = totalResult[0].total;

      db.query(
        queryProductos,
        [...params, limit, offset],
        (errProductos, productos) => {
          if (errProductos) {
            return res.status(500).json({ error: errProductos.sqlMessage });
          }

          res.json({
            productos,
            total,
            page,
            limit,
          });
        }
      );
    });
  } catch (error) {
    res.status(403).json({ error: "Sesión expirada" });
  }
});

app.put('/productos/:id', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { id_categoria, nombre, descripcion, precio, imagen_url, estado, condicion } = req.body;
        const condicionReal = condicion || estado;
        const query = `UPDATE productos SET id_categoria = ?, nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, condicion = ? WHERE id_producto = ? AND id_vendedor = ?`;
        db.query(query, [id_categoria, nombre, descripcion, precio, imagen_url, condicionReal, req.params.id, decodedToken.uid], (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.json({ message: "Actualizado" });
        });
    } catch (error) { res.status(403).json({ error: "Token inválido" }); }
});

app.delete('/productos/:id', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const query = 'DELETE FROM productos WHERE id_producto = ? AND id_vendedor = ?';
        db.query(query, [req.params.id, decodedToken.uid], (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.json({ message: "Eliminado" });
        });
    } catch (error) { res.status(403).json({ error: "Token inválido" }); }
});

// --- ARRANQUE DEL SERVIDOR ---
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🚀 WebSockets listos para el Chat`);
});