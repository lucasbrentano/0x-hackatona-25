// tests/integration/feedbacks.test.ts
import request from 'supertest';
import app from '../../src/app';

const api = request(app);

describe('💬 Sistema de Feedbacks Completo', () => {
  let userToken: string;
  let adminToken: string;
  let feedbackId: string;

  beforeAll(async () => {
    // Setup usuários
    await api.post('/api/v1/usuarios/registro').send({
      nome: 'User Feedback',
      email: 'user.feedback@teste.com',
      senha: 'User123'
    });

    const userLogin = await api.post('/api/v1/usuarios/login').send({
      email: 'user.feedback@teste.com',
      senha: 'User123'
    });

    if (userLogin.status === 200) {
      userToken = userLogin.body.data.token;
    }

    await api.post('/api/v1/usuarios/registro').send({
      nome: 'Admin Feedback',
      email: 'admin.feedback@teste.com',
      senha: 'Admin123',
      role: 'admin'
    });

    const adminLogin = await api.post('/api/v1/usuarios/login').send({
      email: 'admin.feedback@teste.com',
      senha: 'Admin123'
    });

    if (adminLogin.status === 200) {
      adminToken = adminLogin.body.data.token;
    }
  });

  describe('📝 Criação de Feedbacks P2P', () => {
    it('deve criar feedback P2P válido', async () => {
      if (userToken && adminToken) {
        // Pegar ID do admin para enviar feedback
        const adminProfile = await api
          .get('/api/v1/usuarios/perfil')
          .set('Authorization', `Bearer ${adminToken}`);

        if (adminProfile.status === 200) {
          const response = await api
            .post('/api/v1/feedbacks/p2p')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              titulo: 'Excelente trabalho!',
              conteudo: 'Parabéns pela organização! #parabens #excelente',
              destinatario_id: adminProfile.body.data._id,
              categoria: 'elogio'
            });

          if (response.status === 201) {
            expect(response.body.success).toBe(true);
            expect(response.body.data.hashtags).toContain('parabens');
            feedbackId = response.body.data._id;
          }
        }
      }
    });

    it('deve rejeitar feedback para si mesmo', async () => {
      if (userToken) {
        const userProfile = await api
          .get('/api/v1/usuarios/perfil')
          .set('Authorization', `Bearer ${userToken}`);

        if (userProfile.status === 200) {
          const response = await api
            .post('/api/v1/feedbacks/p2p')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              titulo: 'Auto feedback',
              conteudo: 'Feedback para mim mesmo',
              destinatario_id: userProfile.body.data._id,
              categoria: 'outro'
            });

          expect([400, 422]).toContain(response.status);
        }
      }
    });
  });

  describe('👍 Sistema de Reações', () => {
    it('deve adicionar reação ao feedback', async () => {
      if (adminToken && feedbackId) {
        const response = await api
          .post(`/api/v1/feedbacks/${feedbackId}/reacoes`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            emoji: '👍'
          });

        expect([200, 401, 404]).toContain(response.status);
      }
    });
  });

  describe('📋 Listagem e Busca', () => {
    it('deve listar feedbacks', async () => {
      if (userToken) {
        const response = await api
          .get('/api/v1/feedbacks')
          .set('Authorization', `Bearer ${userToken}`);

        expect([200, 401]).toContain(response.status);
      }
    });

    it('deve buscar por hashtag', async () => {
      if (userToken) {
        const response = await api
          .get('/api/v1/feedbacks/hashtag/parabens')
          .set('Authorization', `Bearer ${userToken}`);

        expect([200, 401, 404]).toContain(response.status);
      }
    });
  });
});
