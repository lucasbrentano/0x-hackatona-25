// src/routes/forumRoutes.ts
import { Router } from 'express';
import {
    criarForum,
    obterForum,
    listarForuns,
    atualizarForum,
    deletarForum,
    adicionarMembro,
    removerMembro,
    alterarStatus,
    obterForunsDoUsuario
} from '../controllers/forumController';
import {
    validarCriacaoForum,
    validarAtualizacaoForum,
    validarAdicionarMembro,
    validarAlterarStatus,
    validarIdForum,
    validarIdUsuario
} from '../middleware/forumValidation';
import {
    authenticate,
    requireAdmin,
    optionalAuth
} from '../middleware/auth';

const router = Router();

// ========== ROTAS PÚBLICAS/SEMI-PÚBLICAS ==========
// Listar fóruns (público, mas com filtros baseados em permissões)
router.get('/', optionalAuth, listarForuns);

// Obter fórum específico (público se configurado, senão requer autenticação)
router.get('/:id', validarIdForum, optionalAuth, obterForum);

// ========== ROTAS PROTEGIDAS ==========
// Aplicar autenticação a todas as rotas abaixo
router.use(authenticate);

// Obter fóruns do usuário logado
router.get('/usuario/meus-foruns', obterForunsDoUsuario);

// Criar fórum (apenas admins)
router.post('/', validarCriacaoForum, requireAdmin, criarForum);

// Atualizar fórum (criador ou admin)
router.put('/:id', validarIdForum, validarAtualizacaoForum, atualizarForum);

// Deletar fórum (criador ou admin)
router.delete('/:id', validarIdForum, deletarForum);

// ========== GERENCIAMENTO DE MEMBROS ==========
// Adicionar membro ao fórum
router.post('/:id/membros', validarIdForum, validarAdicionarMembro, adicionarMembro);

// Remover membro do fórum
router.delete('/:id/membros/:usuarioId', validarIdForum, validarIdUsuario, removerMembro);

// ========== GERENCIAMENTO DE STATUS ==========
// Alterar status do fórum
router.patch('/:id/status', validarIdForum, validarAlterarStatus, alterarStatus);

export default router;