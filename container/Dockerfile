# Imagem base oficial do Node.js (versão leve alpine)
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o restante do código da aplicação
COPY . .

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]