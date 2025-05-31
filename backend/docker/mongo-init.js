// Script de inicialização do MongoDB
print('🚀 Inicializando banco de dados do Hackathon...');

// Selecionar database
db = db.getSiblingDB('hackathon-db');

// Criar usuário para a aplicação
db.createUser({
    user: 'hackathon-user',
    pwd: 'hackathon-pass',
    roles: [
        {
            role: 'readWrite',
            db: 'hackathon-db'
        }
    ]
});

// Criar coleção de usuários com dados de exemplo
db.users.insertMany([
    {
        name: 'Admin User',
        email: 'admin@hackathon.com',
        age: 30,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        age: 25,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        age: 28,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

// Criar índices para performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ active: 1 });

print('✅ Banco inicializado com sucesso!');
print('👥 Usuários criados: ' + db.users.count());
print('📊 Coleções disponíveis: ' + db.getCollectionNames());