const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.registrar = async (req, res) => {
    const { email, password, nombre, rol } = req.body;
    
    try {
        const [existing] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        
        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO usuarios (email, password_hash, nombre, rol, estado) VALUES (?, ?, ?, ?, ?)',
            [email, passwordHash, nombre, rol || 'usuario_final', 'activo']
        );
        
        const token = jwt.sign(
            { id: result.insertId, rol: rol || 'usuario_final' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
        
        res.status(201).json({
            mensaje: 'Usuario registrado',
            usuario: { id: result.insertId, email, nombre, rol: rol || 'usuario_final' },
            token
        });
    } catch (error) {
        console.error('Error registro:', error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
        
        const user = users[0];
        if (user.estado !== 'activo') return res.status(403).json({ error: 'Cuenta inactiva' });
        
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });
        
        const token = jwt.sign(
            { id: user.id_usuario, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
        
        res.json({
            mensaje: 'Login exitoso',
            usuario: { id: user.id_usuario, email: user.email, nombre: user.nombre, rol: user.rol },
            token
        });
    } catch (error) {
        console.error('Error login:', error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// Obtener perfil
exports.obtenerPerfil = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id_usuario, email, nombre, rol FROM usuarios WHERE id_usuario = ?',
            [req.usuarioId]
        );
        if (users.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ usuario: users[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};