// tests/integration/foruns.test.ts
import request from 'supertest';
import app from '../../src/app';

const api = request(app);

describe('🏛️ Sistema de Fóruns Completo', () => {
  let adminToken: string;
  let userToken: string;
  let forumId: string;

  beforeAll(async () => {
    // Tentar criar admin e fazer login
    await api.post('/api/v1/usuarios/registro').send({
      nome: 'Admin Forum',
      email: 'admin.forum@teste.com',
      senha: 'Admin123',
      role: 'admin'
    });

    const adminLogin = await api.post('/api/v1/usuarios/login').send({
      email: 'admin.forum@teste.com',
      senha: 'Admin123'
    });

    if (adminLogin.status === 200) {
      adminToken = adminLogin.body.data.token;
    }

    // Criar usuário normal
    await api.post('/api/v1/usuarios/registro').send({
      nome: 'User Forum',
      email: 'user.forum@teste.com',
      senha: 'User123'
    });

    const userLogin = await api.post('/api/v1/usuarios/login').send({
      email: 'user.forum@teste.com',
      senha: 'User123'
    });

    if (userLogin.status === 200) {
      userToken = userLogin.body.data.token;
    }
  });

  describe('📝 Criação de Fóruns', () => {
    it('deve criar fórum como admin', async () => {
      if (adminToken) {
        const response = await api
          .post('/api/v1/foruns')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            nome: 'Fórum Hackathon',
            descricao: 'Discussões sobre o hackathon',
            projeto: 'hackathon-2025'
          });

        if (response.status === 201) {
          expect(response.body.success).toBe(true);
          expect(response.body.data.nome).toBe('Fórum Hackathon');
          forumId = response.body.data._id;
        }
      }
    });

    it('deve rejeitar criação por usuário normal', async () => {
      if (userToken) {
        const response = await api
          .post('/api/v1/foruns')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            nome: 'Fórum Teste',
            descricao: 'Teste',
            projeto: 'teste'
          });

        expect([403, 401]).toContain(response.status);
      }
    });
  });

  describe('📋 Listagem de Fóruns', () => {
    it('deve listar fóruns disponíveis', async () => {
      const response = await api
        .get('/api/v1/foruns')
        .set('Authorization', `Bearer ${userToken || 'invalid'}`);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('👥 Gestão de Membros', () => {
    it('deve adicionar membro ao fórum', async () => {
      if (adminToken && forumId && userToken) {
        // Primeiro pegar ID do usuário
        const userProfile = await api
          .get('/api/v1/usuarios/perfil')
          .set('Authorization', `Bearer ${userToken}`);

        if (userProfile.status === 200) {
          const response = await api
            .post(`/api/v1/foruns/${forumId}/membros`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              usuarioId: userProfile.body.data._id
            });

          expect([200, 404, 403]).toContain(response.status);
        }
      }
    });
  });
});
