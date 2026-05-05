// src/pages/Pictogramas.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pictogramas.css';

const pictogramasMock = [
    { id: 1, codigo: 'ARA-001', categoria: 'emociones', etiquetas: 'feliz, alegria', ruta: '😊' },
    { id: 2, codigo: 'ARA-002', categoria: 'emociones', etiquetas: 'triste, llanto', ruta: '😢' },
    { id: 3, codigo: 'ARA-003', categoria: 'acciones', etiquetas: 'comer, hambre', ruta: '🍎' },
    { id: 4, codigo: 'ARA-004', categoria: 'acciones', etiquetas: 'beber, sed', ruta: '💧' },
    { id: 5, codigo: 'ARA-005', categoria: 'personas', etiquetas: 'familia, madre', ruta: '👨‍👧' },
    { id: 6, codigo: 'ARA-006', categoria: 'lugares', etiquetas: 'casa, hogar', ruta: '🏠' },
    { id: 7, codigo: 'ARA-007', categoria: 'objetos', etiquetas: 'juguete, juego', ruta: '⚽' },
    { id: 8, codigo: 'ARA-008', categoria: 'acciones', etiquetas: 'dormir, descanso', ruta: '😴' },
];

function Pictogramas() {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('todas');

    // ✅ FUNCIÓN DE LOGOUT CON CONFIRMACIÓN
    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de cerrar sesión?')) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const filtrarPictogramas = () => {
        return pictogramasMock.filter(p => {
            const matchBusqueda = p.etiquetas.toLowerCase().includes(busqueda.toLowerCase());
            const matchCategoria = categoria === 'todas' || p.categoria === categoria;
            return matchBusqueda && matchCategoria;
        });
    };

    return (
        <div className="pictogramas-container">
            <header className="header">
                <h1>🧩 ConexiónTEA</h1>
                <nav className="nav">
                    <a href="/dashboard" className="nav-link">Inicio</a>
                    <a href="/pictogramas" className="nav-link active">Pictogramas</a>
                    <a href="/comunicacion" className="nav-link">Comunicación</a>
                    <a href="/perfil" className="nav-link">Perfil</a>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </nav>
            </header>

            <main className="main">
                <div className="filters">
                    <input
                        type="text"
                        placeholder="🔍 Buscar pictograma..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="search-input"
                        aria-label="Buscar pictograma"
                    />
                    <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="category-select"
                        aria-label="Filtrar por categoría"
                    >
                        <option value="todas">Todas las categorías</option>
                        <option value="emociones">Emociones</option>
                        <option value="acciones">Acciones</option>
                        <option value="personas">Personas</option>
                        <option value="lugares">Lugares</option>
                        <option value="objetos">Objetos</option>
                    </select>
                </div>

                <div className="pictogramas-grid">
                    {filtrarPictogramas().map(p => (
                        <div key={p.id} className="pictograma-card" tabIndex="0" aria-label={p.etiquetas}>
                            <div className="pictograma-icon">{p.ruta}</div>
                            <h3>{p.etiquetas.split(',')[0]}</h3>
                            <p className="categoria">{p.categoria}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="footer">
                <p>ConexiónTEA © 2026 - Porque cada voz merece ser escuchada</p>
            </footer>
        </div>
    );
}

export default Pictogramas;