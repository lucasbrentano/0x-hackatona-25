var feedbacks = new Schema({
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    },

    // ✅ FLEXÍVEL: Pode ser fórum OU usuário destinatário
    forum_id: {
        type: Schema.Types.ObjectId,
        ref: 'foruns'
        // Não required - pode ser null para feedback P2P
    },

    destinatario_id: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
        // Não required - pode ser null para feedback em fórum
    },

    // ✅ Tipo de feedback
    tipo: {
        type: String,
        enum: ['forum', 'p2p'],
        required: true
    },

    // ✅ CORRIGIDO: campo conteudo estava quebrado
    conteudo: {
        type: String,
        maxlength: 500,
        minlength: 15,
        required: true,
        trim: true
    },

    isAnonimo: {
        type: Boolean,
        default: false
    },

    isPrivado: {
        type: Boolean,
        default: false
    },

    // ✅ Schema das reações
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

    // ✅ Campos APENAS para feedback de FÓRUM (gestão de projeto)
    categoria: {
        type: String,
        enum: ['bug', 'melhoria', 'elogio', 'critica', 'sugestao', 'outro'],
        default: 'outro',
        // Só faz sentido para feedback de fórum
        required: function() { return this.tipo === 'forum'; }
    },

    prioridade: {
        type: String,
        enum: ['baixa', 'media', 'alta', 'urgente'],
        default: 'media',
        // Só faz sentido para feedback de fórum
        required: function() { return this.tipo === 'forum'; }
    },

    status: {
        type: String,
        enum: ['pendente', 'em_analise', 'resolvido', 'descartado'],
        default: 'pendente',
        // Só faz sentido para feedback de fórum
        required: function() { return this.tipo === 'forum'; }
    },

    // ✅ Quem está analisando (admin) - APENAS para fórum
    analisado_por: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
        // Só existe para feedback de fórum
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

// ✅ VALIDAÇÃO: Garantir consistência entre tipos
feedbacks.pre('save', function(next) {
    // Validação customizada de campos obrigatórios
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

    // ✅ NOVO: Limpar campos de gestão para feedback P2P
    if (this.tipo === 'p2p') {
        this.categoria = undefined;
        this.prioridade = undefined;
        this.status = undefined;
        this.analisado_por = undefined;
    }

    // Atualizar data_atualizacao
    if (this.isModified() && !this.isNew) {
        this.data_atualizacao = Date.now();
    }
    next();
});

// ✅ ÍNDICES: Para performance
feedbacks.index({ forum_id: 1 });
feedbacks.index({ destinatario_id: 1 });
feedbacks.index({ usuario_id: 1 });
feedbacks.index({ tipo: 1 });
feedbacks.index({ categoria: 1 });
feedbacks.index({ status: 1 });
feedbacks.index({ data_criacao: -1 });

// ✅ MÉTODOS: Gestão de reações
feedbacks.methods.adicionarReacao = function(emoji) {
    const reacaoExistente = this.reacoes.find(r => r.emoji === emoji);
    if (reacaoExistente) {
        reacaoExistente.count += 1;
    } else {
        this.reacoes.push({ emoji, count: 1 });
    }
    return this.save();
};

feedbacks.methods.removerReacao = function(emoji) {
    const reacao = this.reacoes.find(r => r.emoji === emoji);
    if (reacao && reacao.count > 0) {
        reacao.count -= 1;
        if (reacao.count === 0) {
            this.reacoes = this.reacoes.filter(r => r.emoji !== emoji);
        }
    }
    return this.save();
};

feedbacks.methods.alterarStatus = function(novoStatus, adminId) {
    this.status = novoStatus;
    this.analisado_por = adminId;
    return this.save();
};

// ✅ EXPORT
module.exports = mongoose.model('feedbacks', feedbacks);