// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario, IUsuario } from '../models/Usuario';

// Estender a interface Request para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: IUsuario;
        }
    }
}

// Middleware de autenticação
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: 'Token de acesso requerido'
            });
            return;
        }

        // Verificar se o header está no formato correto
        if (!authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Formato de token inválido. Use: Bearer <token>'
            });
            return;
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token || token === 'null' || token === 'undefined') {
            res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
            return;
        }

        // Verificar se JWT_SECRET está definido
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET não está definido');
            res.status(500).json({
                success: false,
                message: 'Erro de configuração do servidor'
            });
            return;
        }

        // Verificar e decodificar o token
        const decoded = jwt.verify(token, jwtSecret) as {
            id: string;
            email: string;
            role: string;
            iat: number;
            exp: number;
        };

        // Buscar usuário no banco de dados
        const user = await Usuario.findById(decoded.id);

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não encontrado. Token inválido'
            });
            return;
        }

        // Adicionar usuário ao request
        req.user = user;
        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token expirado. Faça login novamente'
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
            return;
        }

        console.error('Erro na autenticação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Middleware de autorização
export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Permissão insuficiente para acessar este recurso'
            });
            return;
        }

        next();
    };
};

// Middleware para verificar se é admin
export const requireAdmin = authorize(['admin', 'super_admin']);

// Middleware para verificar se é super admin
export const requireSuperAdmin = authorize(['super_admin']);

// Middleware opcional - continua mesmo sem token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Sem token, continua sem usuário
            next();
            return;
        }

        const token = authHeader.replace('Bearer ', '');
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            next();
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as {
            id: string;
            email: string;
            role: string;
        };
        const user = await Usuario.findById(decoded.id);

        if (user) {
            req.user = user;
        }

        next();
    } catch (error) {
        // Em caso de erro, continua sem usuário
        next();
    }
};

// Middleware para verificar propriedade do recurso
export const checkResourceOwnership = (req: Request, res: Response, next: NextFunction): void => {
    const resourceUserId = req.params.id;
    const currentUserId = req.user?._id.toString();

    // Admin pode acessar qualquer recurso
    if (req.user?.isAdmin()) {
        next();
        return;
    }

    // Usuário comum só pode acessar seus próprios recursos
    if (currentUserId !== resourceUserId) {
        res.status(403).json({
            success: false,
            message: 'Você só pode acessar seus próprios recursos'
        });
        return;
    }

    next();
};