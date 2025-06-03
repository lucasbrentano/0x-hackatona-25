var foruns = new Schema({
    // ❌ REMOVER: _id é automático no Mongoose
    // _id: {
    //     type: Schema.Types.ObjectId,
    //     required: true
    // },

    nome: {
        type: String,
        maxlength: 100,
        minlength: 5,
        required: true,
        trim: true,       // Remove espaços extras
        unique: true      // Nome do fórum único
    },

    descricao: {
        type: String,
        maxlength: 500,
        trim: true,
        required: true    // Descrever o projeto/time
    },

    // ✅ CORPORATIVO: Projeto ou equipe
    projeto: {
        type: String,
        maxlength: 100,
        trim: true,
        required: true    // Nome do projeto/equipe
    },

    // ✅ CORPORATIVO: Admin que criou (usuário com role admin)
    criador: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',   // Usuário com role 'admin'
        required: true
    },

    // ✅ CORPORATIVO: Membros do time/projeto
    membros: [
        {
            type: Schema.Types.ObjectId,
            ref: 'usuarios'  // Membros do projeto/time
        }
    ],

    feedbacks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'feedbacks'  // Feedbacks do projeto
        }
    ],

    // ✅ CORPORATIVO: Status do projeto
    status: {
        type: String,
        enum: ['ativo', 'pausado', 'concluido', 'arquivado'],
        default: 'ativo'
    },

    // ✅ CORPORATIVO: Configurações do fórum
    configuracoes: {
        feedback_anonimo: {
            type: Boolean,
            default: true     // Permite feedback anônimo
        },
        apenas_membros: {
            type: Boolean,
            default: true     // Só membros podem dar feedback
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

// ✅ MIDDLEWARE: Atualizar data_atualizacao
foruns.pre('save', function(next) {
    this.data_atualizacao = Date.now();
    next();
});

// ✅ ÍNDICES: Para performance corporativa
foruns.index({ projeto: 1 });
foruns.index({ status: 1 });
foruns.index({ admin_criador: 1 });
foruns.index({ data_criacao: -1 });

// ✅ MÉTODOS: Gestão de membros
foruns.methods.adicionarMembro = function(usuarioId) {
    if (!this.membros.includes(usuarioId)) {
        this.membros.push(usuarioId);
    }
    return this.save();
};

foruns.methods.removerMembro = function(usuarioId) {
    this.membros = this.membros.filter(id => !id.equals(usuarioId));
    return this.save();
};

foruns.methods.alterarStatus = function(novoStatus) {
    this.status = novoStatus;
    return this.save();
};

// ✅ EXPORT
module.exports = mongoose.model('foruns', foruns);