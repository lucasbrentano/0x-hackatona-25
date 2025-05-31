// tests/helpers/index.ts
import request from 'supertest';
import app from '../../src/app';

export const api = request(app);

// Função auxiliar para criar usuário via API (mais realista)
export const createUserViaAPI = async (userData: any = {}) => {
  const defaultUser = {
    nome: 'Test User',
    email: 'test@example.com',
    senha: 'Test123',
    role: 'usuario'
  };

  const response = await api
    .post('/api/v1/usuarios/registro')
    .send({ ...defaultUser, ...userData });

  return response;
};

// Função para fazer login via API
export const loginViaAPI = async (email: string, senha: string) => {
  const response = await api
    .post('/api/v1/usuarios/login')
    .send({ email, senha });

  return response;
};

// Helper para headers de autorização
export const authHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

// Helper para validar estrutura de resposta da API
export const expectApiSuccess = (response: any, expectedData: any = {}) => {
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
  
  if (Object.keys(expectedData).length > 0) {
    expect(response.body.data).toMatchObject(expectedData);
  }
};

// Helper para validar erro da API
export const expectApiError = (response: any, expectedMessage?: string) => {
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
  
  if (expectedMessage) {
    expect(response.body.message).toBe(expectedMessage);
  }
};
