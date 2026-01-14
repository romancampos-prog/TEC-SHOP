const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = require('../../db'); // Asegúrate de exportar tu conexión 'db' en un archivo aparte o pasarla aquí

// Obtener lista de chats del usuario logueado
router.get('/mis-chats', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("No autorizado");
    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Esta consulta busca chats donde el usuario sea comprador o vendedor
        // Y trae el nombre del "otro" usuario y el último mensaje
        const query = `
            SELECT 
                c.id_chat,
                u.nombre_completo AS nombre_otro,
                u.id_usuario AS id_otro,
                (SELECT contenido FROM mensajes WHERE id_chat = c.id_chat ORDER BY fecha_envio DESC LIMIT 1) AS ultimo_msj,
                (SELECT fecha_envio FROM mensajes WHERE id_chat = c.id_chat ORDER BY fecha_envio DESC LIMIT 1) AS hora
            FROM chats c
            JOIN usuarios u ON (c.id_comprador = u.id_usuario OR c.id_vendedor = u.id_usuario)
            WHERE (c.id_comprador = ? OR c.id_vendedor = ?) AND u.id_usuario != ?
        `;

        db.query(query, [uid, uid, uid], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    } catch (e) {
        res.status(403).send("Token inválido");
    }
});

// Obtener mensajes de un chat específico
router.get('/:idChat/mensajes', async (req, res) => {
    const { idChat } = req.params;
    const query = 'SELECT * FROM mensajes WHERE id_chat = ? ORDER BY fecha_envio ASC';
    
    db.query(query, [idChat], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;