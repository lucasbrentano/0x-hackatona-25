// src/models/Feedback.ts
import { Schema, model, Document, Types, Model } from 'mongoose';

// Interface para reações
export interface IReacao {
    emoji: string;
    count: number;
}

// Interface para o documento do feedback
export interface IFeedback extends Document {
    usuario_id: Types.ObjectId;
    forum_id?: Types.ObjectId;
    destinatario_id?: Types.ObjectId;
    tipo: 'forum' | 'p2p';
    conteudo: string;
    hashtags: string[];
    isAnonimo: boolean;
    isPrivado: boolean;
    reacoes: IReacao[];
    categoria?: 'bug' | 'melhoria' | 'elogio' | 'critica' | 'sugestao' | 'outro';
    prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';
    status?: 'pendente' | 'em_analise' | 'resolvido' | 'descartado';
    analisado_por?: Types.ObjectId;
    data_criacao: Date;
    data_atualizacao: Date;

    // Métodos de instância
    adicionarReacao(emoji: string): Promise<IFeedback>;
    removerReacao(emoji: string): Promise<IFeedback>;
    alterarStatus(novoStatus: 'pendente' | 'em_analise' | 'resolvido' | 'descartado', adminId: Types.ObjectId): Promise<IFeedback>;
    adicionarHashtag(hashtag: string): Promise<IFeedback>;
    removerHashtag(hashtag: string): Promise<IFeedback>;
    extrairHashtagsDoTexto(): string[];
    isFeedbackDeForum(): boolean;
    isFeedbackP2P(): boolean;
}

// Interface para métodos estáticos
export interface IFeedbackModel extends Model<IFeedback> {
    obterHashtagsPopulares(limite?: number): Promise<any[]>;
    obterHashtagsTrending(dias?: number, limite?: number): Promise<any[]>;
    buscarPorHashtag(hashtag: string): Promise<IFeedback[]>;
}

const feedbackSchema = new Schema<IFeedback>({
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    },

    forum_id: {
        type: Schema.Types.ObjectId,
        ref: 'foruns'
    },

    destinatario_id: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },

    tipo: {
        type: String,
        enum: ['forum', 'p2p'],
        required: true
    },

    conteudo: {
        type: String,
        maxlength: 500,
        minlength: 15,
        required: true,
        trim: true
    },

    hashtags: [
        {
            type: String,
            trim: true,
            lowercase: true,
            match: /^[a-zA-Z0-9_]+$/
        }
    ],

    isAnonimo: {
        type: Boolean,
        default: false
    },

    isPrivado: {
        type: Boolean,
        default: false
    },

    reacoes: [
        {
            emoji: {
                type: String,
                required: true,
                maxlength: 10
            },
            count: {
                type: Number,
                default: 0,
                min: 0
            }
        }
    ],

    categoria: {
        type: String,
        enum: ['bug', 'melhoria', 'elogio', 'critica', 'sugestao', 'outro'],
        default: 'outro',
        required: function(this: IFeedback) {
            return this.tipo === 'forum';
        }
    },

    prioridade: {
        type: String,
        enum: ['baixa', 'media', 'alta', 'urgente'],
        default: 'media',
        required: function(this: IFeedback) {
            return this.tipo === 'forum';
        }
    },

    status: {
        type: String,
        enum: ['pendente', 'em_analise', 'resolvido', 'descartado'],
        default: 'pendente',
        required: function(this: IFeedback) {
            return this.tipo === 'forum';
        }
    },

    analisado_por: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
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

// Middleware pré-save
feedbackSchema.pre('save', function(next) {
    // Extrair hashtags do texto automaticamente
    const hashtagsTexto = this.extrairHashtagsDoTexto();

    // Mesclar com hashtags já existentes (sem usar Set para compatibilidade)
    const todasHashtags = this.hashtags.concat(hashtagsTexto);
    const hashtagsUnicas: string[] = [];

    // Remover duplicatas manualmente
    todasHashtags.forEach(tag => {
        if (!hashtagsUnicas.includes(tag)) {
            hashtagsUnicas.push(tag);
        }
    });

    this.hashtags = hashtagsUnicas.slice(0, 10); // Máximo 10 hashtags

    // Validação de campos obrigatórios por tipo
    if (this.tipo === 'forum' && !this.forum_id) {
        return next(new Error('Feedback de fórum deve ter forum_id'));
    }
    if (this.tipo === 'p2p' && !this.destinatario_id) {
        return next(new Error('Feedback P2P deve ter destinatario_id'));
    }
    if (this.tipo === 'forum' && this.destinatario_id) {
        return next(new Error('Feedback de fórum não pode ter destinatario_id'));
    }
    if (this.tipo === 'p2p' && this.forum_id) {
        return next(new Error('Feedback P2P não pode ter forum_id'));
    }

    // Limpar campos de gestão para feedback P2P
    if (this.tipo === 'p2p') {
        this.categoria = undefined;
        this.prioridade = undefined;
        this.status = undefined;
        this.analisado_por = undefined;
    }

    // Atualizar data_atualizacao
    if (this.isModified() && !this.isNew) {
        this.data_atualizacao = new Date();
    }

    next();
});

// Métodos de instância
feedbackSchema.methods.adicionarReacao = function(this: IFeedback, emoji: string): Promise<IFeedback> {
    const reacaoExistente = this.reacoes.find(r => r.emoji === emoji);
    if (reacaoExistente) {
        reacaoExistente.count += 1;
    } else {
        this.reacoes.push({ emoji, count: 1 });
    }
    return this.save();
};

feedbackSchema.methods.removerReacao = function(this: IFeedback, emoji: string): Promise<IFeedback> {
    const reacao = this.reacoes.find(r => r.emoji === emoji);
    if (reacao && reacao.count > 0) {
        reacao.count -= 1;
        if (reacao.count === 0) {
            this.reacoes = this.reacoes.filter(r => r.emoji !== emoji);
        }
    }
    return this.save();
};

feedbackSchema.methods.alterarStatus = function(this: IFeedback, novoStatus: 'pendente' | 'em_analise' | 'resolvido' | 'descartado', adminId: Types.ObjectId): Promise<IFeedback> {
    this.status = novoStatus;
    this.analisado_por = adminId;
    return this.save();
};

feedbackSchema.methods.adicionarHashtag = function(this: IFeedback, hashtag: string): Promise<IFeedback> {
    const hashtagLimpa = hashtag.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
    if (hashtagLimpa && !this.hashtags.includes(hashtagLimpa)) {
        this.hashtags.push(hashtagLimpa);
    }
    return this.save();
};

feedbackSchema.methods.removerHashtag = function(this: IFeedback, hashtag: string): Promise<IFeedback> {
    this.hashtags = this.hashtags.filter(tag => tag !== hashtag.toLowerCase());
    return this.save();
};

feedbackSchema.methods.extrairHashtagsDoTexto = function(this: IFeedback): string[] {
    const regex = /#([a-zA-Z0-9_]+)/g;
    const matches = this.conteudo.match(regex);
    return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
};

feedbackSchema.methods.isFeedbackDeForum = function(this: IFeedback): boolean {
    return this.tipo === 'forum';
};

feedbackSchema.methods.isFeedbackP2P = function(this: IFeedback): boolean {
    return this.tipo === 'p2p';
};

// Métodos estáticos para análise de hashtags
feedbackSchema.statics.obterHashtagsPopulares = async function(limite: number = 10) {
    return await this.aggregate([
        { $unwind: '$hashtags' },
        { $group: { _id: '$hashtags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limite },
        { $project: { tag: '$_id', popularidade: '$count', _id: 0 } }
    ]);
};

feedbackSchema.statics.obterHashtagsTrending = async function(dias: number = 7, limite: number = 10) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    return await this.aggregate([
        { $match: { data_criacao: { $gte: dataLimite } } },
        { $unwind: '$hashtags' },
        { $group: { _id: '$hashtags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limite },
        { $project: { tag: '$_id', popularidade: '$count', _id: 0 } }
    ]);
};

feedbackSchema.statics.buscarPorHashtag = async function(hashtag: string) {
    return await this.find({ hashtags: hashtag.toLowerCase() })
        .populate('usuario_id', 'nome email')
        .populate('forum_id', 'nome projeto')
        .sort({ data_criacao: -1 });
};

// Índices para performance
feedbackSchema.index({ forum_id: 1 });
feedbackSchema.index({ destinatario_id: 1 });
feedbackSchema.index({ usuario_id: 1 });
feedbackSchema.index({ tipo: 1 });
feedbackSchema.index({ categoria: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ hashtags: 1 });
feedbackSchema.index({ data_criacao: -1 });

// Exportar o modelo
export const Feedback = model<IFeedback, IFeedbackModel>('feedbacks', feedbackSchema);
export default Feedback;