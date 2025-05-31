// src/controllers/feedbackController.ts
import { Request, Response } from 'express';
import { FeedbackService } from '../services/feedbackService';
import { CreateFeedbackForumDTO, CreateFeedbackP2PDTO, UpdateFeedbackDTO, ReacaoDTO, AlterarStatusFeedbackDTO } from '../types/feedback.types';

const feedbackService = new FeedbackService();

export const criarFeedbackForum = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const dadosFeedback: CreateFeedbackForumDTO = req.body;
        const feedback = await feedbackService.criarFeedbackForum(dadosFeedback, req.user._id.toString());

        res.status(201).json({
            success: true,
            data: feedback,
            message: 'Feedback criado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao criar feedback'
        });
    }
};

export const criarFeedbackP2P = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const dadosFeedback: CreateFeedbackP2PDTO = req.body;
        const feedback = await feedbackService.criarFeedbackP2P(dadosFeedback, req.user._id.toString());

        res.status(201).json({
            success: true,
            data: feedback,
            message: 'Feedback P2P criado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao criar feedback P2P'
        });
    }
};

export const obterFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const feedback = await feedbackService.buscarPorId(id);

        if (!feedback) {
            res.status(404).json({
                success: false,
                message: 'Feedback não encontrado'
            });
            return;
        }

        // Verificar permissões de visualização
        if (req.user) {
            const isAutor = feedback.usuario_id.toString() === req.user._id.toString();
            const isDestinatario = feedback.destinatario_id?.toString() === req.user._id.toString();
            const isAdmin = req.user.isAdmin();
            const isPrivado = feedback.isPrivado;

            if (isPrivado && !isAutor && !isDestinatario && !isAdmin) {
                res.status(403).json({
                    success: false,
                    message: 'Você não tem permissão para visualizar este feedback'
                });
                return;
            }
        }

        res.json({
            success: true,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

export const listarFeedbacks = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const filtros = {
            tipo: req.query.tipo as 'forum' | 'p2p',
            categoria: req.query.categoria as string,
            status: req.query.status as string,
            prioridade: req.query.prioridade as string,
            usuario_id: req.query.usuario_id as string,
            forum_id: req.query.forum_id as string,
            destinatario_id: req.query.destinatario_id as string,
            isAnonimo: req.query.isAnonimo ? req.query.isAnonimo === 'true' : undefined,
            isPrivado: req.query.isPrivado ? req.query.isPrivado === 'true' : undefined
        };

        const resultado = await feedbackService.listarFeedbacks(page, limit, filtros);

        res.json({
            success: true,
            data: resultado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao listar feedbacks'
        });
    }
};

export const atualizarFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const { id } = req.params;
        const dadosAtualizacao: UpdateFeedbackDTO = req.body;

        const feedback = await feedbackService.atualizarFeedback(id, dadosAtualizacao, req.user._id.toString());

        if (!feedback) {
            res.status(404).json({
                success: false,
                message: 'Feedback não encontrado'
            });
            return;
        }

        res.json({
            success: true,
            data: feedback,
            message: 'Feedback atualizado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao atualizar feedback'
        });
    }
};

export const deletarFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const { id } = req.params;

        const feedback = await feedbackService.deletarFeedback(id, req.user._id.toString());

        if (!feedback) {
            res.status(404).json({
                success: false,
                message: 'Feedback não encontrado'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Feedback deletado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao deletar feedback'
        });
    }
};

export const adicionarReacao = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { emoji }: ReacaoDTO = req.body;

        const feedback = await feedbackService.adicionarReacao(id, emoji);

        if (!feedback) {
            res.status(404).json({
                success: false,
                message: 'Feedback não encontrado'
            });
            return;
        }

        res.json({
            success: true,
            data: feedback,
            message: 'Reação adicionada com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao adicionar reação'
        });
    }
};

export const removerReacao = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { emoji }: ReacaoDTO = req.body;

        const feedback = await feedbackService.removerReacao(id, emoji);

        if (!feedback) {
            res.status(404).json({
                success: false,
                message: 'Feedback não encontrado'
            });
            return;
        }

        res.json({
            success: true,
            data: feedback,
            message: 'Reação removida com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao remover reação'
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
        const { status }: AlterarStatusFeedbackDTO = req.body;

        const feedback = await feedbackService.alterarStatus(id, status, req.user._id.toString());

        if (!feedback) {
            res.status(404).json({
                success: false,
                message: 'Feedback não encontrado'
            });
            return;
        }

        res.json({
            success: true,
            data: feedback,
            message: 'Status alterado com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao alterar status'
        });
    }
};

export const obterFeedbacksDoUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
            return;
        }

        const feedbacks = await feedbackService.obterFeedbacksDoUsuario(req.user._id.toString());

        res.json({
            success: true,
            data: feedbacks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar feedbacks do usuário'
        });
    }
};

export const buscarPorHashtag = async (req: Request, res: Response): Promise<void> => {
    try {
        const { hashtag } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const resultado = await feedbackService.buscarPorHashtag(hashtag, page, limit);

        res.json({
            success: true,
            data: resultado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar feedbacks por hashtag'
        });
    }
};

export const obterEstatisticasHashtags = async (req: Request, res: Response): Promise<void> => {
    try {
        const estatisticas = await feedbackService.obterEstatisticasHashtags();

        res.json({
            success: true,
            data: estatisticas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter estatísticas de hashtags'
        });
    }
};