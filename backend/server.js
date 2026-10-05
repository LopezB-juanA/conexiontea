const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database.js');

const authRoutes = require('./routes/auth');
const comunicacionesRoutes = require('./routes/comunicaciones');

const app = express();
const PORT = process.env.PORT || 5000;

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

socket.on('enviar_mensaje', async (data) => {
  try {
    const fraseTexto = data.frase.map(p => p.texto).join(' ');
    const pictogramasUsados = JSON.stringify(data.frase.map(p => p.texto));
    
    const query = 'INSERT INTO comunicaciones (id_usuario, fecha_hora, pictogramas_usados, frase_texto) VALUES (?, NOW(), ?, ?)';
    const values = [data.usuarioId, pictogramasUsados, fraseTexto];
    
    await db.execute(query, values);
    console.log('Mensaje guardado en base de datos');
    
    io.emit('recibir_mensaje', data);
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
  }
});

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

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
app.use('/api/comunicaciones', comunicacionesRoutes);

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api`);
    console.log(`Conexión a BD: ${process.env.DB_NAME}`);
});