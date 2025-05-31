import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança e parsing
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rota principal
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Hackathon 2025 - Backend API com MongoDB',
        status: 'running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'MongoDB + Mongoose',
        endpoints: {
            health: '/health',
            api: '/api/*',
            users: '/api/users'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
            status: 'connected',
            name: process.env.MONGODB_URI?.split('/').pop() || 'hackathon-db'
        },
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        }
    });
});

// Rotas da API
app.get('/api/ping', (req, res) => {
    res.json({
        success: true,
        message: 'pong',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando corretamente',
        data: {
            server: 'Node.js + TypeScript',
            framework: 'Express.js',
            database: 'MongoDB + Mongoose',
            uptime: process.uptime(),
            nodeVersion: process.version,
            timestamp: new Date().toISOString()
        }
    });
});

// Rotas dos usuários
app.use('/api', userRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method
    });
});

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Erro capturado:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🎯 ============================================');
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`💚 Health: http://localhost:${PORT}/health`);
    console.log(`📊 Status: http://localhost:${PORT}/api/status`);
    console.log(`👥 Users: http://localhost:${PORT}/api/users`);
    console.log('🎯 ============================================');
});

export default app;