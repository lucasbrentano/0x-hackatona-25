// src/middleware/feedbackValidation.ts
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

// Validação para criação de feedback de fórum
export const validarCriacaoFeedbackForum = [
    body('forum_id')
        .isMongoId()
        .withMessage('ID do fórum inválido'),

    body('conteudo')
        .isLength({ min: 15, max: 500 })
        .withMessage('Conteúdo deve ter entre 15 e 500 caracteres')
        .trim()
        .escape(),

    body('categoria')
        .isIn(['bug', 'melhoria', 'elogio', 'critica', 'sugestao', 'outro'])
        .withMessage('Categoria deve ser: bug, melhoria, elogio, critica, sugestao ou outro'),

    body('prioridade')
        .isIn(['baixa', 'media', 'alta', 'urgente'])
        .withMessage('Prioridade deve ser: baixa, media, alta ou urgente'),

    body('isAnonimo')
        .optional()
        .isBoolean()
        .withMessage('isAnonimo deve ser um boolean'),

    body('isPrivado')
        .optional()
        .isBoolean()
        .withMessage('isPrivado deve ser um boolean'),

    body('hashtags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Máximo 10 hashtags permitidas'),

    body('hashtags.*')
        .optional()
        .isString()
        .isLength({ min: 2, max: 30 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Hashtags devem conter apenas letras, números e underscore'),

    checkValidationResult
];

// Validação para criação de feedback P2P
export const validarCriacaoFeedbackP2P = [
    body('destinatario_id')
        .isMongoId()
        .withMessage('ID do destinatário inválido'),

    body('conteudo')
        .isLength({ min: 15, max: 500 })
        .withMessage('Conteúdo deve ter entre 15 e 500 caracteres')
        .trim()
        .escape(),

    body('isAnonimo')
        .optional()
        .isBoolean()
        .withMessage('isAnonimo deve ser um boolean'),

    body('isPrivado')
        .optional()
        .isBoolean()
        .withMessage('isPrivado deve ser um boolean'),

    body('hashtags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Máximo 10 hashtags permitidas'),

    body('hashtags.*')
        .optional()
        .isString()
        .isLength({ min: 2, max: 30 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Hashtags devem conter apenas letras, números e underscore'),

    checkValidationResult
];

// Validação para atualização de feedback
export const validarAtualizacaoFeedback = [
    body('conteudo')
        .optional()
        .isLength({ min: 15, max: 500 })
        .withMessage('Conteúdo deve ter entre 15 e 500 caracteres')
        .trim()
        .escape(),

    body('categoria')
        .optional()
        .isIn(['bug', 'melhoria', 'elogio', 'critica', 'sugestao', 'outro'])
        .withMessage('Categoria deve ser: bug, melhoria, elogio, critica, sugestao ou outro'),

    body('prioridade')
        .optional()
        .isIn(['baixa', 'media', 'alta', 'urgente'])
        .withMessage('Prioridade deve ser: baixa, media, alta ou urgente'),

    body('status')
        .optional()
        .isIn(['pendente', 'em_analise', 'resolvido', 'descartado'])
        .withMessage('Status deve ser: pendente, em_analise, resolvido ou descartado'),

    body('isPrivado')
        .optional()
        .isBoolean()
        .withMessage('isPrivado deve ser um boolean'),

    checkValidationResult
];

// Validação para reações
export const validarReacao = [
    body('emoji')
        .isString()
        .isLength({ min: 1, max: 10 })
        .withMessage('Emoji deve ter entre 1 e 10 caracteres'),

    checkValidationResult
];

// Validação para alterar status
export const validarAlterarStatus = [
    body('status')
        .isIn(['pendente', 'em_analise', 'resolvido', 'descartado'])
        .withMessage('Status deve ser: pendente, em_analise, resolvido ou descartado'),

    checkValidationResult
];

// Validação de ID MongoDB para parâmetros
export const validarIdFeedback = [
    param('id')
        .isMongoId()
        .withMessage('ID do feedback inválido'),

    checkValidationResult
];

// Validação para hashtag nos parâmetros
export const validarHashtag = [
    param('hashtag')
        .isString()
        .isLength({ min: 2, max: 30 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Hashtag deve conter apenas letras, números e underscore'),

    checkValidationResult
];

// Validação para query parameters de listagem
export const validarQueryListagemFeedback = [
    body('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Página deve ser um número inteiro positivo'),

    body('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limite deve ser um número entre 1 e 100'),

    body('tipo')
        .optional()
        .isIn(['forum', 'p2p'])
        .withMessage('Tipo deve ser: forum ou p2p'),

    body('categoria')
        .optional()
        .isIn(['bug', 'melhoria', 'elogio', 'critica', 'sugestao', 'outro'])
        .withMessage('Categoria deve ser: bug, melhoria, elogio, critica, sugestao ou outro'),

    body('status')
        .optional()
        .isIn(['pendente', 'em_analise', 'resolvido', 'descartado'])
        .withMessage('Status deve ser: pendente, em_analise, resolvido ou descartado'),

    body('prioridade')
        .optional()
        .isIn(['baixa', 'media', 'alta', 'urgente'])
        .withMessage('Prioridade deve ser: baixa, media, alta ou urgente'),

    checkValidationResult
];