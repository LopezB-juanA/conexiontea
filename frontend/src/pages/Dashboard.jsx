// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
        setUsuario(usuarioGuardado);
    }, []);

    // ✅ FUNCIÓN DE LOGOUT CON CONFIRMACIÓN
    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de cerrar sesión?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            navigate('/login');
        }
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
                        <a href="/perfil" className="nav-link">Perfil</a>
                    </nav>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="welcome-card">
                    <h2>¡Bienvenido, {usuario?.nombre || 'Usuario'}!</h2>
                    <p>Selecciona una opción para comenzar</p>
                </div>

                <div className="cards-container">
                    <div className="card" onClick={() => navigate('/pictogramas')}>
                        <div className="card-icon">📚</div>
                        <h3>Pictogramas</h3>
                        <p>Explora el catálogo de pictogramas disponibles</p>
                    </div>

                    <div className="card" onClick={() => navigate('/comunicacion')}>
                        <div className="card-icon">💬</div>
                        <h3>Comunicación</h3>
                        <p>Construye frases usando pictogramas</p>
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
                            <span className="stat-number">0</span>
                            <span className="stat-label">Comunicaciones</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">Inicial</span>
                            <span className="stat-label">Nivel</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Días Activo</span>
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