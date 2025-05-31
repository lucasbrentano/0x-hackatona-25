// src/routes/index.ts
import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes';
import forumRoutes from './forumRoutes';
import feedbackRoutes from './feedbackRoutes';
import hashtagRoutes from './hashtagRoutes';

const router = Router();

// ========== ROTAS DA API ==========
// Rotas de usuários
router.use('/usuarios', usuarioRoutes);

// Rotas de fóruns
router.use('/foruns', forumRoutes);

// Rotas de feedbacks
router.use('/feedbacks', feedbackRoutes);

// Rotas de hashtags
router.use('/hashtags', hashtagRoutes);

// ========== ROTA DE HEALTH CHECK ==========
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API funcionando corretamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ========== ROTA DE INFORMAÇÕES DA API ==========
router.get('/', (req, res) => {
    res.json({
        message: 'API de Usuários, Fóruns, Feedbacks e Hashtags - Hackathon 2025',
        version: '1.0.0',
        endpoints: {
            usuarios: {
                'POST /usuarios/registro': 'Criar novo usuário',
                'POST /usuarios/login': 'Fazer login',
                'GET /usuarios/perfil': 'Obter perfil do usuário logado',
                'GET /usuarios': 'Listar usuários (admin)',
                'GET /usuarios/:id': 'Obter usuário por ID',
                'PUT /usuarios/:id': 'Atualizar usuário',
                'DELETE /usuarios/:id': 'Deletar usuário (admin)',
                'PATCH /usuarios/:id/xp': 'Atualizar XP (admin)'
            },
            foruns: {
                'GET /foruns': 'Listar fóruns',
                'GET /foruns/:id': 'Obter fórum por ID',
                'POST /foruns': 'Criar fórum (admin)',
                'PUT /foruns/:id': 'Atualizar fórum (criador/admin)',
                'DELETE /foruns/:id': 'Deletar fórum (criador/admin)',
                'GET /foruns/usuario/meus-foruns': 'Obter fóruns do usuário',
                'POST /foruns/:id/membros': 'Adicionar membro',
                'DELETE /foruns/:id/membros/:usuarioId': 'Remover membro',
                'PATCH /foruns/:id/status': 'Alterar status do fórum'
            },
            feedbacks: {
                'GET /feedbacks': 'Listar feedbacks',
                'GET /feedbacks/:id': 'Obter feedback por ID',
                'POST /feedbacks/forum': 'Criar feedback de fórum',
                'POST /feedbacks/p2p': 'Criar feedback P2P',
                'PUT /feedbacks/:id': 'Atualizar feedback',
                'DELETE /feedbacks/:id': 'Deletar feedback',
                'GET /feedbacks/usuario/meus-feedbacks': 'Obter feedbacks do usuário',
                'POST /feedbacks/:id/reacoes': 'Adicionar reação',
                'DELETE /feedbacks/:id/reacoes': 'Remover reação',
                'PATCH /feedbacks/:id/status': 'Alterar status (admin)',
                'GET /feedbacks/hashtag/:hashtag': 'Buscar por hashtag'
            },
            hashtags: {
                'GET /hashtags/populares': 'Hashtags populares',
                'GET /hashtags/trending': 'Hashtags trending',
                'GET /hashtags/buscar': 'Buscar hashtags',
                'GET /hashtags/:tag': 'Detalhes da hashtag',
                'GET /hashtags/admin/estatisticas': 'Estatísticas gerais',
                'GET /hashtags/util/sugestoes': 'Sugestões de hashtags',
                'GET /hashtags/admin/analise': 'Análise por período'
            },
            system: {
                'GET /health': 'Status da API',
                'GET /': 'Informações da API'
            }
        }
    });
});

export default router;