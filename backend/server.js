const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Ruta de prueba
app.get('/api', (req, res) => {
    res.json({ mensaje: 'API funcionando', version: '1.0.0' });
});

// Rutas
app.use('/api/auth', authRoutes);

// Iniciar servidor (solo muestra los 3 mensajes solicitados)
app.listen(PORT, () => {
    console.log(`✅ Servidor en http://localhost:${PORT}`);
    console.log(`✅ API disponible en http://localhost:${PORT}/api`);
    console.log(`✅ Conexión a BD: ${process.env.DB_NAME}`);
});