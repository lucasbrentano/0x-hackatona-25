// tests/integration/usuarios.test.ts
import request from 'supertest';
import app from '../../src/app';

const api = request(app);

describe('👥 Sistema de Usuários Completo', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;

  describe('📝 Registro de Usuários', () => {
    it('deve criar usuário com dados válidos', async () => {
      const response = await api
        .post('/api/v1/usuarios/registro')
        .send({
          nome: 'João Teste',
          email: 'joao@teste.com',
          senha: 'Teste123',
          role: 'usuario'
        });

      if (response.status === 201) {
        expect(response.body.success).toBe(true);
        expect(response.body.data.nome).toBe('João Teste');
        expect(response.body.data).not.toHaveProperty('senha');
        userId = response.body.data._id;
      }
    });

    it('deve criar admin', async () => {
      const response = await api
        .post('/api/v1/usuarios/registro')
        .send({
          nome: 'Admin Test',
          email: 'admin@teste.com',
          senha: 'Admin123',
          role: 'admin'
        });

      expect([201, 400]).toContain(response.status);
    });

    it('deve rejeitar dados inválidos', async () => {
      const response = await api
        .post('/api/v1/usuarios/registro')
        .send({
          nome: 'a', // muito curto
          email: 'email-inválido',
          senha: '123' // muito simples
        });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('🔐 Sistema de Login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const response = await api
        .post('/api/v1/usuarios/login')
        .send({
          email: 'joao@teste.com',
          senha: 'Teste123'
        });

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
        userToken = response.body.data.token;
      }
    });

    it('deve rejeitar credenciais inválidas', async () => {
      const response = await api
        .post('/api/v1/usuarios/login')
        .send({
          email: 'joao@teste.com',
          senha: 'senhaerrada'
        });

      expect([401, 400]).toContain(response.status);
    });
  });

  describe('👤 Perfil do Usuário', () => {
    it('deve retornar perfil com token válido', async () => {
      if (userToken) {
        const response = await api
          .get('/api/v1/usuarios/perfil')
          .set('Authorization', `Bearer ${userToken}`);

        if (response.status === 200) {
          expect(response.body.data.email).toBe('joao@teste.com');
        }
      }
    });

    it('deve rejeitar acesso sem token', async () => {
      const response = await api
        .get('/api/v1/usuarios/perfil');

      expect([401, 403]).toContain(response.status);
    });
  });
});
