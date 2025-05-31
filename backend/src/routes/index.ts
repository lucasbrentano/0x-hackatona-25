// src/routes/index.ts
import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes';
// import feedbackRoutes from './feedbackRoutes'; // quando criar

const router = Router();

// ========== ROTAS DA API ==========
// Rotas de usuários
router.use('/usuarios', usuarioRoutes);

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
        message: 'API de Usuários e Feedbacks',
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
            system: {
                'GET /health': 'Status da API'
            }
        }
    });
});

export default router;