// src/services/usuarioService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario, IUsuario } from '../models/Usuario';
import { CreateUsuarioDTO, UpdateUsuarioDTO, LoginDTO } from '../types/usuario.types';

export class UsuarioService {

    async criarUsuario(dadosUsuario: CreateUsuarioDTO): Promise<IUsuario> {
        // Verificar se email já existe
        const usuarioExistente = await Usuario.findOne({ email: dadosUsuario.email });
        if (usuarioExistente) {
            throw new Error('Email já está em uso');
        }

        // Hash da senha
        const saltRounds = 12;
        const senhaHash = await bcrypt.hash(dadosUsuario.senha, saltRounds);

        const usuario = new Usuario({
            ...dadosUsuario,
            senha: senhaHash
        });

        return await usuario.save();
    }

    async autenticarUsuario(loginData: LoginDTO): Promise<{ token: string; user: IUsuario }> {
        const { email, senha } = loginData;

        // Buscar usuário pelo email
        const usuario = await Usuario.findOne({ email }).select('+senha');
        if (!usuario) {
            throw new Error('Credenciais inválidas');
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new Error('Credenciais inválidas');
        }

        // Verificar se JWT_SECRET está definido
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não está configurado no servidor');
        }

        // Gerar token JWT - versão simplificada que funciona
        const token = jwt.sign(
            {
                id: usuario._id.toString(),
                email: usuario.email,
                role: usuario.role
            },
            jwtSecret,
            {
                expiresIn: '7d'
            }
        );

        return { token, user: usuario };
    }

    async buscarPorEmail(email: string): Promise<IUsuario | null> {
        return await Usuario.findOne({ email }).exec();
    }

    async buscarPorId(id: string): Promise<IUsuario | null> {
        return await Usuario.findById(id).exec();
    }

    async atualizarUsuario(id: string, dados: UpdateUsuarioDTO): Promise<IUsuario | null> {
        // Se estiver atualizando email, verificar se já existe
        if (dados.email) {
            const usuarioExistente = await Usuario.findOne({
                email: dados.email,
                _id: { $ne: id }
            });
            if (usuarioExistente) {
                throw new Error('Email já está em uso');
            }
        }

        return await Usuario.findByIdAndUpdate(id, dados, {
            new: true,
            runValidators: true
        }).exec();
    }

    async listarUsuarios(page: number = 1, limit: number = 10): Promise<{
        usuarios: IUsuario[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const skip = (page - 1) * limit;

        const [usuarios, total] = await Promise.all([
            Usuario.find()
                .skip(skip)
                .limit(limit)
                .sort({ data_criacao: -1 })
                .exec(),
            Usuario.countDocuments()
        ]);

        return {
            usuarios,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async deletarUsuario(id: string): Promise<IUsuario | null> {
        return await Usuario.findByIdAndDelete(id).exec();
    }

    async atualizarXP(id: string, xp: number): Promise<IUsuario | null> {
        return await Usuario.findByIdAndUpdate(
            id,
            { $inc: { xp } },
            { new: true }
        ).exec();
    }

    async atualizarConquista(id: string, conquistaIndex: number, valor: boolean): Promise<IUsuario | null> {
        if (conquistaIndex < 0 || conquistaIndex > 2) {
            throw new Error('Índice de conquista inválido. Deve ser 0, 1 ou 2');
        }

        const updateQuery = { [`conquistas.${conquistaIndex}`]: valor };

        return await Usuario.findByIdAndUpdate(
            id,
            updateQuery,
            { new: true }
        ).exec();
    }

    async buscarPorRole(role: string): Promise<IUsuario[]> {
        return await Usuario.find({ role }).exec();
    }
}