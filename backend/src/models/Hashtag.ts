// src/models/Hashtag.ts - Versão simplificada para estatísticas
import { Schema, model, Document, Model } from 'mongoose';

// Interface para estatísticas de hashtag
export interface IHashtagStats extends Document {
    tag: string;
    total_usos: number;
    usos_ultima_semana: number;
    usos_ultimo_mes: number;
    primeiro_uso: Date;
    ultimo_uso: Date;
    ativa: boolean;

    // Métodos de instância
    incrementarUso(): Promise<IHashtagStats>;
    isPopular(): boolean;
    isTrending(): boolean;
}

// Interface para métodos estáticos
export interface IHashtagStatsModel extends Model<IHashtagStats> {
    atualizarEstatisticas(hashtags: string[]): Promise<void>;
    resetarContadoresSemana(): Promise<void>;
    resetarContadoresMes(): Promise<void>;
}

const hashtagStatsSchema = new Schema<IHashtagStats>({
    tag: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        maxlength: 50,
        match: /^[a-zA-Z0-9_]+$/
    },

    total_usos: {
        type: Number,
        default: 1,
        min: 0
    },

    usos_ultima_semana: {
        type: Number,
        default: 1,
        min: 0
    },

    usos_ultimo_mes: {
        type: Number,
        default: 1,
        min: 0
    },

    primeiro_uso: {
        type: Date,
        default: Date.now
    },

    ultimo_uso: {
        type: Date,
        default: Date.now
    },

    ativa: {
        type: Boolean,
        default: true
    }
});

// Métodos de instância
hashtagStatsSchema.methods.incrementarUso = function(this: IHashtagStats): Promise<IHashtagStats> {
    this.total_usos += 1;
    this.usos_ultima_semana += 1;
    this.usos_ultimo_mes += 1;
    this.ultimo_uso = new Date();
    return this.save();
};

hashtagStatsSchema.methods.isPopular = function(this: IHashtagStats): boolean {
    return this.total_usos >= 10;
};

hashtagStatsSchema.methods.isTrending = function(this: IHashtagStats): boolean {
    return this.usos_ultima_semana >= 3;
};

// Métodos estáticos
hashtagStatsSchema.statics.atualizarEstatisticas = async function(hashtags: string[]) {
    for (const tag of hashtags) {
        const tagLimpa = tag.toLowerCase();

        const hashtagStat = await this.findOne({ tag: tagLimpa });

        if (hashtagStat) {
            await hashtagStat.incrementarUso();
        } else {
            await this.create({
                tag: tagLimpa,
                total_usos: 1,
                usos_ultima_semana: 1,
                usos_ultimo_mes: 1
            });
        }
    }
};

hashtagStatsSchema.statics.resetarContadoresSemana = async function() {
    await this.updateMany({}, { usos_ultima_semana: 0 });
};

hashtagStatsSchema.statics.resetarContadoresMes = async function() {
    await this.updateMany({}, { usos_ultimo_mes: 0 });
};

// Índices
hashtagStatsSchema.index({ total_usos: -1 });
hashtagStatsSchema.index({ usos_ultima_semana: -1 });
hashtagStatsSchema.index({ ultimo_uso: -1 });

export const HashtagStats = model<IHashtagStats, IHashtagStatsModel>('hashtag_stats', hashtagStatsSchema);
export default HashtagStats;