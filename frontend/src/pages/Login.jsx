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
    e.preventDefault();  // ← ¿Está esta línea?
    setMensaje({ tipo: '', texto: '' });
    setCargando(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formData.email && formData.password.length >= 6) {
        const usuarioMock = {
            id: 1,
            email: formData.email,
            nombre: formData.email.split('@')[0],
            rol: 'usuario_final'
        };
        
        localStorage.setItem('token', 'mock-token-12345');
        localStorage.setItem('usuario', JSON.stringify(usuarioMock));
        
        if (modoRegistro) {
            setMensaje({ tipo: 'success', texto: '✅ Registro exitoso. Inicia sesión.' });
            setModoRegistro(false);
        } else {
            navigate('/dashboard');  // ← ¿Está esta línea?
        }
    } else {
        setMensaje({ tipo: 'error', texto: '❌ Email o contraseña inválidos (mínimo 6 caracteres)' });
    }
    
    setCargando(false);
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