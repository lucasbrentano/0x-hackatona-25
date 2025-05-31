// src/config/database.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seu_banco';

        const conn = await mongoose.connect(mongoURI, {
            // Opções recomendadas para mongoose 6+
            // As opções antigas como useNewUrlParser não são mais necessárias
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Event listeners para conexão
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export default connectDB;