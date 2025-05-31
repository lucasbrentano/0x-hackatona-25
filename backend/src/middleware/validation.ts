// src/middleware/validation.ts
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

// Validação para criação de usuário
export const validarCriacaoUsuario = [
    body('nome')
        .isLength({ min: 5, max: 25 })
        .withMessage('Nome deve ter entre 5 e 25 caracteres')
        .trim()
        .escape(),

    body('email')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email muito longo'),

    body('senha')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número'),

    body('role')
        .optional()
        .isIn(['usuario', 'admin', 'super_admin'])
        .withMessage('Role deve ser: usuario, admin ou super_admin'),

    checkValidationResult
];

// Validação para atualização de usuário
export const validarAtualizacaoUsuario = [
    body('nome')
        .optional()
        .isLength({ min: 5, max: 25 })
        .withMessage('Nome deve ter entre 5 e 25 caracteres')
        .trim()
        .escape(),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email muito longo'),

    body('role')
        .optional()
        .isIn(['usuario', 'admin', 'super_admin'])
        .withMessage('Role deve ser: usuario, admin ou super_admin'),

    body('xp')
        .optional()
        .isInt({ min: 0 })
        .withMessage('XP deve ser um número inteiro positivo'),

    checkValidationResult
];

// Validação para login
export const validarLogin = [
    body('email')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),

    body('senha')
        .notEmpty()
        .withMessage('Senha é obrigatória'),

    checkValidationResult
];

// Validação para atualização de XP
export const validarXP = [
    body('xp')
        .isInt({ min: 0 })
        .withMessage('XP deve ser um número inteiro positivo'),

    checkValidationResult
];

// Validação de ID MongoDB
export const validarId = [
    param('id')
        .isMongoId()
        .withMessage('ID inválido'),

    checkValidationResult
];

// Validação para query parameters de paginação
export const validarPaginacao = [
    body('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Página deve ser um número inteiro positivo'),

    body('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limite deve ser um número entre 1 e 100'),

    checkValidationResult
];