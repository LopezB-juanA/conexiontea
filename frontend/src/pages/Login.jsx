// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/Login.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', nombre: '' });
    const [modoRegistro, setModoRegistro] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [cargando, setCargando] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setMensaje({ tipo: '', texto: '' });
  setCargando(true);

  try {
    // 1. Conectar con el backend
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password })
    });

    const data = await response.json();

    // 2. Si hay error, mostrarlo y detener
    if (!response.ok) {
      setMensaje({ tipo: 'error', texto: data.error || 'Credenciales inválidas' });
      setCargando(false);
      return;
    }

    // 3. Guardar datos reales
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    // 4. Navegar al dashboard
    navigate('/dashboard');

  } catch (error) {
    console.error('Error de conexión:', error);
    setMensaje({ tipo: 'error', texto: 'No se pudo conectar con el servidor' });
    setCargando(false);
  }
};

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>🧩 ConexiónTEA</h1>
                    <p>{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</p>
                </div>
                
                {mensaje.texto && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
                
                <form onSubmit={handleSubmit} className="login-form">
                    <input 
                        type="email" 
                        placeholder="Correo" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                    
                    {modoRegistro && (
                        <input 
                            type="text" 
                            placeholder="Nombre" 
                            value={formData.nombre} 
                            onChange={e => setFormData({...formData, nombre: e.target.value})} 
                            required 
                        />
                    )}
                    
                    <button type="submit" disabled={cargando}>
                        {cargando ? 'Procesando...' : (modoRegistro ? 'Registrarse' : 'Iniciar Sesión')}
                    </button>
                </form>
                
                <button 
                    className="toggle-btn" 
                    onClick={() => { 
                        setModoRegistro(!modoRegistro); 
                        setMensaje({tipo:'',texto:''}); 
                    }}
                >
                    {modoRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                </button>
            </div>
        </div>
    );
}

export default Login;