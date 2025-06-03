// src/routes/hashtagRoutes.ts
import { Router } from 'express';
import {
    obterHashtagsPopulares,
    obterHashtagsTrending,
    buscarHashtags,
    obterDetalheHashtag,
    obterEstatisticasGerais,
    obterSugestoes,
    obterAnalisePorPeriodo,
    resetarContadoresSemana,
    desativarHashtagsInativas
} from '../controllers/hashtagController';
import {
    authenticate,
    requireAdmin
} from '../middleware/auth';
import { validarHashtag } from '../middleware/feedbackValidation';

const router = Router();

// ========== ROTAS PÚBLICAS ==========
// Obter hashtags populares
router.get('/populares', obterHashtagsPopulares);

// Obter hashtags trending
router.get('/trending', obterHashtagsTrending);

// Buscar hashtags por texto
router.get('/buscar', buscarHashtags);

// Obter detalhes de uma hashtag específica
router.get('/:tag', validarHashtag, obterDetalheHashtag);

// Obter estatísticas gerais
router.get('/admin/estatisticas', obterEstatisticasGerais);

// Obter sugestões de hashtags
router.get('/util/sugestoes', obterSugestoes);

// Obter análise por período
router.get('/admin/analise', obterAnalisePorPeriodo);

// ========== ROTAS ADMINISTRATIVAS ==========
// Aplicar autenticação de admin
router.use('/admin', authenticate, requireAdmin);

// Resetar contadores da semana
router.post('/admin/resetar-semana', resetarContadoresSemana);

// Desativar hashtags inativas
router.post('/admin/desativar-inativas', desativarHashtagsInativas);

export default router;