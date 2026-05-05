// src/pages/Comunicacion.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Comunicacion.css';

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
    const navigate = useNavigate();
    const [frase, setFrase] = useState([]);

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

    const guardarComunicacion = () => {
        alert('✅ Comunicación guardada (Mock - Fase 1)');
        limpiarFrase();
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
                </nav>
            </header>

            <main className="main">
                <div className="frase-construida">
                    <h2>📝 Tu Frase:</h2>
                    <div className="frase-container">
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