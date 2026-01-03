const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
 const bcrypt = require('bcrypt'); 
 const { Server } = require('socket.io');
 const http = require('http'); 

const app = express();
app.use(cors());
app.use(express.json());



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


// Endpoint para registrar el usuario después de que Firebase lo crea en el Front
app.post('/usuarios', async (req, res) => {
    const { nombre_completo, correo_institucional } = req.body;
    const { id_usuario} = req.headers;


    console.log(
        "Back: ",
        nombre_completo,
        correo_institucional,
        id_usuario,
    )
    // Validación básica de datos
    if (!nombre_completo || !correo_institucional) {
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



// ✅ Arranque simple
app.listen(3001, () => {
  console.log("✅ Backend corriendo en puerto 3001 (modo prueba)");
});
