import api from './api';

export const authService = {
    registrar: async (datos) => {
        const res = await api.post('/auth/registrar', datos);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        }
        return res.data;
    },
    
    login: async (credenciales) => {
        const res = await api.post('/auth/login', credenciales);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        }
        return res.data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    },
    
    estaAutenticado: () => localStorage.getItem('token') !== null
};