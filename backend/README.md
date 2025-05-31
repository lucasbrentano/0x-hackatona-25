# 🚀 Hackathon 2025 - Backend API

> **Sistema de Feedbacks Colaborativo com Node.js + TypeScript + MongoDB**

[![Tests](https://img.shields.io/badge/tests-24%20passing-brightgreen)](https://github.com/yourusername/hackathon-backend)
[![Coverage](https://img.shields.io/badge/coverage-41.38%25-green)](https://github.com/yourusername/hackathon-backend)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

## 📋 Sobre o Projeto

API RESTful completa para sistema de feedbacks colaborativo, desenvolvida para o Hackathon 2025. Permite gestão de usuários, fóruns, feedbacks P2P e sistema inteligente de hashtags.

### ✨ Principais Funcionalidades

- 👥 **Gestão de Usuários** - Registro, login, perfis e roles
- 🏛️ **Sistema de Fóruns** - Criação, membros e moderação
- 💬 **Feedbacks P2P** - Feedback entre usuários e em fóruns
- 🏷️ **Hashtags Inteligentes** - Extração automática e trending
- 🔐 **Autenticação JWT** - Segurança robusta
- 📊 **Sistema de Reações** - Emojis e interações

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+ + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Tests:** Jest + Supertest (41% coverage)
- **Security:** Helmet + CORS + Rate Limiting
- **DevOps:** Docker + CI/CD

## ⚡ Quick Start

### 📦 Opção 1: Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/yourusername/hackathon-backend.git
cd hackathon-backend

# Subir backend
docker-compose up --build

# ✅ Backend disponível em http://localhost:3000
```

### 🔧 Opção 2: Desenvolvimento Local

#### **Pré-requisitos**
- Node.js 18+
- MongoDB rodando
- npm ou yarn

#### **Instalação**

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações

# 3. Iniciar backend
npm run dev

# ✅ Backend rodando em http://localhost:3000
```

#### **Variáveis de Ambiente (.env)**

```env
# Servidor
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hackathon

# JWT
JWT_SECRET=seu-jwt-secret-super-seguro
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## 📖 API Base

### **🔍 Health Check**
```bash
curl http://localhost:3000/api/v1/health
```

### **📚 Documentação Completa**
```bash
curl http://localhost:3000/api/v1
```

### **🚀 Base URL**
```
http://localhost:3000/api/v1
```

## 🧪 Executar Testes

### **🏃‍♂️ Todos os Testes**
```bash
npm test
```

### **📊 Testes com Cobertura**
```bash
npm run test:coverage

# 📈 Relatório visual em: coverage/lcov-report/index.html
```

### **👀 Modo Watch (Desenvolvimento)**
```bash
npm run test:watch
```

### **🎯 Resultados dos Testes**
```
✅ 24 testes passando
📊 41.38% de cobertura
⚡ Execução em ~13s
🔬 5 suites de teste:
  - 👥 Usuários (registro, login, perfil)
  - 🏛️ Fóruns (criação, membros, permissões)  
  - 💬 Feedbacks (P2P, reações, hashtags)
  - 🏷️ Hashtags (populares, trending, busca)
  - ❤️ Health Check (sistema, rotas)
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # 🎮 Controladores da API
│   ├── models/          # 💾 Modelos Mongoose
│   ├── routes/          # 🛣️ Rotas Express
│   ├── services/        # ⚙️ Lógica de negócio
│   ├── middleware/      # 🔒 Middlewares (auth, validation)
│   ├── types/           # 📝 Definições TypeScript
│   ├── config/          # ⚙️ Configurações
│   └── app.ts           # 🚀 Aplicação Express
├── tests/
│   ├── integration/     # 🧪 Testes de integração
│   ├── helpers/         # 🛠️ Utilitários de teste
│   └── setup.ts         # ⚙️ Configuração de testes
├── docker-compose.yml   # 🐳 Orquestração
├── Dockerfile          # 📦 Container de produção
└── package.json        # 📋 Dependências e scripts
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia com nodemon
npm start           # Inicia com ts-node
npm run build       # Compila TypeScript
npm run prod        # Inicia versão compilada

# Testes
npm test            # Executa testes
npm run test:watch  # Modo watch
npm run test:coverage # Com cobertura

# Qualidade
npm run lint        # ESLint
npm run prettier    # Formatação

# Docker
npm run docker:build    # Build da imagem
npm run docker:up      # Subir containers
npm run docker:down    # Parar containers
npm run docker:logs    # Ver logs
```

## 🌐 Endpoints da API

### **👥 Usuários**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `POST` | `/usuarios/registro` | Criar conta | ❌ |
| `POST` | `/usuarios/login` | Fazer login | ❌ |
| `GET` | `/usuarios/perfil` | Dados do usuário logado | ✅ |
| `PATCH` | `/usuarios/:id/xp` | Atualizar XP (admin) | ✅ |

### **🏛️ Fóruns**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/foruns` | Listar fóruns | ✅ |
| `POST` | `/foruns` | Criar fórum (admin) | ✅ |
| `GET` | `/foruns/:id` | Detalhes do fórum | ✅ |
| `GET` | `/foruns/usuario/meus-foruns` | Meus fóruns | ✅ |
| `POST` | `/foruns/:id/membros` | Adicionar membro | ✅ |

### **💬 Feedbacks**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/feedbacks` | Listar feedbacks | ✅ |
| `POST` | `/feedbacks/p2p` | Feedback entre usuários | ✅ |
| `POST` | `/feedbacks/forum` | Feedback em fórum | ✅ |
| `GET` | `/feedbacks/usuario/meus-feedbacks` | Meus feedbacks | ✅ |
| `POST` | `/feedbacks/:id/reacoes` | Adicionar reação (👍😊) | ✅ |
| `GET` | `/feedbacks/hashtag/:hashtag` | Buscar por hashtag | ✅ |

### **🏷️ Hashtags**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/hashtags/populares` | Top hashtags | ✅ |
| `GET` | `/hashtags/trending` | Hashtags trending | ✅ |
| `GET` | `/hashtags/buscar?q=termo` | Buscar hashtags | ✅ |
| `GET` | `/hashtags/admin/estatisticas` | Stats (admin) | ✅ |

### **❤️ Sistema**
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/health` | Status da API | ❌ |
| `GET` | `/` | Documentação | ❌ |

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)**. Incluir token no header das requisições autenticadas:

```
Authorization: Bearer <token>
```

### **🎭 Roles de Usuário**
- `usuario` - Usuário padrão
- `admin` - Administrador (pode criar fóruns)
- `super_admin` - Super administrador

## 📡 Formato das Respostas

### **✅ Sucesso**
```json
{
  "success": true,
  "data": { /* dados */ },
  "message": "Operação realizada com sucesso"
}
```

### **❌ Erro**
```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": [ /* detalhes (opcional) */ ]
}
```

### **📄 Listas Paginadas**
```json
{
  "success": true,
  "data": {
    "feedbacks": [ /* itens */ ],
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
}
```

## 📊 Monitoramento

### **❤️ Health Check**
```bash
GET /api/v1/health
```

**Resposta:**
```json
{
  "status": "OK",
  "message": "API funcionando corretamente",
  "timestamp": "2025-05-31T16:45:30.447Z",
  "uptime": 123.456,
  "environment": "development"
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autoria
**Equipe 0x**

---

<div align="center">

**🏆 Desenvolvido para o Hackathon ES PUCRS 2025 🏆**

⭐ Se este projeto te ajudou, deixe uma estrela!

</div>