// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pictogramas from './pages/Pictogramas';
import Comunicacion from './pages/Comunicacion';
import Perfil from './pages/Perfil';
import Historial from './pages/Historial';

function App() {
    const estaAutenticado = () => localStorage.getItem('token') !== null;
    
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta pública */}
                <Route path="/login" element={<Login />} />
                
                {/* Rutas protegidas */}
                <Route 
                    path="/dashboard" 
                    element={estaAutenticado() ? <Dashboard /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/pictogramas" 
                    element={estaAutenticado() ? <Pictogramas /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/comunicacion" 
                    element={estaAutenticado() ? <Comunicacion /> : <Navigate to="/login" />} 
                />
                <Route
                    path="/historial"
                    element={estaAutenticado() ? <Historial /> : <Navigate to="/login" />}
                />
                <Route 
                    path="/perfil" 
                    element={estaAutenticado() ? <Perfil /> : <Navigate to="/login" />} 
                />
                
                {/* Ruta por defecto */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;