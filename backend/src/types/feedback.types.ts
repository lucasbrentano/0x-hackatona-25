// src/types/feedback.types.ts

export interface CreateFeedbackForumDTO {
    forum_id: string;
    conteudo: string;
    categoria: 'bug' | 'melhoria' | 'elogio' | 'critica' | 'sugestao' | 'outro';
    prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
    isAnonimo?: boolean;
    isPrivado?: boolean;
    hashtags?: string[];
}

export interface CreateFeedbackP2PDTO {
    destinatario_id: string;
    conteudo: string;
    isAnonimo?: boolean;
    isPrivado?: boolean;
    hashtags?: string[];
}

export interface UpdateFeedbackDTO {
    conteudo?: string;
    categoria?: 'bug' | 'melhoria' | 'elogio' | 'critica' | 'sugestao' | 'outro';
    prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';
    status?: 'pendente' | 'em_analise' | 'resolvido' | 'descartado';
    isPrivado?: boolean;
}

export interface FeedbackResponse {
    _id: string;
    usuario_id: string | {
        _id: string;
        nome: string;
        email: string;
    };
    forum_id?: string | {
        _id: string;
        nome: string;
        projeto: string;
    };
    destinatario_id?: string | {
        _id: string;
        nome: string;
        email: string;
    };
    tipo: 'forum' | 'p2p';
    conteudo: string;
    isAnonimo: boolean;
    isPrivado: boolean;
    reacoes: Array<{
        emoji: string;
        count: number;
    }>;
    categoria?: string;
    prioridade?: string;
    status?: string;
    analisado_por?: string | {
        _id: string;
        nome: string;
        email: string;
    };
    data_criacao: Date;
    data_atualizacao: Date;
    hashtags?: string[];
}

export interface ReacaoDTO {
    emoji: string;
}

export interface AlterarStatusFeedbackDTO {
    status: 'pendente' | 'em_analise' | 'resolvido' | 'descartado';
}

export enum FeedbackTipo {
    FORUM = 'forum',
    P2P = 'p2p'
}

export enum FeedbackCategoria {
    BUG = 'bug',
    MELHORIA = 'melhoria',
    ELOGIO = 'elogio',
    CRITICA = 'critica',
    SUGESTAO = 'sugestao',
    OUTRO = 'outro'
}

export enum FeedbackPrioridade {
    BAIXA = 'baixa',
    MEDIA = 'media',
    ALTA = 'alta',
    URGENTE = 'urgente'
}

export enum FeedbackStatus {
    PENDENTE = 'pendente',
    EM_ANALISE = 'em_analise',
    RESOLVIDO = 'resolvido',
    DESCARTADO = 'descartado'
}

export interface FeedbackFiltros {
    tipo?: 'forum' | 'p2p';
    categoria?: string;
    status?: string;
    prioridade?: string;
    usuario_id?: string;
    forum_id?: string;
    destinatario_id?: string;
    isAnonimo?: boolean;
    isPrivado?: boolean;
    data_inicio?: Date;
    data_fim?: Date;
}