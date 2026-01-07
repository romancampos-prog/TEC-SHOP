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


// Inicializar Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});





const db = mysql.createConnection({
    host: 'localhost',
    user: 'resp',
    password: 'resp_01_02',
    database: 'campus_shop'
});


/* ❌ COMENTAR CHAT
io.on('connection', (socket) => {
    socket.on('join_chat', (chatId) => socket.join(chatId));
    socket.on('send_message', (data) => {
        const query = 'INSERT INTO mensajes (id_chat, id_emisor, contenido) VALUES (?, ?, ?)';
        db.query(query, [data.id_chat, data.id_emisor, data.contenido], () => {
            io.to(data.id_chat).emit('receive_message', data);
        });
    });
});
*/



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



// ✅ Arranque simple
app.listen(3001, () => {
    console.log("✅ Backend corriendo en puerto 3001 (modo prueba)");
});
