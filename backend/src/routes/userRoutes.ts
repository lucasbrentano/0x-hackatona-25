import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

// Rotas CRUD para usuários
router.post('/users', UserController.createUser);           // Criar usuário
router.get('/users', UserController.getUsers);              // Listar usuários (com paginação e filtros)
router.get('/users/:id', UserController.getUserById);       // Buscar usuário por ID
router.put('/users/:id', UserController.updateUser);        // Atualizar usuário
router.delete('/users/:id', UserController.deleteUser);     // Deletar usuário
router.patch('/users/:id/deactivate', UserController.deactivateUser); // Desativar usuário

export default router;