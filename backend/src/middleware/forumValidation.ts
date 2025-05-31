// src/middleware/forumValidation.ts
import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

// Middleware para verificar resultado das validações
const checkValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: errors.array()
        });
        return;
    }
    next();
};

// Validação para criação de fórum
export const validarCriacaoForum = [
    body('nome')
        .isLength({ min: 5, max: 100 })
        .withMessage('Nome deve ter entre 5 e 100 caracteres')
        .trim()
        .escape(),

    body('descricao')
        .isLength({ min: 1, max: 500 })
        .withMessage('Descrição deve ter entre 1 e 500 caracteres')
        .trim()
        .escape(),

    body('projeto')
        .isLength({ min: 1, max: 100 })
        .withMessage('Projeto deve ter entre 1 e 100 caracteres')
        .trim()
        .escape(),

    body('configuracoes.feedback_anonimo')
        .optional()
        .isBoolean()
        .withMessage('feedback_anonimo deve ser um boolean'),

    body('configuracoes.apenas_membros')
        .optional()
        .isBoolean()
        .withMessage('apenas_membros deve ser um boolean'),

    body('configuracoes.notificacoes_ativas')
        .optional()
        .isBoolean()
        .withMessage('notificacoes_ativas deve ser um boolean'),

    checkValidationResult
];

// Validação para atualização de fórum
export const validarAtualizacaoForum = [
    body('nome')
        .optional()
        .isLength({ min: 5, max: 100 })
        .withMessage('Nome deve ter entre 5 e 100 caracteres')
        .trim()
        .escape(),

    body('descricao')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Descrição deve ter entre 1 e 500 caracteres')
        .trim()
        .escape(),

    body('projeto')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Projeto deve ter entre 1 e 100 caracteres')
        .trim()
        .escape(),

    body('status')
        .optional()
        .isIn(['ativo', 'pausado', 'concluido', 'arquivado'])
        .withMessage('Status deve ser: ativo, pausado, concluido ou arquivado'),

    body('configuracoes.feedback_anonimo')
        .optional()
        .isBoolean()
        .withMessage('feedback_anonimo deve ser um boolean'),

    body('configuracoes.apenas_membros')
        .optional()
        .isBoolean()
        .withMessage('apenas_membros deve ser um boolean'),

    body('configuracoes.notificacoes_ativas')
        .optional()
        .isBoolean()
        .withMessage('notificacoes_ativas deve ser um boolean'),

    checkValidationResult
];

// Validação para adicionar membro
export const validarAdicionarMembro = [
    body('usuarioId')
        .isMongoId()
        .withMessage('ID do usuário inválido'),

    checkValidationResult
];

// Validação para alterar status
export const validarAlterarStatus = [
    body('status')
        .isIn(['ativo', 'pausado', 'concluido', 'arquivado'])
        .withMessage('Status deve ser: ativo, pausado, concluido ou arquivado'),

    checkValidationResult
];

// Validação de ID MongoDB para parâmetros
export const validarIdForum = [
    param('id')
        .isMongoId()
        .withMessage('ID do fórum inválido'),

    checkValidationResult
];

// Validação para parâmetros de usuário
export const validarIdUsuario = [
    param('usuarioId')
        .isMongoId()
        .withMessage('ID do usuário inválido'),

    checkValidationResult
];

// Validação para query parameters de listagem
export const validarQueryListagem = [
    body('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Página deve ser um número inteiro positivo'),

    body('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limite deve ser um número entre 1 e 100'),

    body('status')
        .optional()
        .isIn(['ativo', 'pausado', 'concluido', 'arquivado'])
        .withMessage('Status deve ser: ativo, pausado, concluido ou arquivado'),

    checkValidationResult
];