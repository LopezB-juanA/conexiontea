import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const [modo, setModo] = useState(localStorage.getItem('modo') || 'claro');
    const [tema, setTema] = useState(localStorage.getItem('tema') || 'azul');
    const [estadisticas, setEstadisticas] = useState({
        totalComunicaciones: 0,
        nivel: 'Inicial',
        diasActivo: 0
    });

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
        const cargarEstadisticas = async () => {
            try {
                const response = await api.get('/usuario/estadisticas');
                setEstadisticas(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        cargarEstadisticas();
    }, []);

    const toggleModo = () => setModo(modo === 'claro' ? 'oscuro' : 'claro');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>🧩 ConexiónTEA</h1>
                    <nav className="dashboard-nav">
                        <a href="/dashboard" className="nav-link active">Inicio</a>
                        <a href="/pictogramas" className="nav-link">Pictogramas</a>
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
                <div className="welcome-card">
                    <h2>¡Bienvenido, {usuario?.nombre || 'Usuario'}!</h2>
                    <p>Selecciona una opción para comenzar</p>
                </div>

                <div className="cards-container">
                    <div className="card" onClick={() => navigate('/pictogramas')}>
                        <div className="card-icon">🖼️</div>
                        <h3>Pictogramas</h3>
                        <p>Explora el catálogo de pictogramas disponibles</p>
                    </div>
                    <div className="card" onClick={() => navigate('/comunicacion')}>
                        <div className="card-icon">📚</div>
                        <h3>Comunicación</h3>
                        <p>Construye frases usando pictogramas</p>
                    </div>
                    <div className="card" onClick={() => navigate('/historial')}>
                        <div className="card-icon">📋</div>
                        <h3>Historial</h3>
                        <p>Revisa el registro de comunicaciones</p>
                    </div>
                    <div className="card" onClick={() => navigate('/perfil')}>
                        <div className="card-icon">⚙️</div>
                        <h3>Perfil</h3>
                        <p>Configura tu accesibilidad y preferencias</p>
                    </div>
                </div>

                <div className="stats-card">
                    <h3>📊 Tu Progreso</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">{estadisticas.totalComunicaciones}</div>
                            <div className="stat-label">Comunicaciones</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{estadisticas.nivel}</div>
                            <div className="stat-label">Nivel</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{estadisticas.diasActivo}</div>
                            <div className="stat-label">Días Activo</div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="dashboard-footer">
                <p>ConexiónTEA © 2026 - Porque cada voz merece ser escuchada</p>
            </footer>
        </div>
    );
}

export default Dashboard;