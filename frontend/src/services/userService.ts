import { 
  LoginRequest, 
  User,
  ApiResponse
} from './types';
import api from './api';

// Função para login
export const login = async (userData: LoginRequest) => {
  try {
    const response = await api.post('/auth/login', userData);
    return response;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || 'Erro ao fazer login',
      status: error.response?.status || 500,
      data: error.response?.data
    };
  }
};


// Função para buscar usuário por ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || 'Erro ao buscar usuário',
      status: error.response?.status || 500,
      data: error.response?.data
    };
  }
};


// Função para logout
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Mesmo se der erro no servidor, limpar dados locais
    console.error('Erro no logout:', error);
  } finally {
    // Limpar localStorage
    localStorage.removeItem('@app:token');
    localStorage.removeItem('@app:refreshToken');
    localStorage.removeItem('@app:user');
  }
}