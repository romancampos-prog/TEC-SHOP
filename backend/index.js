const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'resp',
    password: 'resp_01_02',
    database: 'campus_shop'
});

// --- API USUARIOS ---
// Registro (CREATE) - Sin el campo 'rol'
app.post('/usuarios', async (req, res) => {
    try {
        const { nombre, telefono, correo, password } = req.body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO usuarios (nombre_completo, telefono, correo_institucional, password_hash) VALUES (?, ?, ?, ?)';
        db.query(query, [nombre, telefono, correo, passwordHash], (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.status(201).json({ message: "Usuario creado con éxito" });
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Login (Verificación)
app.post('/login', (req, res) => {
    const { correo, password } = req.body;
    const query = 'SELECT id_usuario, nombre_completo, password_hash FROM usuarios WHERE correo_institucional = ?';
    
    db.query(query, [correo], async (err, result) => {
        if (err) return res.status(500).json({ error: "Error de servidor" });
        if (result.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const match = await bcrypt.compare(password, result[0].password_hash);
        if (match) {
            res.json({ 
                usuario: { id: result[0].id_usuario, nombre: result[0].nombre_completo } 
            });
        } else {
            res.status(401).json({ error: "Contraseña incorrecta" });
        }
    });
});

// --- CHAT LOGIC ---
io.on('connection', (socket) => {
    socket.on('join_chat', (chatId) => socket.join(chatId));
    socket.on('send_message', (data) => {
        const query = 'INSERT INTO mensajes (id_chat, id_emisor, contenido) VALUES (?, ?, ?)';
        db.query(query, [data.id_chat, data.id_emisor, data.contenido], () => {
            io.to(data.id_chat).emit('receive_message', data);
        });
    });
});

//---solicitud de registro usuarios
// Endpoint para registrar el usuario después de que Firebase lo crea en el Front
app.post('/usuarios', async (req, res) => {
    const { id_usuario, nombre_completo, correo_institucional } = req.body;

    // Validación básica de datos
    if (!id_usuario || !nombre_completo || !correo_institucional) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = `
        INSERT INTO usuarios (id_usuario, nombre_completo, correo_institucional) 
        VALUES (?, ?, ?)
    `;

    db.query(query, [id_usuario, nombre_completo, correo_institucional], (err, result) => {
        if (err) {
            console.error("ERROR DE MYSQL:", err.sqlMessage);
            // Manejar error de correo duplicado o violación de CHECK
            return res.status(500).json({ 
                error: "No se pudo registrar el usuario", 
                detalle: err.sqlMessage 
            });
        }
        res.status(201).json({ 
            message: "Perfil de usuario creado en AWS", 
            id: id_usuario 
        });
    });
});

server.listen(3001, () => console.log("✅ Backend corriendo en puerto 3001"));