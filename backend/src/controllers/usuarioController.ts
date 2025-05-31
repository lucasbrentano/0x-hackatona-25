// src/controllers/usuarioController.ts
import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';
import { CreateUsuarioDTO, UpdateUsuarioDTO, LoginDTO } from '../types/usuario.types';

const usuarioService = new UsuarioService();

export const criarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const dadosUsuario: CreateUsuarioDTO = req.body;
        const usuario = await usuarioService.criarUsuario(dadosUsuario);

        // Remover senha da resposta
        const { senha, ...usuarioResponse } = usuario.toObject();

        res.status(201).json({
            success: true,
            data: usuarioResponse,
            message: 'Usuário criado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao criar usuário'
        });
    }
};

export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const loginData: LoginDTO = req.body;
        const { token, user } = await usuarioService.autenticarUsuario(loginData);

        // Remover senha da resposta
        const { senha, ...userResponse } = user.toObject();

        res.json({
            success: true,
            data: {
                token,
                user: userResponse
            },
            message: 'Login realizado com sucesso'
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro na autenticação'
        });
    }
};

export const obterUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.buscarPorId(id);

        if (!usuario) {
            res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
            return;
        }

        // Remover senha da resposta
        const { senha, ...usuarioResponse } = usuario.toObject();

        res.json({
            success: true,
            data: usuarioResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

export const obterPerfilUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.user é definido pelo middleware de autenticação
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const { senha, ...usuarioResponse } = req.user.toObject();

        res.json({
            success: true,
            data: usuarioResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

export const listarUsuarios = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const resultado = await usuarioService.listarUsuarios(page, limit);

        // Remover senhas da resposta
        const usuariosSemSenha = resultado.usuarios.map(usuario => {
            const { senha, ...usuarioResponse } = usuario.toObject();
            return usuarioResponse;
        });

        res.json({
            success: true,
            data: {
                ...resultado,
                usuarios: usuariosSemSenha
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao listar usuários'
        });
    }
};

export const atualizarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const dadosAtualizacao: UpdateUsuarioDTO = req.body;

        // Usuários podem atualizar apenas seus próprios dados, exceto admins
        if (req.user && !req.user.isAdmin() && req.user._id.toString() !== id) {
            res.status(403).json({
                success: false,
                message: 'Você pode atualizar apenas seus próprios dados'
            });
            return;
        }

        const usuario = await usuarioService.atualizarUsuario(id, dadosAtualizacao);

        if (!usuario) {
            res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
            return;
        }

        // Remover senha da resposta
        const { senha, ...usuarioResponse } = usuario.toObject();

        res.json({
            success: true,
            data: usuarioResponse,
            message: 'Usuário atualizado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao atualizar usuário'
        });
    }
};

export const deletarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Verificar se o usuário não está tentando deletar a si mesmo
        if (req.user && req.user._id.toString() === id) {
            res.status(400).json({
                success: false,
                message: 'Você não pode deletar sua própria conta'
            });
            return;
        }

        const usuario = await usuarioService.deletarUsuario(id);

        if (!usuario) {
            res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Usuário deletado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar usuário'
        });
    }
};

export const atualizarXP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { xp } = req.body;

        if (typeof xp !== 'number' || xp < 0) {
            res.status(400).json({
                success: false,
                message: 'XP deve ser um número positivo'
            });
            return;
        }

        const usuario = await usuarioService.atualizarXP(id, xp);

        if (!usuario) {
            res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
            return;
        }

        res.json({
            success: true,
            data: { xp: usuario.xp },
            message: 'XP atualizado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar XP'
        });
    }
};