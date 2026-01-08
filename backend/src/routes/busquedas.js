const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Reutilizamos la configuración de tu DB
// (Nota: Idealmente deberías tener un archivo db.js compartido, pero esto funciona directo)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'resp',
    password: 'resp_01_02',
    database: 'campus_shop'
});

// ------------------------------------------------------------------
// 1. BUSCADOR (Por nombre o descripción)
// Uso: GET /busquedas/buscar?q=computadora
// ------------------------------------------------------------------
router.get('/buscar', (req, res) => {
    const termino = req.query.q; // Lo que el usuario escribe

    if (!termino) {
        return res.status(400).json({ error: "Ingresa un término de búsqueda" });
    }

    // Usamos LIKE con % para buscar coincidencias parciales
    // Buscamos solo productos "Disponibles"
    const query = `
        SELECT * FROM productos 
        WHERE (nombre LIKE ? OR descripcion LIKE ?) 
        AND estado = 'Disponible'
    `;
    
    const searchPattern = `%${termino}%`;

    db.query(query, [searchPattern, searchPattern], (err, results) => {
        if (err) {
            console.error("Error en búsqueda:", err.sqlMessage);
            return res.status(500).json({ error: err.sqlMessage });
        }
        res.json(results);
    });
});

// ------------------------------------------------------------------
// 2. PAGINACIÓN / FEED (Carga progresiva)
// Uso: GET /busquedas/feed?limit=10&offset=0  (Trae los primeros 10)
// Uso: GET /busquedas/feed?limit=10&offset=10 (Trae del 11 al 20)
// ------------------------------------------------------------------
router.get('/feed', (req, res) => {
    // Si no envían parámetros, usamos valores por defecto (traer 10, empezar en 0)
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const query = `
        SELECT * FROM productos 
        WHERE estado = 'Disponible' 
        ORDER BY fecha_publicacion DESC 
        LIMIT ? OFFSET ?
    `;

    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            console.error("Error en feed:", err.sqlMessage);
            return res.status(500).json({ error: err.sqlMessage });
        }
        
        // Lógica extra: Informar si hay más productos
        res.json({
            cantidad: results.length,
            pagina_actual_offset: offset,
            siguiente_offset: results.length < limit ? null : offset + limit,
            productos: results
        });
    });
});

// ------------------------------------------------------------------
// 3. FILTRADO POR CATEGORÍA
// Uso: GET /busquedas/categoria/Celulares
// ------------------------------------------------------------------
router.get('/categoria/:cat', (req, res) => {
    const categoria = req.params.cat;

    const query = `
        SELECT * FROM productos 
        WHERE id_categoria = ? 
        AND estado = 'Disponible'
        ORDER BY fecha_publicacion DESC
    `;

    db.query(query, [categoria], (err, results) => {
        if (err) {
            console.error("Error por categoría:", err.sqlMessage);
            return res.status(500).json({ error: err.sqlMessage });
        }
        res.json(results);
    });
});

module.exports = router;