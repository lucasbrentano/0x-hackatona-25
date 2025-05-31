// tests/setup.ts
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    // Criar servidor MongoDB em memória para testes
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Conectar ao banco de teste
    await mongoose.connect(mongoUri);

    console.log('🧪 MongoDB em memória conectado para testes');
});

afterAll(async () => {
    // Limpar e fechar conexões
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();

    console.log('🧹 Banco de testes limpo e conexões fechadas');
});

afterEach(async () => {
    // Limpar todas as collections após cada teste
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});

// Configurações globais para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-super-secure';
process.env.PORT = '0'; // Deixa o sistema escolher uma porta disponível

// Silenciar logs durante os testes
console.log = jest.fn();
console.error = jest.fn();