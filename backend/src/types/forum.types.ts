// src/types/forum.types.ts

export interface CreateForumDTO {
    nome: string;
    descricao: string;
    projeto: string;
    configuracoes?: {
        feedback_anonimo?: boolean;
        apenas_membros?: boolean;
        notificacoes_ativas?: boolean;
    };
}

export interface UpdateForumDTO {
    nome?: string;
    descricao?: string;
    projeto?: string;
    status?: 'ativo' | 'pausado' | 'concluido' | 'arquivado';
    configuracoes?: {
        feedback_anonimo?: boolean;
        apenas_membros?: boolean;
        notificacoes_ativas?: boolean;
    };
}

export interface ForumResponse {
    _id: string;
    nome: string;
    descricao: string;
    projeto: string;
    criador: string | {
        _id: string;
        nome: string;
        email: string;
    };
    membros: string[] | Array<{
        _id: string;
        nome: string;
        email: string;
    }>;
    feedbacks: string[];
    status: string;
    configuracoes: {
        feedback_anonimo: boolean;
        apenas_membros: boolean;
        notificacoes_ativas: boolean;
    };
    data_criacao: Date;
    data_atualizacao: Date;
}

export interface AddMembroDTO {
    usuarioId: string;
}

export interface AlterarStatusDTO {
    status: 'ativo' | 'pausado' | 'concluido' | 'arquivado';
}

export enum ForumStatus {
    ATIVO = 'ativo',
    PAUSADO = 'pausado',
    CONCLUIDO = 'concluido',
    ARQUIVADO = 'arquivado'
}

export interface ForumPermissions {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAddMembers: boolean;
    canRemoveMembers: boolean;
    canGiveFeedback: boolean;
}