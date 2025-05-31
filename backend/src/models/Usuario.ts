// src/models/Usuario.ts
import { Schema, model, Document, Types } from 'mongoose';

// Interface para o documento do usuário
export interface IUsuario extends Document {
    nome: string;
    email: string;
    senha: string;
    role: 'usuario' | 'admin' | 'super_admin';
    xp: number;
    conquistas: boolean[];
    feedbacksIn: Types.ObjectId[];
    feedbacksOut: Types.ObjectId[];
    data_criacao: Date;

    // Métodos de instância
    isAdmin(): boolean;
    isSuperAdmin(): boolean;
}

const usuarioSchema = new Schema<IUsuario>({
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

// Métodos de instância
usuarioSchema.methods.isAdmin = function(this: IUsuario): boolean {
    return this.role === 'admin' || this.role === 'super_admin';
};

usuarioSchema.methods.isSuperAdmin = function(this: IUsuario): boolean {
    return this.role === 'super_admin';
};

// Índices
usuarioSchema.index({ email: 1 });
usuarioSchema.index({ role: 1 });

// Exportar o modelo
export const Usuario = model<IUsuario>('usuarios', usuarioSchema);
export default Usuario;