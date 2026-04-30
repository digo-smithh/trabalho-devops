# ===== Etapa 1: build do React =====
FROM node:20-alpine AS build
WORKDIR /app

# Copia primeiro só os manifests pra aproveitar cache de camadas:
# se package.json/lock não mudou, o npm ci nao reroda no proximo build.
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copia o resto do codigo e gera o build de producao
COPY . .
RUN npm run build

# ===== Etapa 2: serve com Nginx =====
FROM nginx:alpine

# Substitui o default do Nginx pelo nosso (com proxy_pass pro backend)
COPY default.conf /etc/nginx/conf.d/default.conf

# Copia o build do React pro lugar onde o Nginx serve estaticos
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
