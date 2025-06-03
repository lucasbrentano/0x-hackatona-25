// tests/integration/health.test.ts
import request from 'supertest';
import app from '../../src/app';

const api = request(app);

describe('API Health Check', () => {
  describe('GET /api/v1/health', () => {
    it('deve retornar status OK da API', async () => {
      const response = await api
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'OK',
        message: 'API funcionando corretamente',
        environment: 'test'
      });

      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('GET /api/v1', () => {
    it('deve retornar documentação da API', async () => {
      const response = await api
        .get('/api/v1')
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'API de Usuários, Fóruns, Feedbacks e Hashtags - Hackathon 2025',
        version: '1.0.0'
      });

      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /rota-inexistente', () => {
    it('deve retornar 404 para rotas não encontradas', async () => {
      const response = await api
        .get('/rota-inexistente')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });
});
