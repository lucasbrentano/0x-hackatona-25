import axios from 'axios';

const api = axios.create({
  // Para desenvolvimento local, use localhost ao invés do IP específico
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para adicionar token automaticamente nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@app:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o token expirou (401), redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('@app:token');
      localStorage.removeItem('@app:refreshToken');
      localStorage.removeItem('@app:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;