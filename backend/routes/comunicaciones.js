const express = require('express');
const router = express.Router();
const comunicacionesController = require('../controllers/comunicacionesController');
const { verificarToken } = require('../middleware/auth');

router.get('/historial', verificarToken, comunicacionesController.obtenerHistorial);

module.exports = router;