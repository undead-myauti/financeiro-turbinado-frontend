# Usar Node.js Alpine
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Instalar serve globalmente
RUN npm install -g serve

# Expor porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["serve", "-s", "dist", "-l", "3000"] 