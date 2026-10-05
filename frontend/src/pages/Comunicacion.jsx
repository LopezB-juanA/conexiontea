// src/pages/Comunicacion.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Comunicacion.css';
import { io } from 'socket.io-client';
import { useEffect, useRef } from 'react';

const pictogramasMock = [
    { id: 1, emoji: '😊', texto: 'Feliz' },
    { id: 2, emoji: '😢', texto: 'Triste' },
    { id: 3, emoji: '🍎', texto: 'Comer' },
    { id: 4, emoji: '💧', texto: 'Beber' },
    { id: 5, emoji: '🏠', texto: 'Casa' },
    { id: 6, emoji: '⚽', texto: 'Jugar' },
    { id: 7, emoji: '😴', texto: 'Dormir' },
    { id: 8, emoji: '👨‍👩‍👧', texto: 'Familia' },
];

function Comunicacion() {
    const datosUsuario = JSON.parse(localStorage.getItem('usuario'));
    const navigate = useNavigate();
    const [frase, setFrase] = useState([]);
    const socket = io('http://localhost:5000');
const socketRef = useRef(socket);
    // ✅ FUNCIÓN DE LOGOUT CON CONFIRMACIÓN
    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de cerrar sesión?')) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const agregarPictograma = (p) => {
        setFrase([...frase, p]);
    };

    const eliminarPictograma = (index) => {
        setFrase(frase.filter((_, i) => i !== index));
    };

    const limpiarFrase = () => {
        setFrase([]);
    };

    useEffect(() => {
    const socket = socketRef.current;

    socket.on('recibir_mensaje', (data) => {
    console.log('Mensaje recibido en tiempo real:', data);
        });

    return () => {
    socket.off('recibir_mensaje');
    };
    }, []);

const guardarComunicacion = () => {
  const mensaje = {
    usuarioId: datosUsuario.id,
    frase: frase,
    timestamp: new Date().toISOString()
  };

  socket.emit('enviar_mensaje', mensaje);
  setFrase([]);
};

    return (
        <div className="comunicacion-container">
            <header className="header">
                <h1>🧩 ConexiónTEA</h1>
                <nav className="nav">
                    <a href="/dashboard" className="nav-link">Inicio</a>
                    <a href="/pictogramas" className="nav-link">Pictogramas</a>
                    <a href="/comunicacion" className="nav-link active">Comunicación</a>
                    <a href="/perfil" className="nav-link">Perfil</a>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                    <button onClick={limpiarFrase} className="btn-limpiar">
                        <span aria-hidden="true">🗑️</span> Limpiar
                    </button>

                    <button onClick={guardarComunicacion} className="btn-guardar" disabled={frase.length === 0}>
                        <span aria-hidden="true">💾</span> Guardar
                    </button>
                </nav>
            </header>

            <main className="main">
                <div className="frase-construida">
                    <h2>📝 Tu Frase:</h2>
                    <div className="frase-container" aria-live="polite">
                        {frase.length === 0 ? (
                            <p className="vacio">Selecciona pictogramas para construir tu frase</p>
                        ) : (
                            frase.map((p, index) => (
                                <div key={index} className="frase-item" onClick={() => eliminarPictograma(index)}>
                                    <span className="emoji">{p.emoji}</span>
                                    <span className="texto">{p.texto}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="frase-actions">
                        <button onClick={limpiarFrase} className="btn-limpiar">🗑️ Limpiar</button>
                        <button onClick={guardarComunicacion} className="btn-guardar" disabled={frase.length === 0}>
                            💾 Guardar
                        </button>
                    </div>
                </div>

                <div className="pictogramas-disponibles">
                    <h2>🔤 Pictogramas Disponibles:</h2>
                    <div className="pictogramas-grid">
                        {pictogramasMock.map(p => (
                            <button
                                key={p.id}
                                className="pictograma-btn"
                                onClick={() => agregarPictograma(p)}
                                aria-label={`Agregar ${p.texto}`}
                            >
                                <span className="emoji">{p.emoji}</span>
                                <span className="texto">{p.texto}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>ConexiónTEA © 2026 - Porque cada voz merece ser escuchada</p>
            </footer>
        </div>
    );
}

export default Comunicacion;