// src/services/forumService.ts
import { Types } from 'mongoose';
import { Forum, IForum } from '../models/Forum';
import { CreateForumDTO, UpdateForumDTO, ForumPermissions } from '../types/forum.types';
import { IUsuario } from '../models/Usuario';

export class ForumService {

    async criarForum(dadosForum: CreateForumDTO, criadorId: string): Promise<IForum> {
        // Verificar se já existe fórum com esse nome
        const forumExistente = await Forum.findOne({ nome: dadosForum.nome });
        if (forumExistente) {
            throw new Error('Já existe um fórum com esse nome');
        }

        const forum = new Forum({
            ...dadosForum,
            criador: new Types.ObjectId(criadorId),
            membros: [new Types.ObjectId(criadorId)] // Criador é automaticamente membro
        });

        return await forum.save();
    }

    async buscarPorId(id: string): Promise<IForum | null> {
        return await Forum.findById(id)
            .populate('criador', 'nome email role')
            .populate('membros', 'nome email role')
            .exec();
    }

    async listarForuns(page: number = 1, limit: number = 10, filtros?: {
        status?: string;
        criador?: string;
        projeto?: string;
    }): Promise<{
        foruns: IForum[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const skip = (page - 1) * limit;
        const query: any = {};

        // Aplicar filtros
        if (filtros?.status) {
            query.status = filtros.status;
        }
        if (filtros?.criador) {
            query.criador = filtros.criador;
        }
        if (filtros?.projeto) {
            query.projeto = { $regex: filtros.projeto, $options: 'i' };
        }

        const [foruns, total] = await Promise.all([
            Forum.find(query)
                .populate('criador', 'nome email role')
                .populate('membros', 'nome email role')
                .skip(skip)
                .limit(limit)
                .sort({ data_criacao: -1 })
                .exec(),
            Forum.countDocuments(query)
        ]);

        return {
            foruns,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async atualizarForum(id: string, dados: UpdateForumDTO): Promise<IForum | null> {
        // Se estiver atualizando nome, verificar se já existe
        if (dados.nome) {
            const forumExistente = await Forum.findOne({
                nome: dados.nome,
                _id: { $ne: id }
            });
            if (forumExistente) {
                throw new Error('Já existe um fórum com esse nome');
            }
        }

        return await Forum.findByIdAndUpdate(id, dados, {
            new: true,
            runValidators: true
        })
            .populate('criador', 'nome email role')
            .populate('membros', 'nome email role')
            .exec();
    }

    async deletarForum(id: string): Promise<IForum | null> {
        return await Forum.findByIdAndDelete(id).exec();
    }

    async adicionarMembro(forumId: string, usuarioId: string): Promise<IForum | null> {
        const forum = await Forum.findById(forumId);
        if (!forum) {
            throw new Error('Fórum não encontrado');
        }

        await forum.adicionarMembro(new Types.ObjectId(usuarioId));

        return await Forum.findById(forumId)
            .populate('criador', 'nome email role')
            .populate('membros', 'nome email role')
            .exec();
    }

    async removerMembro(forumId: string, usuarioId: string): Promise<IForum | null> {
        const forum = await Forum.findById(forumId);
        if (!forum) {
            throw new Error('Fórum não encontrado');
        }

        // Não permitir remover o criador (verificação mais robusta)
        const criadorId = typeof forum.criador === 'object' ?
            forum.criador._id : forum.criador;

        if (criadorId.toString() === usuarioId) {
            throw new Error('Não é possível remover o criador do fórum');
        }

        await forum.removerMembro(new Types.ObjectId(usuarioId));

        return await Forum.findById(forumId)
            .populate('criador', 'nome email role')
            .populate('membros', 'nome email role')
            .exec();
    }

    async alterarStatus(forumId: string, novoStatus: 'ativo' | 'pausado' | 'concluido' | 'arquivado'): Promise<IForum | null> {
        const forum = await Forum.findById(forumId);
        if (!forum) {
            throw new Error('Fórum não encontrado');
        }

        await forum.alterarStatus(novoStatus);

        return await Forum.findById(forumId)
            .populate('criador', 'nome email role')
            .populate('membros', 'nome email role')
            .exec();
    }

    async buscarForunsPorUsuario(usuarioId: string): Promise<IForum[]> {
        return await Forum.find({
            $or: [
                { criador: usuarioId },
                { membros: usuarioId }
            ]
        })
            .populate('criador', 'nome email role')
            .populate('membros', 'nome email role')
            .sort({ data_atualizacao: -1 })
            .exec();
    }

    async buscarForunsPorProjeto(projeto: string): Promise<IForum[]> {
        return await Forum.find({
            projeto: { $regex: projeto, $options: 'i' }
        })
            .populate('criador', 'nome email role')
            .populate('membros', 'nome email role')
            .sort({ data_criacao: -1 })
            .exec();
    }

    // Verificar permissões de usuário no fórum
    verificarPermissoes(forum: IForum, usuario: IUsuario): ForumPermissions {
        const isAdmin = usuario.isAdmin();

        // Verificar se é criador (tratando caso populado ou não)
        const criadorId = typeof forum.criador === 'object' ?
            forum.criador._id : forum.criador;
        const isCriador = criadorId.toString() === usuario._id.toString();

        // Verificar se é membro
        const isMembro = forum.membros.some(membro => {
            const membroId = typeof membro === 'object' ? membro._id : membro;
            return membroId.toString() === usuario._id.toString();
        });

        return {
            canView: isAdmin || isCriador || isMembro || !forum.configuracoes.apenas_membros,
            canEdit: isAdmin || isCriador,
            canDelete: isAdmin || isCriador,
            canAddMembers: isAdmin || isCriador,
            canRemoveMembers: isAdmin || isCriador,
            canGiveFeedback: isAdmin || isCriador || isMembro || !forum.configuracoes.apenas_membros
        };
    }
}