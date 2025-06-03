// src/routes/feedbackRoutes.ts
import { Router } from 'express';
import {
    criarFeedbackForum,
    criarFeedbackP2P,
    obterFeedback,
    listarFeedbacks,
    atualizarFeedback,
    deletarFeedback,
    adicionarReacao,
    removerReacao,
    alterarStatus,
    obterFeedbacksDoUsuario,
    buscarPorHashtag,
    obterEstatisticasHashtags
} from '../controllers/feedbackController';
import {
    validarCriacaoFeedbackForum,
    validarCriacaoFeedbackP2P,
    validarAtualizacaoFeedback,
    validarReacao,
    validarAlterarStatus,
    validarIdFeedback,
    validarHashtag
} from '../middleware/feedbackValidation';
import {
    authenticate,
    requireAdmin,
    optionalAuth
} from '../middleware/auth';

const router = Router();

// ========== ROTAS PÚBLICAS/SEMI-PÚBLICAS ==========
// Listar feedbacks (público, mas filtros aplicados)
router.get('/', optionalAuth, listarFeedbacks);

// Obter feedback específico (verificação de permissão no controller)
router.get('/:id', validarIdFeedback, optionalAuth, obterFeedback);

// Buscar feedbacks por hashtag
router.get('/hashtag/:hashtag', validarHashtag, buscarPorHashtag);

// Obter estatísticas de hashtags
router.get('/hashtags/estatisticas', obterEstatisticasHashtags);

// ========== ROTAS PROTEGIDAS ==========
// Aplicar autenticação a todas as rotas abaixo
router.use(authenticate);

// Obter feedbacks do usuário logado
router.get('/usuario/meus-feedbacks', obterFeedbacksDoUsuario);

// ========== CRIAR FEEDBACKS ==========
// Criar feedback para fórum
router.post('/forum', validarCriacaoFeedbackForum, criarFeedbackForum);

// Criar feedback P2P
router.post('/p2p', validarCriacaoFeedbackP2P, criarFeedbackP2P);

// ========== GERENCIAR FEEDBACKS ==========
// Atualizar feedback
router.put('/:id', validarIdFeedback, validarAtualizacaoFeedback, atualizarFeedback);

// Deletar feedback
router.delete('/:id', validarIdFeedback, deletarFeedback);

// ========== REAÇÕES ==========
// Adicionar reação
router.post('/:id/reacoes', validarIdFeedback, validarReacao, adicionarReacao);

// Remover reação
router.delete('/:id/reacoes', validarIdFeedback, validarReacao, removerReacao);

// ========== GERENCIAMENTO DE STATUS (APENAS ADMINS) ==========
// Alterar status do feedback
router.patch('/:id/status', validarIdFeedback, validarAlterarStatus, requireAdmin, alterarStatus);

export default router;