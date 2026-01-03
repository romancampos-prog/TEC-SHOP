const express = require('express');
// const mysql = require('mysql2'); ❌ no usar ahora
const cors = require('cors');
// const bcrypt = require('bcrypt'); ❌ no usar ahora
// const { Server } = require('socket.io'); ❌ no usar ahora
// const http = require('http'); ❌ no usar ahora

const app = express();
app.use(cors());
app.use(express.json());

// ❌ NO servidor http extra
// ❌ NO socket.io
// ❌ NO MySQL

/* ❌ COMENTAR DB
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'resp',
    password: 'resp_01_02',
    database: 'campus_shop'
});
*/

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


app.post('/usuarios', (req, res) => {
  console.log("📦 BODY:", req.body);
  console.log("🪪 AUTH HEADER:", req.headers.authorization);

  res.status(200).json({
    ok: true,
    body: req.body,
    auth: req.headers.authorization,
  });
});
;


// ✅ Arranque simple
app.listen(3001, () => {
  console.log("✅ Backend corriendo en puerto 3001 (modo prueba)");
});
