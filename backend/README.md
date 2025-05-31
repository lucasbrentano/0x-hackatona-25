# 🚀 Hackathon 2025 - Backend API

Backend Node.js + TypeScript + MongoDB + Docker para o Hackathon 2025.

## 🛠️ Tecnologias

- **Node.js 18** + **TypeScript**
- **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Banco de dados NoSQL
- **Docker** + **Docker Compose** - Containerização
- **Helmet** + **CORS** - Segurança
- **Nodemon** - Hot reload para desenvolvimento

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js 18+](https://nodejs.org/) (opcional, se quiser rodar sem Docker)
- [Git](https://git-scm.com/)

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/lucasbrentano/0x-hackatona-25.git
cd backend
```

### 2. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env se necessário (opcional)
nano .env
```

### 3. Executar com Docker (Recomendado)

```bash
# Construir e executar todos os serviços
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

### 4. Verificar se está funcionando

Acesse: http://localhost:3000

Você deve ver:
```json
{
  "message": "🚀 Hackathon 2025 - Backend API com MongoDB",
  "status": "running",
  "timestamp": "2025-05-31T07:00:00.000Z",
  "version": "1.0.0",
  "database": "MongoDB + Mongoose",
  "endpoints": {
    "health": "/health",
    "api": "/api/*",
    "users": "/api/users"
  }
}
```

## 🌐 URLs e Portas

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **API** | http://localhost:3000 | API Principal |
| **Health Check** | http://localhost:3000/health | Status da aplicação |
| **Mongo Express** | http://localhost:8082 | Interface web do MongoDB |

## 📊 Endpoints da API

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/users` | Listar usuários (com paginação) |
| `GET` | `/api/users/:id` | Buscar usuário por ID |
| `POST` | `/api/users` | Criar novo usuário |
| `PUT` | `/api/users/:id` | Atualizar usuário |
| `DELETE` | `/api/users/:id` | Deletar usuário |
| `PATCH` | `/api/users/:id/deactivate` | Desativar usuário (soft delete) |

### Exemplos de uso

```bash
# Listar usuários
curl http://localhost:3000/api/users

# Criar usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@email.com","age":25}'

# Buscar usuário por ID
curl http://localhost:3000/api/users/USER_ID

# Listar com paginação
curl "http://localhost:3000/api/users?limit=5&page=1"

# Filtrar usuários ativos
curl "http://localhost:3000/api/users?active=true"

# Atualizar usuário
curl -X PUT http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"João Santos","age":26}'

# Desativar usuário
curl -X PATCH http://localhost:3000/api/users/USER_ID/deactivate
```

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Executar com hot reload
npm run build        # Compilar TypeScript
npm start            # Executar build compilado

# Docker
npm run docker:build # Construir images
npm run docker:up    # Executar em background
npm run docker:dev   # Executar com logs
npm run docker:down  # Parar containers
npm run docker:clean # Parar e limpar volumes
npm run docker:logs  # Ver logs da aplicação

# Formatação
npm run prettier     # Formatar código
```

## 🗂️ Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuração MongoDB
│   ├── controllers/
│   │   └── userController.ts    # Lógica de usuários
│   ├── models/
│   │   └── User.ts              # Schema do usuário
│   ├── routes/
│   │   └── userRoutes.ts        # Rotas dos usuários
│   ├── middleware/              # Middlewares customizados
│   ├── types/                   # Tipos TypeScript
│   └── index.ts                 # Arquivo principal
├── docker/
│   └── mongo-init.js            # Script de inicialização do MongoDB
├── docker-compose.yml           # Configuração dos containers
├── Dockerfile                   # Image da aplicação
├── package.json                 # Dependências e scripts
├── tsconfig.json               # Configuração TypeScript
├── .env                        # Variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
└── README.md                   # Este arquivo
```

## 🛠️ Comandos Docker Úteis

```bash
# Ver containers rodando
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs -f app
docker-compose logs -f mongo

# Executar comandos dentro do container
docker-compose exec app sh
docker-compose exec mongo mongosh

# Reiniciar um serviço
docker-compose restart app

# Parar e remover tudo
docker-compose down -v

# Rebuild sem cache
docker-compose build --no-cache
```

## 🔧 Solução de Problemas

### Erro: "Port already in use"

```bash
# Verificar o que está usando as portas
sudo lsof -i :3000
sudo lsof -i :27018
sudo lsof -i :8082

# Parar containers conflitantes
docker stop $(docker ps -q)
```

### Erro de autenticação MongoDB

Verifique se a `MONGODB_URI` no `.env` está correta:
```env
MONGODB_URI=mongodb://admin:password123@mongo:27017/hackathon-db?authSource=admin
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs

# Rebuild completo
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Dados não persistem

Verifique se o volume do MongoDB está configurado:
```bash
# Ver volumes
docker volume ls

# Se necessário, recriar
docker-compose down -v
docker-compose up --build
```

## 🌟 Funcionalidades Implementadas

- ✅ CRUD completo de usuários
- ✅ Validações robustas (email único, campos obrigatórios)
- ✅ Paginação e filtros
- ✅ Soft delete (desativação)
- ✅ Timestamps automáticos
- ✅ Conexão segura com MongoDB
- ✅ Interface web para banco de dados
- ✅ Hot reload para desenvolvimento
- ✅ Containerização completa
- ✅ Logs estruturados
- ✅ Health check
- ✅ Tratamento de erros

## 🚀 Próximos Passos

- [ ] Validações avançadas
- [ ] Testes automatizados
- [ ] Documentação da API (Swagger)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 👥 Equipe

**Equipe 0x** - Hackatona 2025 Engenharia de Software PUCRS

---

**Feito com ❤️ para a Hackatona 2025 - Engenharia de Software PUCRS**