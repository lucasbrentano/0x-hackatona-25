# Usar Node.js 18 Alpine (mais leve)
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor porta da aplicação
EXPOSE 3000

# Comando para executar a aplicação
CMD ["npm", "start"]