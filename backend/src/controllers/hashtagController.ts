// src/controllers/hashtagController.ts
import { Request, Response } from 'express';
import { HashtagService } from '../services/hashtagService';

const hashtagService = new HashtagService();

export const obterHashtagsPopulares = async (req: Request, res: Response): Promise<void> => {
    try {
        const limite = parseInt(req.query.limite as string) || 20;
        const hashtags = await hashtagService.obterHashtagsPopulares(limite);

        res.json({
            success: true,
            data: hashtags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter hashtags populares'
        });
    }
};

export const obterHashtagsTrending = async (req: Request, res: Response): Promise<void> => {
    try {
        const limite = parseInt(req.query.limite as string) || 10;
        const hashtags = await hashtagService.obterHashtagsTrending(limite);

        res.json({
            success: true,
            data: hashtags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter hashtags trending'
        });
    }
};

export const buscarHashtags = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;
        const limite = parseInt(req.query.limite as string) || 10;

        if (!q || typeof q !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Parâmetro de busca "q" é obrigatório'
            });
            return;
        }

        const hashtags = await hashtagService.buscarHashtags(q, limite);

        res.json({
            success: true,
            data: hashtags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar hashtags'
        });
    }
};

export const obterDetalheHashtag = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tag } = req.params;
        const detalhes = await hashtagService.obterDetalheHashtag(tag);

        if (!detalhes.hashtag) {
            res.status(404).json({
                success: false,
                message: 'Hashtag não encontrada'
            });
            return;
        }

        res.json({
            success: true,
            data: detalhes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter detalhes da hashtag'
        });
    }
};

export const obterEstatisticasGerais = async (req: Request, res: Response): Promise<void> => {
    try {
        const estatisticas = await hashtagService.obterEstatisticasGerais();

        res.json({
            success: true,
            data: estatisticas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter estatísticas gerais'
        });
    }
};

export const obterSugestoes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { texto } = req.query;
        const limite = parseInt(req.query.limite as string) || 5;

        if (!texto || typeof texto !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Parâmetro "texto" é obrigatório'
            });
            return;
        }

        const sugestoes = await hashtagService.obterSugestoes(texto, limite);

        res.json({
            success: true,
            data: sugestoes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter sugestões de hashtags'
        });
    }
};

export const obterAnalisePorPeriodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const dias = parseInt(req.query.dias as string) || 30;
        const analise = await hashtagService.obterAnalisePorPeriodo(dias);

        res.json({
            success: true,
            data: analise
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao obter análise por período'
        });
    }
};

// Endpoints administrativos
export const resetarContadoresSemana = async (req: Request, res: Response): Promise<void> => {
    try {
        await hashtagService.resetarContadoresSemana();

        res.json({
            success: true,
            message: 'Contadores da semana resetados com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao resetar contadores da semana'
        });
    }
};

export const desativarHashtagsInativas = async (req: Request, res: Response): Promise<void> => {
    try {
        const dias = parseInt(req.query.dias as string) || 90;
        const quantidadeDesativada = await hashtagService.desativarHashtagsInativas(dias);

        res.json({
            success: true,
            data: {
                hashtags_desativadas: quantidadeDesativada
            },
            message: `${quantidadeDesativada} hashtags inativas foram desativadas`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao desativar hashtags inativas'
        });
    }
};