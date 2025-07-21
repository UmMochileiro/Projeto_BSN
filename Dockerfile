# Multi-stage build para aplicação Ionic Angular
FROM node:20-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --silent

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# Estágio final - servir a aplicação
FROM nginx:alpine

# Copiar arquivos buildados para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
