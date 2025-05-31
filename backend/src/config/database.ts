import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon-db';

        await mongoose.connect(mongoURI);

        console.log('✅ MongoDB conectado com sucesso!');
        console.log(`🗄️ Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ Erro ao conectar com MongoDB:', error);
        console.error('💡 Certifique-se de que o MongoDB está rodando');
        process.exit(1);
    }
};

// Event listeners para conexão
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB desconectado');
});

mongoose.connection.on('error', (error) => {
    console.error('❌ Erro no MongoDB:', error);
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconectado');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('📴 Conexão MongoDB fechada devido ao encerramento da aplicação');
    process.exit(0);
});