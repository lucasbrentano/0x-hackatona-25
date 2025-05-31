// src/controllers/forumController.ts
import { Request, Response } from 'express';
import { ForumService } from '../services/forumService';
import { CreateForumDTO, UpdateForumDTO, AddMembroDTO, AlterarStatusDTO } from '../types/forum.types';

const forumService = new ForumService();

export const criarForum = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        // Verificar se o usuário tem permissão para criar fóruns (admin)
        if (!req.user.isAdmin()) {
            res.status(403).json({
                success: false,
                message: 'Apenas administradores podem criar fóruns'
            });
            return;
        }

        const dadosForum: CreateForumDTO = req.body;
        const forum = await forumService.criarForum(dadosForum, req.user._id.toString());

        res.status(201).json({
            success: true,
            data: forum,
            message: 'Fórum criado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao criar fórum'
        });
    }
};

export const obterForum = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const forum = await forumService.buscarPorId(id);

        if (!forum) {
            res.status(404).json({
                success: false,
                message: 'Fórum não encontrado'
            });
            return;
        }

        // Verificar permissões de visualização
        if (req.user) {
            const permissoes = forumService.verificarPermissoes(forum, req.user);
            if (!permissoes.canView) {
                res.status(403).json({
                    success: false,
                    message: 'Você não tem permissão para visualizar este fórum'
                });
                return;
            }
        } else if (forum.configuracoes.apenas_membros) {
            res.status(401).json({
                success: false,
                message: 'Autenticação necessária para visualizar este fórum'
            });
            return;
        }

        res.json({
            success: true,
            data: forum
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

export const listarForuns = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const filtros = {
            status: req.query.status as string,
            criador: req.query.criador as string,
            projeto: req.query.projeto as string
        };

        const resultado = await forumService.listarForuns(page, limit, filtros);

        res.json({
            success: true,
            data: resultado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao listar fóruns'
        });
    }
};

export const atualizarForum = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const { id } = req.params;
        const dadosAtualizacao: UpdateForumDTO = req.body;

        const forum = await forumService.buscarPorId(id);
        if (!forum) {
            res.status(404).json({
                success: false,
                message: 'Fórum não encontrado'
            });
            return;
        }

        // Verificar permissões
        const permissoes = forumService.verificarPermissoes(forum, req.user);
        if (!permissoes.canEdit) {
            res.status(403).json({
                success: false,
                message: 'Você não tem permissão para editar este fórum'
            });
            return;
        }

        const forumAtualizado = await forumService.atualizarForum(id, dadosAtualizacao);

        res.json({
            success: true,
            data: forumAtualizado,
            message: 'Fórum atualizado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao atualizar fórum'
        });
    }
};

export const deletarForum = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const { id } = req.params;

        const forum = await forumService.buscarPorId(id);
        if (!forum) {
            res.status(404).json({
                success: false,
                message: 'Fórum não encontrado'
            });
            return;
        }

        // Verificar permissões
        const permissoes = forumService.verificarPermissoes(forum, req.user);
        if (!permissoes.canDelete) {
            res.status(403).json({
                success: false,
                message: 'Você não tem permissão para deletar este fórum'
            });
            return;
        }

        await forumService.deletarForum(id);

        res.json({
            success: true,
            message: 'Fórum deletado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar fórum'
        });
    }
};

export const adicionarMembro = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const { id } = req.params;
        const { usuarioId }: AddMembroDTO = req.body;

        const forum = await forumService.buscarPorId(id);
        if (!forum) {
            res.status(404).json({
                success: false,
                message: 'Fórum não encontrado'
            });
            return;
        }

        // Verificar permissões
        const permissoes = forumService.verificarPermissoes(forum, req.user);
        if (!permissoes.canAddMembers) {
            res.status(403).json({
                success: false,
                message: 'Você não tem permissão para adicionar membros'
            });
            return;
        }

        const forumAtualizado = await forumService.adicionarMembro(id, usuarioId);

        res.json({
            success: true,
            data: forumAtualizado,
            message: 'Membro adicionado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao adicionar membro'
        });
    }
};

export const removerMembro = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const { id, usuarioId } = req.params;

        const forum = await forumService.buscarPorId(id);
        if (!forum) {
            res.status(404).json({
                success: false,
                message: 'Fórum não encontrado'
            });
            return;
        }

        // Verificar permissões
        const permissoes = forumService.verificarPermissoes(forum, req.user);
        if (!permissoes.canRemoveMembers) {
            res.status(403).json({
                success: false,
                message: 'Você não tem permissão para remover membros'
            });
            return;
        }

        const forumAtualizado = await forumService.removerMembro(id, usuarioId);

        res.json({
            success: true,
            data: forumAtualizado,
            message: 'Membro removido com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao remover membro'
        });
    }
};

export const alterarStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const { id } = req.params;
        const { status }: AlterarStatusDTO = req.body;

        const forum = await forumService.buscarPorId(id);
        if (!forum) {
            res.status(404).json({
                success: false,
                message: 'Fórum não encontrado'
            });
            return;
        }

        // Verificar permissões
        const permissoes = forumService.verificarPermissoes(forum, req.user);
        if (!permissoes.canEdit) {
            res.status(403).json({
                success: false,
                message: 'Você não tem permissão para alterar o status'
            });
            return;
        }

        const forumAtualizado = await forumService.alterarStatus(id, status);

        res.json({
            success: true,
            data: forumAtualizado,
            message: 'Status alterado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao alterar status'
        });
    }
};

export const obterForunsDoUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const foruns = await forumService.buscarForunsPorUsuario(req.user._id.toString());

        res.json({
            success: true,
            data: foruns
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar fóruns do usuário'
        });
    }
};