import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

function Historial() {
  const [comunicaciones, setComunicaciones] = useState([]);

    useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // La instancia 'api' ya se encarga de enviar el token automáticamente
        const response = await api.get('/comunicaciones/historial');
        setComunicaciones(response.data);
      } catch (error) {
        console.error('Error al cargar historial:', error);
      }
    };

    obtenerDatos();
  }, []);

return (
    <div className="dashboard-container">
        <header className="dashboard-header">
            <div className="header-content">
                <h1>🧩 ConexiónTEA</h1>
                <nav className="dashboard-nav">
                    <a href="/dashboard" className="nav-link">Inicio</a>
                    <a href="/historial" className="nav-link active">Historial</a>
                </nav>
                <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="btn-logout">
                    Cerrar Sesión
                </button>
            </div>
        </header>

        <main className="dashboard-main">
            <div className="welcome-card">
                <h2>📋 Historial de Comunicaciones</h2>
                <p>Registro de mensajes enviados por los usuarios</p>
            </div>

            <div className="stats-card">
                {comunicaciones.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                        Aún no hay comunicaciones registradas.
                    </p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {comunicaciones.map((com) => (
                            <div key={com.id_comunicacion} style={{
                                padding: '1.25rem',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.2s'
                            }}>
                                <div>
                                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>
                                        {com.frase_texto}
                                    </strong>
                                    {com.pictogramas_usados && (
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                            Pictogramas: {com.pictogramas_usados}
                                        </p>
                                    )}
                                </div>
                                <small style={{ color: '#94a3b8', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                    {new Date(com.fecha_hora).toLocaleString('es-ES', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </small>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>

        <footer className="dashboard-footer">
            <p>ConexiónTEA © 2026 - Porque cada voz merece ser escuchada</p>
        </footer>
    </div>
);
}

export default Historial;