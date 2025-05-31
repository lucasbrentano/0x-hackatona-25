// src/routes/index.ts
import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes';
import forumRoutes from './forumRoutes';
// import feedbackRoutes from './feedbackRoutes'; // quando criar

const router = Router();

// ========== ROTAS DA API ==========
// Rotas de usuários
router.use('/usuarios', usuarioRoutes);

// Rotas de fóruns
router.use('/foruns', forumRoutes);

// Rotas de feedbacks (quando implementar)
// router.use('/feedbacks', feedbackRoutes);

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
        message: 'API de Usuários, Fóruns e Feedbacks - Hackathon 2025',
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
            system: {
                'GET /health': 'Status da API'
            }
        }
    });
});

export default router;