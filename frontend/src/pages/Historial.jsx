import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

function Historial() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const [modo, setModo] = useState(localStorage.getItem('modo') || 'claro');
    const [tema, setTema] = useState(localStorage.getItem('tema') || 'azul');
    const [comunicaciones, setComunicaciones] = useState([]);

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

    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                const response = await api.get('/comunicaciones/usuario');
                setComunicaciones(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        cargarHistorial();
    }, []);

    const toggleModo = () => setModo(modo === 'claro' ? 'oscuro' : 'claro');

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

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="historial-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>🧩 ConexiónTEA</h1>
                    <nav className="dashboard-nav">
                        <a href="/dashboard" className="nav-link">Inicio</a>
                        <a href="/pictogramas" className="nav-link">Pictogramas</a>
                        <a href="/comunicacion" className="nav-link">Comunicación</a>
                        <a href="/historial" className="nav-link active">Historial</a>
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
                <div className="welcome-card" style={{ marginBottom: '2rem' }}>
                    <h2>📋 Historial de Comunicaciones</h2>
                    <p>Registro de mensajes enviados por los usuarios</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {comunicaciones.length === 0 ? (
                        <div className="stats-card" style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No hay comunicaciones registradas</p>
                        </div>
                    ) : comunicaciones.map((com, i) => (
                        <div key={i} className="stats-card" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <strong style={{ color: 'var(--text-primary)' }}>{com.frase_texto}</strong>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                    Pictogramas: {com.pictogramas_usados}
                                </p>
                            </div>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                {new Date(com.fecha_hora).toLocaleString('es-ES')}
                            </span>
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

export default Historial;