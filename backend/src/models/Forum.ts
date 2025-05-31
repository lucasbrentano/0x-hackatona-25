// src/models/Forum.ts
import { Schema, model, Document, Types } from 'mongoose';

// Interface para configurações do fórum
export interface IForumConfiguracoes {
    feedback_anonimo: boolean;
    apenas_membros: boolean;
    notificacoes_ativas: boolean;
}

// Interface para o documento do fórum
export interface IForum extends Document {
    nome: string;
    descricao: string;
    projeto: string;
    criador: Types.ObjectId;
    membros: Types.ObjectId[];
    feedbacks: Types.ObjectId[];
    status: 'ativo' | 'pausado' | 'concluido' | 'arquivado';
    configuracoes: IForumConfiguracoes;
    data_criacao: Date;
    data_atualizacao: Date;

    // Métodos de instância
    adicionarMembro(usuarioId: Types.ObjectId): Promise<IForum>;
    removerMembro(usuarioId: Types.ObjectId): Promise<IForum>;
    alterarStatus(novoStatus: 'ativo' | 'pausado' | 'concluido' | 'arquivado'): Promise<IForum>;
    isMembro(usuarioId: Types.ObjectId): boolean;
    isAdmin(usuarioId: Types.ObjectId): boolean;
}

const forumSchema = new Schema<IForum>({
    nome: {
        type: String,
        maxlength: 100,
        minlength: 5,
        required: true,
        trim: true,
        unique: true
    },

    descricao: {
        type: String,
        maxlength: 500,
        trim: true,
        required: true
    },

    projeto: {
        type: String,
        maxlength: 100,
        trim: true,
        required: true
    },

    criador: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    },

    membros: [
        {
            type: Schema.Types.ObjectId,
            ref: 'usuarios'
        }
    ],

    feedbacks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'feedbacks'
        }
    ],

    status: {
        type: String,
        enum: ['ativo', 'pausado', 'concluido', 'arquivado'],
        default: 'ativo'
    },

    configuracoes: {
        feedback_anonimo: {
            type: Boolean,
            default: true
        },
        apenas_membros: {
            type: Boolean,
            default: true
        },
        notificacoes_ativas: {
            type: Boolean,
            default: true
        }
    },

    data_criacao: {
        type: Date,
        default: Date.now
    },

    data_atualizacao: {
        type: Date,
        default: Date.now
    }
});

// Middleware para atualizar data_atualizacao
forumSchema.pre('save', function(next) {
    this.data_atualizacao = new Date();
    next();
});

// Métodos de instância
forumSchema.methods.adicionarMembro = function(this: IForum, usuarioId: Types.ObjectId): Promise<IForum> {
    if (!this.membros.some(membro => membro.equals(usuarioId))) {
        this.membros.push(usuarioId);
    }
    return this.save();
};

forumSchema.methods.removerMembro = function(this: IForum, usuarioId: Types.ObjectId): Promise<IForum> {
    this.membros = this.membros.filter(membro => !membro.equals(usuarioId));
    return this.save();
};

forumSchema.methods.alterarStatus = function(this: IForum, novoStatus: 'ativo' | 'pausado' | 'concluido' | 'arquivado'): Promise<IForum> {
    this.status = novoStatus;
    return this.save();
};

forumSchema.methods.isMembro = function(this: IForum, usuarioId: Types.ObjectId): boolean {
    return this.membros.some(membro => {
        const membroId = typeof membro === 'object' ? membro._id : membro;
        return membroId.toString() === usuarioId.toString();
    });
};

forumSchema.methods.isAdmin = function(this: IForum, usuarioId: Types.ObjectId): boolean {
    const criadorId = typeof this.criador === 'object' ? this.criador._id : this.criador;
    return criadorId.toString() === usuarioId.toString();
};

// Índices para performance
forumSchema.index({ projeto: 1 });
forumSchema.index({ status: 1 });
forumSchema.index({ criador: 1 }); // Corrigido de admin_criador para criador
forumSchema.index({ data_criacao: -1 });
forumSchema.index({ nome: 1 });

// Exportar o modelo
export const Forum = model<IForum>('foruns', forumSchema);
export default Forum;