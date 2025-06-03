# Dockerfile
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar arquivos de dependências primeiro (para cache do Docker)
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Instalar dependências que podem estar faltando
RUN npm install morgan express-rate-limit compression mongoose bcryptjs jsonwebtoken express-validator

# Instalar tipos TypeScript
RUN npm install -D @types/morgan @types/compression

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev"]