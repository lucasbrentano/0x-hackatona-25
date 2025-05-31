// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares básicos
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Logging apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Importar suas rotas reais
try {
  // Tentar importar as rotas - ajustar conforme sua estrutura
  const usuarioRoutes = require('./routes/usuarioRoutes');
  const forumRoutes = require('./routes/forumRoutes');
  const feedbackRoutes = require('./routes/feedbackRoutes');
  const hashtagRoutes = require('./routes/hashtagRoutes');

  // Usar as rotas (ajustar se usam export default)
  app.use('/api/v1/usuarios', usuarioRoutes.default || usuarioRoutes);
  app.use('/api/v1/foruns', forumRoutes.default || forumRoutes);
  app.use('/api/v1/feedbacks', feedbackRoutes.default || feedbackRoutes);
  app.use('/api/v1/hashtags', hashtagRoutes.default || hashtagRoutes);

  console.log('✅ Rotas carregadas com sucesso');
} catch (error) {
  console.log('⚠️ Erro ao carregar rotas:', error.message);
}

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Documentação da API
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'API de Usuários, Fóruns, Feedbacks e Hashtags - Hackathon 2025',
    version: '1.0.0',
    endpoints: {
      usuarios: {
        'POST /usuarios/registro': 'Criar novo usuário',
        'POST /usuarios/login': 'Fazer login',
        'GET /usuarios/perfil': 'Obter perfil do usuário logado',
        'GET /usuarios': 'Listar usuários (admin)',
        'PATCH /usuarios/:id/xp': 'Atualizar XP (admin)'
      },
      foruns: {
        'GET /foruns': 'Listar fóruns',
        'POST /foruns': 'Criar fórum (admin)',
        'GET /foruns/:id': 'Obter fórum por ID',
        'POST /foruns/:id/membros': 'Adicionar membro',
        'GET /foruns/usuario/meus-foruns': 'Meus fóruns'
      },
      feedbacks: {
        'GET /feedbacks': 'Listar feedbacks',
        'POST /feedbacks/forum': 'Criar feedback de fórum',
        'POST /feedbacks/p2p': 'Criar feedback P2P',
        'POST /feedbacks/:id/reacoes': 'Adicionar reação',
        'GET /feedbacks/hashtag/:hashtag': 'Buscar por hashtag'
      },
      hashtags: {
        'GET /hashtags/populares': 'Hashtags populares',
        'GET /hashtags/trending': 'Hashtags trending',
        'GET /hashtags/admin/estatisticas': 'Estatísticas (admin)'
      },
      system: {
        'GET /health': 'Status da API',
        'GET /': 'Informações da API'
      }
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.originalUrl} não encontrada`,
    availableRoutes: {
      base: '/api/v1',
      usuarios: '/api/v1/usuarios',
      foruns: '/api/v1/foruns',
      feedbacks: '/api/v1/feedbacks',
      hashtags: '/api/v1/hashtags',
      health: '/api/v1/health'
    }
  });
});

// Middleware de tratamento de erros
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

export default app;
