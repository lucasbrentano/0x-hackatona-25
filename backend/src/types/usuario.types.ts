// src/types/usuario.types.ts

export interface CreateUsuarioDTO {
    nome: string;
    email: string;
    senha: string;
    role?: 'usuario' | 'admin' | 'super_admin';
}

export interface UpdateUsuarioDTO {
    nome?: string;
    email?: string;
    role?: 'usuario' | 'admin' | 'super_admin';
    xp?: number;
}

export interface UsuarioResponse {
    _id: string;
    nome: string;
    email: string;
    role: string;
    xp: number;
    conquistas: boolean[];
    data_criacao: Date;
}

export interface LoginDTO {
    email: string;
    senha: string;
}

export interface AuthResponse {
    token: string;
    user: UsuarioResponse;
}

export enum UserRole {
    USUARIO = 'usuario',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}