const db = require('../config/database.js');

exports.obtenerHistorial = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM comunicaciones ORDER BY fecha_hora DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
};