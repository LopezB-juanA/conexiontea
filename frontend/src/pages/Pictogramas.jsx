import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Pictogramas() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const [modo, setModo] = useState(localStorage.getItem('modo') || 'claro');
    const [tema, setTema] = useState(localStorage.getItem('tema') || 'azul');

    const pictogramas = [
        { id: 1, texto: 'Feliz', emoji: '😊', categoria: 'emociones' },
        { id: 2, texto: 'Triste', emoji: '😢', categoria: 'emociones' },
        { id: 3, texto: 'Comer', emoji: '🍎', categoria: 'acciones' },
        { id: 4, texto: 'Beber', emoji: '💧', categoria: 'acciones' },
        { id: 5, texto: 'Casa', emoji: '🏠', categoria: 'lugares' },
        { id: 6, texto: 'Jugar', emoji: '🎮', categoria: 'acciones' },
        { id: 7, texto: 'Dormir', emoji: '😴', categoria: 'acciones' },
        { id: 8, texto: 'Familia', emoji: '👨‍👩', categoria: 'personas' }
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
        <div className="pictogramas-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>🧩 ConexiónTEA</h1>
                    <nav className="dashboard-nav">
                        <a href="/dashboard" className="nav-link">Inicio</a>
                        <a href="/pictogramas" className="nav-link active">Pictogramas</a>
                        <a href="/comunicacion" className="nav-link">Comunicación</a>
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
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    🖼️ Catálogo de Pictogramas
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {pictogramas.map(p => (
                        <div key={p.id} style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            cursor: 'pointer'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{p.emoji}</div>
                            <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{p.texto}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                                {p.categoria}
                            </p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="dashboard-footer">
                <p>ConexiónTEA © 2026 - Porque cada voz merece ser escuchada</p>
            </footer>
        </div>
    );
}

export default Pictogramas;