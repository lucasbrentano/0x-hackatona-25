var usuarios = new Schema({
    nome: {
        type: String,
        maxlength: 25,
        minlength: 5,
        required: true,
        trim: true
    },

    email: {
        type: String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        required: true,
        unique: true,
        lowercase: true
    },

    senha: {
        type: String,
        required: true,
        minlength: 6
    },

    // ✅ ADICIONAR: Role do usuário
    role: {
        type: String,
        enum: ['usuario', 'admin', 'super_admin'],
        default: 'usuario'
    },

    xp: {
        type: Number,
        default: 0,
        min: 0
    },

    conquistas: [
        {
            type: Boolean,
            default: false
        },
        {
            type: Boolean,
            default: false
        },
        {
            type: Boolean,
            default: false
        }
    ],

    feedbacksIn: [
        {
            type: Schema.Types.ObjectId,
            ref: 'feedbacks'
        }
    ],

    feedbacksOut: [
        {
            type: Schema.Types.ObjectId,
            ref: 'feedbacks'
        }
    ],

    data_criacao: {
        type: Date,
        default: Date.now
    }
});

// ✅ MÉTODOS: Verificar permissões
usuarios.methods.isAdmin = function() {
    return this.role === 'admin' || this.role === 'super_admin';
};

usuarios.methods.isSuperAdmin = function() {
    return this.role === 'super_admin';
};

usuarios.index({ email: 1 });
usuarios.index({ role: 1 });

module.exports = mongoose.model('usuarios', usuarios);