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

# Build da aplicação para produção com subpath /pokedex/
RUN node build-for-subpath.js

# Listar arquivos gerados para debug
RUN ls -la /app/www/

# Estágio final - servir a aplicação
FROM nginx:alpine

# Remover configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar arquivos buildados para o nginx
COPY --from=build /app/www/ /usr/share/nginx/html/

# Debug: Listar arquivos copiados
RUN ls -la /usr/share/nginx/html/

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Debug: Verificar configuração do nginx
RUN nginx -t

# Criar diretório para logs se não existir
RUN mkdir -p /var/log/nginx

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
