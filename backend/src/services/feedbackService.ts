// src/services/feedbackService.ts
import { Types } from 'mongoose';
import { Feedback, IFeedback } from '../models/Feedback';
import { HashtagStats } from '../models/Hashtag';
import { Forum } from '../models/Forum';
import { Usuario } from '../models/Usuario';
import {
    CreateFeedbackForumDTO,
    CreateFeedbackP2PDTO,
    UpdateFeedbackDTO,
    FeedbackFiltros
} from '../types/feedback.types';

export class FeedbackService {

    // Criar feedback para fórum
    async criarFeedbackForum(dadosFeedback: CreateFeedbackForumDTO, usuarioId: string): Promise<IFeedback> {
        // Verificar se o fórum existe
        const forum = await Forum.findById(dadosFeedback.forum_id);
        if (!forum) {
            throw new Error('Fórum não encontrado');
        }

        // Verificar se usuário tem permissão
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        if (forum.configuracoes.apenas_membros) {
            const isMembro = forum.membros.some(membro => {
                const membroId = typeof membro === 'object' ? membro._id : membro;
                return membroId.toString() === usuarioId;
            });
            const isAdmin = usuario.isAdmin();
            const criadorId = typeof forum.criador === 'object' ?
                forum.criador._id : forum.criador;
            const isCriador = criadorId.toString() === usuarioId;

            if (!isMembro && !isAdmin && !isCriador) {
                throw new Error('Você não tem permissão para dar feedback neste fórum');
            }
        }

        const feedback = new Feedback({
            usuario_id: new Types.ObjectId(usuarioId),
            forum_id: new Types.ObjectId(dadosFeedback.forum_id),
            tipo: 'forum',
            conteudo: dadosFeedback.conteudo,
            categoria: dadosFeedback.categoria,
            prioridade: dadosFeedback.prioridade,
            isAnonimo: dadosFeedback.isAnonimo || false,
            isPrivado: dadosFeedback.isPrivado || false,
            hashtags: dadosFeedback.hashtags || []
        });

        const feedbackSalvo = await feedback.save();

        // Processar hashtags para estatísticas
        if (feedbackSalvo.hashtags.length > 0) {
            await (HashtagStats as any).atualizarEstatisticas(feedbackSalvo.hashtags);
        }

        // Adicionar feedback ao fórum
        forum.feedbacks.push(feedbackSalvo._id as Types.ObjectId);
        await forum.save();

        return await this.buscarPorId(feedbackSalvo._id.toString());
    }

    // Criar feedback P2P
    async criarFeedbackP2P(dadosFeedback: CreateFeedbackP2PDTO, usuarioId: string): Promise<IFeedback> {
        // Verificar se o destinatário existe
        const destinatario = await Usuario.findById(dadosFeedback.destinatario_id);
        if (!destinatario) {
            throw new Error('Destinatário não encontrado');
        }

        // Não permitir feedback para si mesmo
        if (dadosFeedback.destinatario_id === usuarioId) {
            throw new Error('Não é possível dar feedback para si mesmo');
        }

        const feedback = new Feedback({
            usuario_id: new Types.ObjectId(usuarioId),
            destinatario_id: new Types.ObjectId(dadosFeedback.destinatario_id),
            tipo: 'p2p',
            conteudo: dadosFeedback.conteudo,
            isAnonimo: dadosFeedback.isAnonimo || false,
            isPrivado: dadosFeedback.isPrivado || false,
            hashtags: dadosFeedback.hashtags || []
        });

        const feedbackSalvo = await feedback.save();

        // Processar hashtags para estatísticas
        if (feedbackSalvo.hashtags.length > 0) {
            await (HashtagStats as any).atualizarEstatisticas(feedbackSalvo.hashtags);
        }

        // Adicionar feedback às listas do destinatário
        destinatario.feedbacksIn.push(feedbackSalvo._id as Types.ObjectId);
        await destinatario.save();

        // Adicionar feedback às listas do remetente
        const remetente = await Usuario.findById(usuarioId);
        if (remetente) {
            remetente.feedbacksOut.push(feedbackSalvo._id as Types.ObjectId);
            await remetente.save();
        }

        return await this.buscarPorId(feedbackSalvo._id.toString());
    }

    // Buscar feedback por ID
    async buscarPorId(id: string): Promise<IFeedback | null> {
        return await Feedback.findById(id)
            .populate('usuario_id', 'nome email role')
            .populate('forum_id', 'nome projeto')
            .populate('destinatario_id', 'nome email')
            .populate('analisado_por', 'nome email')
            .exec();
    }

    // Listar feedbacks com filtros
    async listarFeedbacks(
        page: number = 1,
        limit: number = 10,
        filtros?: FeedbackFiltros
    ): Promise<{
        feedbacks: IFeedback[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const skip = (page - 1) * limit;
        const query: any = {};

        // Aplicar filtros
        if (filtros?.tipo) query.tipo = filtros.tipo;
        if (filtros?.categoria) query.categoria = filtros.categoria;
        if (filtros?.status) query.status = filtros.status;
        if (filtros?.prioridade) query.prioridade = filtros.prioridade;
        if (filtros?.usuario_id) query.usuario_id = filtros.usuario_id;
        if (filtros?.forum_id) query.forum_id = filtros.forum_id;
        if (filtros?.destinatario_id) query.destinatario_id = filtros.destinatario_id;
        if (filtros?.isAnonimo !== undefined) query.isAnonimo = filtros.isAnonimo;
        if (filtros?.isPrivado !== undefined) query.isPrivado = filtros.isPrivado;

        // Filtros de data
        if (filtros?.data_inicio || filtros?.data_fim) {
            query.data_criacao = {};
            if (filtros.data_inicio) query.data_criacao.$gte = filtros.data_inicio;
            if (filtros.data_fim) query.data_criacao.$lte = filtros.data_fim;
        }

        const [feedbacks, total] = await Promise.all([
            Feedback.find(query)
                .populate('usuario_id', 'nome email role')
                .populate('forum_id', 'nome projeto')
                .populate('destinatario_id', 'nome email')
                .populate('analisado_por', 'nome email')
                .skip(skip)
                .limit(limit)
                .sort({ data_criacao: -1 })
                .exec(),
            Feedback.countDocuments(query)
        ]);

        return {
            feedbacks,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    // Atualizar feedback
    async atualizarFeedback(id: string, dados: UpdateFeedbackDTO, usuarioId: string): Promise<IFeedback | null> {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            throw new Error('Feedback não encontrado');
        }

        // Verificar permissões
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const isAutor = feedback.usuario_id.toString() === usuarioId;
        const isAdmin = usuario.isAdmin();

        if (!isAutor && !isAdmin) {
            throw new Error('Você não tem permissão para editar este feedback');
        }

        return await Feedback.findByIdAndUpdate(id, dados, {
            new: true,
            runValidators: true
        })
            .populate('usuario_id', 'nome email role')
            .populate('forum_id', 'nome projeto')
            .populate('destinatario_id', 'nome email')
            .populate('analisado_por', 'nome email')
            .exec();
    }

    // Deletar feedback
    async deletarFeedback(id: string, usuarioId: string): Promise<IFeedback | null> {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            throw new Error('Feedback não encontrado');
        }

        // Verificar permissões
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const isAutor = feedback.usuario_id.toString() === usuarioId;
        const isAdmin = usuario.isAdmin();

        if (!isAutor && !isAdmin) {
            throw new Error('Você não tem permissão para deletar este feedback');
        }

        // Remover referências
        if (feedback.forum_id) {
            await Forum.findByIdAndUpdate(feedback.forum_id, {
                $pull: { feedbacks: feedback._id }
            });
        }

        if (feedback.destinatario_id) {
            await Usuario.findByIdAndUpdate(feedback.destinatario_id, {
                $pull: { feedbacksIn: feedback._id }
            });
            await Usuario.findByIdAndUpdate(feedback.usuario_id, {
                $pull: { feedbacksOut: feedback._id }
            });
        }

        return await Feedback.findByIdAndDelete(id).exec();
    }

    // Adicionar reação
    async adicionarReacao(feedbackId: string, emoji: string): Promise<IFeedback | null> {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            throw new Error('Feedback não encontrado');
        }

        await feedback.adicionarReacao(emoji);
        return await this.buscarPorId(feedbackId);
    }

    // Remover reação
    async removerReacao(feedbackId: string, emoji: string): Promise<IFeedback | null> {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            throw new Error('Feedback não encontrado');
        }

        await feedback.removerReacao(emoji);
        return await this.buscarPorId(feedbackId);
    }

    // Alterar status (apenas admins)
    async alterarStatus(feedbackId: string, status: 'pendente' | 'em_analise' | 'resolvido' | 'descartado', adminId: string): Promise<IFeedback | null> {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            throw new Error('Feedback não encontrado');
        }

        if (feedback.tipo !== 'forum') {
            throw new Error('Apenas feedbacks de fórum podem ter status alterado');
        }

        const admin = await Usuario.findById(adminId);
        if (!admin || !admin.isAdmin()) {
            throw new Error('Apenas administradores podem alterar status');
        }

        await feedback.alterarStatus(status, new Types.ObjectId(adminId));
        return await this.buscarPorId(feedbackId);
    }

    // Obter feedbacks do usuário
    async obterFeedbacksDoUsuario(usuarioId: string): Promise<{
        enviados: IFeedback[];
        recebidos: IFeedback[];
    }> {
        const [enviados, recebidos] = await Promise.all([
            Feedback.find({ usuario_id: usuarioId })
                .populate('forum_id', 'nome projeto')
                .populate('destinatario_id', 'nome email')
                .sort({ data_criacao: -1 })
                .exec(),
            Feedback.find({ destinatario_id: usuarioId })
                .populate('usuario_id', 'nome email role')
                .sort({ data_criacao: -1 })
                .exec()
        ]);

        return { enviados, recebidos };
    }

    // Obter feedbacks por hashtag
    async buscarPorHashtag(hashtag: string, page: number = 1, limit: number = 10): Promise<{
        feedbacks: IFeedback[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const skip = (page - 1) * limit;

        const [feedbacks, total] = await Promise.all([
            Feedback.find({ hashtags: hashtag.toLowerCase() })
                .populate('usuario_id', 'nome email')
                .populate('forum_id', 'nome projeto')
                .populate('destinatario_id', 'nome email')
                .skip(skip)
                .limit(limit)
                .sort({ data_criacao: -1 })
                .exec(),
            Feedback.countDocuments({ hashtags: hashtag.toLowerCase() })
        ]);

        return {
            feedbacks,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    // Obter estatísticas de hashtags
    async obterEstatisticasHashtags(): Promise<{
        populares: any[];
        trending: any[];
        total: number;
    }> {
        const [populares, trending, stats] = await Promise.all([
            (Feedback as any).obterHashtagsPopulares(10),
            (Feedback as any).obterHashtagsTrending(7, 10),
            HashtagStats.find({ ativa: true }).countDocuments()
        ]);

        return {
            populares,
            trending,
            total: stats
        };
    }
}