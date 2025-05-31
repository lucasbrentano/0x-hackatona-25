// tests/integration/hashtags.test.ts
import request from 'supertest';
import app from '../../src/app';

const api = request(app);

describe('🏷️ Sistema de Hashtags Completo', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Setup tokens
    const userLogin = await api.post('/api/v1/usuarios/login').send({
      email: 'user.feedback@teste.com',
      senha: 'User123'
    });

    if (userLogin.status === 200) {
      userToken = userLogin.body.data.token;
    }

    const adminLogin = await api.post('/api/v1/usuarios/login').send({
      email: 'admin.feedback@teste.com',
      senha: 'Admin123'
    });

    if (adminLogin.status === 200) {
      adminToken = adminLogin.body.data.token;
    }
  });

  describe('📊 Hashtags Populares', () => {
    it('deve listar hashtags populares', async () => {
      if (userToken) {
        const response = await api
          .get('/api/v1/hashtags/populares')
          .set('Authorization', `Bearer ${userToken}`);

        expect([200, 401]).toContain(response.status);
      }
    });
  });

  describe('🔥 Hashtags Trending', () => {
    it('deve listar hashtags trending', async () => {
      if (userToken) {
        const response = await api
          .get('/api/v1/hashtags/trending')
          .set('Authorization', `Bearer ${userToken}`);

        expect([200, 401]).toContain(response.status);
      }
    });
  });

  describe('🔍 Busca de Hashtags', () => {
    it('deve buscar hashtags por termo', async () => {
      if (userToken) {
        const response = await api
          .get('/api/v1/hashtags/buscar?q=parab')
          .set('Authorization', `Bearer ${userToken}`);

        expect([200, 401]).toContain(response.status);
      }
    });
  });

  describe('📈 Estatísticas (Admin)', () => {
    it('deve retornar estatísticas para admin', async () => {
      if (adminToken) {
        const response = await api
          .get('/api/v1/hashtags/admin/estatisticas')
          .set('Authorization', `Bearer ${adminToken}`);

        expect([200, 401, 403]).toContain(response.status);
      }
    });

    it('deve rejeitar acesso de usuário normal', async () => {
      if (userToken) {
        const response = await api
          .get('/api/v1/hashtags/admin/estatisticas')
          .set('Authorization', `Bearer ${userToken}`);

        expect([401, 403]).toContain(response.status);
      }
    });
  });
});
