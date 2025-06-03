// src/routes/usuarioRoutes.ts
import { Router } from 'express';
import {
    criarUsuario,
    loginUsuario,
    obterUsuario,
    obterPerfilUsuario,
    listarUsuarios,
    atualizarUsuario,
    deletarUsuario,
    atualizarXP
} from '../controllers/usuarioController';
import {
    validarCriacaoUsuario,
    validarAtualizacaoUsuario,
    validarLogin,
    validarId,
    validarXP
} from '../middleware/validation';
import {
    authenticate,
    authorize,
    requireAdmin,
    checkResourceOwnership
} from '../middleware/auth';

const router = Router();

// ========== ROTAS PÚBLICAS ==========
// Criação de usuário (registro)
router.post('/registro', validarCriacaoUsuario, criarUsuario);

// Login
router.post('/login', validarLogin, loginUsuario);

// ========== ROTAS PROTEGIDAS ==========
// Aplicar autenticação a todas as rotas abaixo
router.use(authenticate);

// Perfil do usuário logado
router.get('/perfil', obterPerfilUsuario);

// Listar usuários (apenas admins)
router.get('/', requireAdmin, listarUsuarios);

// Obter usuário específico
router.get('/:id', validarId, obterUsuario);

// Atualizar usuário (próprio perfil ou admin)
router.put('/:id', validarId, validarAtualizacaoUsuario, checkResourceOwnership, atualizarUsuario);

// Deletar usuário (apenas admins e não pode deletar a si mesmo)
router.delete('/:id', validarId, requireAdmin, deletarUsuario);

// Atualizar XP (apenas admins)
router.patch('/:id/xp', validarId, validarXP, requireAdmin, atualizarXP);

export default router;