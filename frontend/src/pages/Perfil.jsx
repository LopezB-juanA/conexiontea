import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Perfil() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const [modo, setModo] = useState(localStorage.getItem('modo') || 'claro');
    const [tema, setTema] = useState(localStorage.getItem('tema') || 'azul');
    const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('fontSize')) || 16);
    const [contraste, setContraste] = useState(localStorage.getItem('contrast') || 'normal');
    const [animaciones, setAnimaciones] = useState(localStorage.getItem('animaciones') !== 'off');
    const [sonidos, setSonidos] = useState(localStorage.getItem('sonidos') !== 'off');

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
        document.documentElement.style.setProperty('--font-size', fontSize + 'px');
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    useEffect(() => {
        if (contraste === 'alto') {
            document.documentElement.setAttribute('data-contrast', 'alto');
        } else {
            document.documentElement.removeAttribute('data-contrast');
        }
        localStorage.setItem('contrast', contraste);
    }, [contraste]);

    useEffect(() => {
        localStorage.setItem('animaciones', animaciones ? 'on' : 'off');
        if (!animaciones) {
            document.documentElement.setAttribute('data-no-animations', 'true');
        } else {
            document.documentElement.removeAttribute('data-no-animations');
        }
    }, [animaciones]);

    useEffect(() => {
        localStorage.setItem('sonidos', sonidos ? 'on' : 'off');
    }, [sonidos]);

    const toggleModo = () => setModo(modo === 'claro' ? 'oscuro' : 'claro');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="perfil-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1> ConexiónTEA</h1>
                    <nav className="dashboard-nav">
                        <a href="/dashboard" className="nav-link">Inicio</a>
                        <a href="/pictogramas" className="nav-link">Pictogramas</a>
                        <a href="/comunicacion" className="nav-link">Comunicación</a>
                        <a href="/historial" className="nav-link">Historial</a>
                        <a href="/perfil" className="nav-link active">Perfil</a>
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

            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
                {/* Título */}
                <div style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '2rem',
                    
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '0.5rem' }}>⚙️ Configuración de Accesibilidad</h2>
                </div>

                {/* Información de la cuenta */}
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        fontSize: '1.3rem'
                    }}>Información de la cuenta</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            padding: '1.2rem',
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                        }}>
                            <strong style={{ color: 'var(--text-secondary)', fontSize: '1rem', display: 'block', marginBottom: '0.3rem' }}>Nombre:</strong>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>{usuario?.nombre || 'Usuario'}</p>
                        </div>
                        <div style={{
                            padding: '1.2rem',
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                        }}>
                            <strong style={{ color: 'var(--text-secondary)', fontSize: '1rem', display: 'block', marginBottom: '0.3rem' }}>Correo electrónico:</strong>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>{usuario?.email || 'usuario@ejemplo.com'}</p>
                        </div>
                        <div style={{
                            padding: '1.2rem',
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                        }}>
                            <strong style={{ color: 'var(--text-secondary)', fontSize: '1rem', display: 'block', marginBottom: '0.3rem' }}>Rol:</strong>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0, textTransform: 'capitalize' }}>{usuario?.rol || 'Usuario'}</p>
                        </div>
                    </div>
                </div>

                {/* Configuración de Accesibilidad */}
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        fontSize: '1.3rem'
                    }}>⚙️ Configuración de Accesibilidad</h3>

                    {/* Esquema de Colores */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Esquema de Colores:</label>
                        <select
                            value={modo}
                            onChange={(e) => setModo(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                background: 'var(--bg)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="claro">Claro</option>
                            <option value="oscuro">Oscuro</option>
                        </select>
                    </div>

                    {/* Tamaño de Fuente */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Tamaño de Fuente: {fontSize}px
                        </label>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* Nivel de Contraste */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nivel de Contraste:</label>
                        <select
                            value={contraste}
                            onChange={(e) => setContraste(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                background: 'var(--bg)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="normal">Normal</option>
                            <option value="alto">Alto</option>
                        </select>
                    </div>

                    {/* Animaciones */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={animaciones}
                                onChange={(e) => setAnimaciones(e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            Animaciones Activas
                        </label>
                    </div>

                    {/* Sonidos */}
                    <div>
                        <label style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={sonidos}
                                onChange={(e) => setSonidos(e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            Sonidos Activos
                        </label>
                    </div>
                </div>

                {/* Tema de Color */}
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '2rem'
                }}>
                    <h3 style={{
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                        marginBottom: '0.5rem',
                        fontSize: '1.3rem'
                    }}>Tema de Color</h3>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1rem' }}>
                        Personaliza la apariencia de la aplicación
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <button onClick={() => setTema('azul')} style={{
                            padding: '1rem',
                            background: tema === 'azul' ? 'var(--primary)' : 'var(--bg)',
                            color: tema === 'azul' ? 'white' : 'var(--text-primary)',
                            border: '2px solid var(--primary)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem'
                        }}> 🔵Azul</button>
                        <button onClick={() => setTema('verde')} style={{
                            padding: '1rem',
                            background: tema === 'verde' ? 'var(--primary)' : 'var(--bg)',
                            color: tema === 'verde' ? 'white' : 'var(--text-primary)',
                            border: '2px solid var(--primary)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem'
                        }}>🟢 Verde</button>
                        <button onClick={() => setTema('calido')} style={{
                            padding: '1rem',
                            background: tema === 'calido' ? 'var(--primary)' : 'var(--bg)',
                            color: tema === 'calido' ? 'white' : 'var(--text-primary)',
                            border: '2px solid var(--primary)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem'
                        }}> 🟠Cálido</button>
                    </div>
                </div>
            </main>

            <footer className="dashboard-footer">
                <p>ConexiónTEA © 2026 - Porque cada voz merece ser escuchada</p>
            </footer>
        </div>
    );
}

export default Perfil;