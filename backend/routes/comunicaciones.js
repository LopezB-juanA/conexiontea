const express = require('express');
const router = express.Router();
const db = require('../config/database.js');
const verificarToken = require('../middleware/verificarToken');

// Obtener todas las comunicaciones
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM comunicaciones ORDER BY fecha_hora DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Obtener comunicaciones del usuario autenticado
router.get('/usuario', verificarToken, async (req, res) => {
    try {
        const userId = req.usuario.id_usuario;
        const [rows] = await db.execute(
            'SELECT * FROM comunicaciones WHERE id_usuario = ? ORDER BY fecha_hora DESC',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;