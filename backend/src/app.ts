// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import connectDB from './config/database';
import routes from './routes';

const app = express();

// ========== CONECTAR AO BANCO DE DADOS ==========
connectDB();

// ========== MIDDLEWARES DE SEGURANÇA ==========
// Helmet para headers de segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP por janela de tempo
    message: {
        success: false,
        message: 'Muitas tentativas. Tente novamente em 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Rate limiting mais restritivo para login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 tentativas de login por IP
    message: {
        success: false,
        message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    },
    skipSuccessfulRequests: true,
});
app.use('/api/v1/usuarios/login', loginLimiter);

// ========== MIDDLEWARES GERAIS ==========
// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));

// Compressão
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

// Parse JSON e URL-encoded
app.use(express.json({
    limit: '10mb',
    type: 'application/json'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

// ========== ROTAS ==========
app.use('/api/v1', routes);

// ========== MIDDLEWARE DE TRATAMENTO DE ERROS 404 ==========
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Rota ${req.originalUrl} não encontrada`,
        availableRoutes: {
            base: '/api/v1',
            usuarios: '/api/v1/usuarios',
            health: '/api/v1/health'
        }
    });
});

// ========== MIDDLEWARE DE TRATAMENTO DE ERROS GLOBAIS ==========
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error Stack:', error.stack);
    console.error('Error Message:', error.message);
    console.error('Request URL:', req.url);
    console.error('Request Method:', req.method);
    console.error('Request Body:', req.body);

    // Erro de validação do Mongoose
    if (error.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: Object.values((error as any).errors).map((err: any) => ({
                field: err.path,
                message: err.message
            }))
        });
        return;
    }

    // Erro de duplicata do MongoDB (email único)
    if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        const field = Object.keys((error as any).keyPattern)[0];
        res.status(400).json({
            success: false,
            message: `${field} já está em uso`
        });
        return;
    }

    // Erro de cast do MongoDB (ID inválido)
    if (error.name === 'CastError') {
        res.status(400).json({
            success: false,
            message: 'ID inválido'
        });
        return;
    }

    // Erro padrão
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && {
            error: error.message,
            stack: error.stack
        })
    });
});

const PORT = process.env.PORT || 3000;

// ========== INICIAR SERVIDOR ==========
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📋 Health Check: http://localhost:${PORT}/api/v1/health`);
});

// ========== GRACEFUL SHUTDOWN ==========
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});

export default app;