import mongoose, { Document, Schema } from 'mongoose';

// Interface para o User
export interface IUser extends Document {
    name: string;
    email: string;
    age?: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Schema do User
const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
        minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
        maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, forneça um email válido'
        ]
    },
    age: {
        type: Number,
        min: [0, 'Idade deve ser um número positivo'],
        max: [120, 'Idade deve ser realista']
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para performance
UserSchema.index({ email: 1 });
UserSchema.index({ active: 1 });

// Virtual para mostrar se é novo usuário (menos de 24h)
UserSchema.virtual('isNew').get(function() {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return this.createdAt > oneDayAgo;
});

// Middleware para executar antes de salvar
UserSchema.pre('save', function(next) {
    console.log(`💾 Salvando usuário: ${this.name}`);
    next();
});

// Método estático para buscar usuários ativos
UserSchema.statics.findActive = function() {
    return this.find({ active: true });
};

// Método de instância para desativar usuário
UserSchema.methods.deactivate = function() {
    this.active = false;
    return this.save();
};

export default mongoose.model<IUser>('User', UserSchema);