// src/pages/Perfil.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Perfil.css';

function Perfil() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [config, setConfig] = useState({
        esquemaColores: 'claro',
        tamañoFuente: 16,
        contraste: 'normal',
        animaciones: true,
        sonidos: true,
        tiempoEspera: 3000
    });

    useEffect(() => {
        const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
        setUsuario(usuarioGuardado);
    }, []);

    // ✅ FUNCIÓN DE LOGOUT CON CONFIRMACIÓN
    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de cerrar sesión?')) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const guardarConfiguracion = () => {
        localStorage.setItem('configuracion', JSON.stringify(config));
        alert('✅ Configuración guardada (Mock - Fase 1)');
    };

    return (
        <div className="perfil-container">
            <header className="header">
                <h1>🧩 ConexiónTEA</h1>
                <nav className="nav">
                    <a href="/dashboard" className="nav-link">Inicio</a>
                    <a href="/pictogramas" className="nav-link">Pictogramas</a>
                    <a href="/comunicacion" className="nav-link">Comunicación</a>
                    <a href="/perfil" className="nav-link active">Perfil</a>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </nav>
            </header>

            <main className="main">
                <div className="perfil-card">
                    <h2>👤 Información del Usuario</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Nombre:</label>
                            <span>{usuario?.nombre || 'Usuario'}</span>
                        </div>
                        <div className="info-item">
                            <label>Email:</label>
                            <span>{usuario?.email || 'usuario@ejemplo.com'}</span>
                        </div>
                        <div className="info-item">
                            <label>Rol:</label>
                            <span>{usuario?.rol || 'usuario_final'}</span>
                        </div>
                    </div>
                </div>

                <div className="config-card">
                    <h2>⚙️ Configuración de Accesibilidad</h2>
                    
                    <div className="config-item">
                        <label>Esquema de Colores:</label>
                        <select
                            value={config.esquemaColores}
                            onChange={(e) => setConfig({...config, esquemaColores: e.target.value})}
                        >
                            <option value="claro">Claro</option>
                            <option value="oscuro">Oscuro</option>
                            <option value="alto-contraste">Alto Contraste</option>
                        </select>
                    </div>

                    <div className="config-item">
                        <label>Tamaño de Fuente: {config.tamañoFuente}px</label>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={config.tamañoFuente}
                            onChange={(e) => setConfig({...config, tamañoFuente: parseInt(e.target.value)})}
                            className="range-input"
                        />
                    </div>

                    <div className="config-item">
                        <label>Nivel de Contraste:</label>
                        <select
                            value={config.contraste}
                            onChange={(e) => setConfig({...config, contraste: e.target.value})}
                        >
                            <option value="normal">Normal</option>
                            <option value="alto">Alto</option>
                            <option value="muy-alto">Muy Alto</option>
                        </select>
                    </div>

                    <div className="config-item checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={config.animaciones}
                                onChange={(e) => setConfig({...config, animaciones: e.target.checked})}
                            />
                            Animaciones Activas
                        </label>
                    </div>

                    <div className="config-item checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={config.sonidos}
                                onChange={(e) => setConfig({...config, sonidos: e.target.checked})}
                            />
                            Sonidos Activos
                        </label>
                    </div>

                    <button onClick={guardarConfiguracion} className="btn-guardar-config">
                        💾 Guardar Configuración
                    </button>
                </div>
            </main>

            <footer className="footer">
                <p>ConexiónTEA © 2026 - Porque cada voz merece ser escuchada</p>
            </footer>
        </div>
    );
}

export default Perfil;