// src/types/hashtag.types.ts

export interface CreateHashtagDTO {
    tag: string;
    categoria?: 'feedback' | 'forum' | 'geral';
    feedback_id?: string;
    forum_id?: string;
}

export interface HashtagResponse {
    _id: string;
    tag: string;
    usuario_id: string | {
        _id: string;
        nome: string;
        email: string;
    };
    feedback_id?: string;
    forum_id?: string;
    categoria: 'feedback' | 'forum' | 'geral';
    popularidade: number;
    ativa: boolean;
    data_criacao: Date;
    data_ultima_uso: Date;
}

export interface HashtagTrendingResponse {
    _id: string;
    tag: string;
    popularidade: number;
    data_ultima_uso: Date;
    categoria: string;
    usuario_id: {
        _id: string;
        nome: string;
    };
}

export interface HashtagEstatsResponse {
    total_hashtags: number;
    hashtags_ativas: number;
    hashtags_trending: number;
    hashtags_populares: number;
    categorias: {
        feedback: number;
        forum: number;
        geral: number;
    };
    mais_usadas: HashtagResponse[];
    trending: HashtagTrendingResponse[];
}

export interface HashtagFiltros {
    categoria?: 'feedback' | 'forum' | 'geral';
    usuario_id?: string;
    feedback_id?: string;
    forum_id?: string;
    ativa?: boolean;
    popular?: boolean; // popularidade >= 10
    trending?: boolean; // trending na última semana
    busca?: string; // busca por texto na tag
}

export enum HashtagCategoria {
    FEEDBACK = 'feedback',
    FORUM = 'forum',
    GERAL = 'geral'
}