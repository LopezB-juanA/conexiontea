import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import '../styles/Dashboard.css';

const socket = io('http://localhost:5000');

function Comunicacion() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const [modo, setModo] = useState(localStorage.getItem('modo') || 'claro');
    const [tema, setTema] = useState(localStorage.getItem('tema') || 'azul');
    const [frase, setFrase] = useState([]);

    const pictogramas = [
        { id: 1, texto: 'Feliz', emoji: '😊', categoria: 'emociones' },
        { id: 2, texto: 'Triste', emoji: '😢', categoria: 'emociones' },
        { id: 3, texto: 'Comer', emoji: '🍎', categoria: 'acciones' },
        { id: 4, texto: 'Beber', emoji: '💧', categoria: 'acciones' },
        { id: 5, texto: 'Casa', emoji: '🏠', categoria: 'lugares' },
        { id: 6, texto: 'Jugar', emoji: '🎮', categoria: 'acciones' },
        { id: 7, texto: 'Dormir', emoji: '😴', categoria: 'acciones' },
        { id: 8, texto: 'Familia', emoji: '👨‍👩‍', categoria: 'personas' }
    ];

    useEffect(() => {
        if (modo === 'oscuro') {
            document.documentElement.setAttribute('data-mode', 'oscuro');
        } else {
            document.documentElement.removeAttribute('data-mode');
        }
        localStorage.setItem('modo', modo);
    }, [modo]);

    useEffect(() => {
        if (tema === 'azul') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', tema);
        }
        localStorage.setItem('tema', tema);
    }, [tema]);

    const toggleModo = () => setModo(modo === 'claro' ? 'oscuro' : 'claro');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const agregarPictograma = (p) => setFrase([...frase, p]);
    const limpiarFrase = () => setFrase([]);

    const enviarFrase = () => {
        if (frase.length === 0) return;
        socket.emit('enviar_mensaje', {
            usuarioId: usuario.id_usuario,
            frase: frase
        });
        alert('Mensaje enviado');
        setFrase([]);
    };

    const [fontSize] = useState(parseInt(localStorage.getItem('fontSize')) || 16);
const [contraste] = useState(localStorage.getItem('contrast') || 'normal');
const [animaciones] = useState(localStorage.getItem('animaciones') !== 'off');

useEffect(() => {
    document.documentElement.style.setProperty('--font-size', fontSize + 'px');
    if (contraste === 'alto') {
        document.documentElement.setAttribute('data-contrast', 'alto');
    } else {
        document.documentElement.removeAttribute('data-contrast');
    }
    if (!animaciones) {
        document.documentElement.setAttribute('data-no-animations', 'true');
    } else {
        document.documentElement.removeAttribute('data-no-animations');
    }
}, []);

    return (
        <div className="comunicacion-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>🧩 ConexiónTEA</h1>
                    <nav className="dashboard-nav">
                        <a href="/dashboard" className="nav-link">Inicio</a>
                        <a href="/pictogramas" className="nav-link">Pictogramas</a>
                        <a href="/comunicacion" className="nav-link active">Comunicación</a>
                        <a href="/historial" className="nav-link">Historial</a>
                        <a href="/perfil" className="nav-link">Perfil</a>
                    </nav>
                    <div className="header-actions">
                        <button onClick={toggleModo} className="btn-modo">
                            {modo === 'oscuro' ? '☀️ Claro' : '🌙 Oscuro'}
                        </button>
                        <button onClick={handleLogout} className="btn-logout">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="stats-card" style={{ marginBottom: '2rem' }}>
                    <h3>📋 Tu Frase:</h3>
                    <div style={{
                        minHeight: '80px',
                        padding: '1rem',
                        background: 'var(--bg)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginBottom: '1rem'
                    }}>
                        {frase.length === 0 ? (
                            <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                Selecciona pictogramas para construir tu frase
                            </span>
                        ) : frase.map((p, i) => (
                            <div key={i} style={{
                                padding: '0.5rem 1rem',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }} onClick={() => setFrase(frase.filter((_, idx) => idx !== i))}>
                                <span style={{ fontSize: '1.5rem' }}>{p.emoji}</span>
                                <div style={{ fontSize: '0.85rem' }}>{p.texto}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                            <button 
                                onClick={limpiarFrase} 
                                style={{ 
                                    padding: '0.5rem 1rem',
                                    background: frase.length === 0 ? 'var(--text-secondary)' : 'var(--danger)', 
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: frase.length === 0 ? 'not-allowed' : 'pointer',
                                    opacity: frase.length === 0 ? 0.5 : 1,
                                    fontWeight: '600',
                                    fontSize: '0.95rem'
                                }}
                            >
                                🗑️ Limpiar
                            </button>
                        <button onClick={enviarFrase} className="btn-logout" style={{ background: 'var(--success)' }}>
                            📤 Enviar
                        </button>
                    </div>
                </div>

                <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    🖼️ Pictogramas Disponibles:
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '1rem'
                }}>
                    {pictogramas.map(p => (
                        <button key={p.id} onClick={() => agregarPictograma(p)} style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ fontSize: '2rem' }}>{p.emoji}</span>
                            <span style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{p.texto}</span>
                        </button>
                    ))}
                </div>
            </main>

            <footer className="dashboard-footer">
                <p>ConexiónTEA © 2026 - Porque cada voz merece ser escuchada</p>
            </footer>
        </div>
    );
}

export default Comunicacion;