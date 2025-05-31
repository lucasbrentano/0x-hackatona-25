import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

export class UserController {

    // Criar usuário
    static async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData: Partial<IUser> = req.body;

            // Verificar se usuário já existe
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: 'Email já está em uso'
                });
                return;
            }

            const user = new User(userData);
            const savedUser = await user.save();

            res.status(201).json({
                success: true,
                data: savedUser,
                message: 'Usuário criado com sucesso'
            });
        } catch (error: any) {
            console.error('Erro ao criar usuário:', error);

            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((err: any) => err.message);
                res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro interno do servidor'
                });
            }
        }
    }

    // Listar todos os usuários
    static async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const { active, limit = 10, page = 1 } = req.query;

            // Filtros
            const filter: any = {};
            if (active !== undefined) {
                filter.active = active === 'true';
            }

            // Paginação
            const limitNum = parseInt(limit as string);
            const pageNum = parseInt(page as string);
            const skip = (pageNum - 1) * limitNum;

            const users = await User.find(filter)
                .select('-__v') // Remover campo __v
                .sort({ createdAt: -1 })
                .limit(limitNum)
                .skip(skip);

            const total = await User.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: users,
                pagination: {
                    current: pageNum,
                    total: Math.ceil(total / limitNum),
                    count: users.length,
                    totalRecords: total
                }
            });
        } catch (error: any) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar usuários'
            });
        }
    }

    // Buscar usuário por ID
    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const user = await User.findById(id).select('-__v');

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error: any) {
            console.error('Erro ao buscar usuário:', error);

            if (error.name === 'CastError') {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao buscar usuário'
                });
            }
        }
    }

    // Atualizar usuário
    static async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Remover campos que não devem ser atualizados diretamente
            delete updateData._id;
            delete updateData.__v;
            delete updateData.createdAt;
            delete updateData.updatedAt;

            const user = await User.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true, // Retornar documento atualizado
                    runValidators: true // Executar validações
                }
            ).select('-__v');

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: user,
                message: 'Usuário atualizado com sucesso'
            });
        } catch (error: any) {
            console.error('Erro ao atualizar usuário:', error);

            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((err: any) => err.message);
                res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors
                });
            } else if (error.name === 'CastError') {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao atualizar usuário'
                });
            }
        }
    }

    // Deletar usuário
    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const user = await User.findByIdAndDelete(id);

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Usuário deletado com sucesso',
                data: { deletedId: id }
            });
        } catch (error: any) {
            console.error('Erro ao deletar usuário:', error);

            if (error.name === 'CastError') {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao deletar usuário'
                });
            }
        }
    }

    // Desativar usuário (soft delete)
    static async deactivateUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const user = await User.findByIdAndUpdate(
                id,
                { active: false },
                { new: true, runValidators: true }
            ).select('-__v');

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Usuário desativado com sucesso',
                data: user
            });
        } catch (error: any) {
            console.error('Erro ao desativar usuário:', error);

            if (error.name === 'CastError') {
                res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao desativar usuário'
                });
            }
        }
    }
}