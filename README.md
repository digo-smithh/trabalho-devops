# Garimpo Musical com Docker

Aplicação web em três camadas (frontend, backend e banco) containerizada com
Docker, entregue como trabalho da disciplina de DevOps.

## Sobre

O Garimpo Musical é uma plataforma para descobrir artistas independentes:
mostra os lançamentos atuais, sugere artistas a partir da localização do
usuário e tem perfil próprio para cada artista, com músicas e link para o
Spotify.

O foco do trabalho não é a aplicação em si, e sim empacotá-la em contêineres,
isolando frontend, backend e banco em camadas independentes que sobem com um
único comando.

## Tecnologias

O frontend é uma aplicação React (Create React App) servida por Nginx. O
mesmo Nginx atua como reverse proxy, encaminhando as chamadas `/api/*` para o
backend.

O backend é um serviço Spring Boot 3.5 em Java 21, com Spring Data JPA sobre
Hibernate. O build é feito com Maven dentro de um Dockerfile multi-stage, de
modo que a imagem final só carrega o JAR e a JDK.

O banco é PostgreSQL 16 (`postgres:16-alpine`), com volume nomeado
(`postgres_data`) para persistência dos dados.

A orquestração é feita pelo Docker Compose v2, no arquivo `compose.yml` da
raiz do repositório.

## Arquitetura

A decisão de design mais importante foi expor apenas uma porta ao host: a do
frontend (`localhost:3000`). Backend e banco vivem dentro de uma rede Docker
privada (`garimpo-net`) e não são acessíveis de fora.

Quando o navegador abre o site, o Nginx do frontend devolve o build do React.
O JavaScript faz chamadas relativas para `/api/...`, que o Nginx encaminha
internamente para `http://backend:8080`. O backend, por sua vez, fala com o
banco em `postgres:5432`. Esses hostnames são resolvidos pelo DNS interno do
Docker, sem precisar configurar IPs.

Esse arranjo dá três benefícios práticos: reduz a superfície de ataque
(apenas uma porta exposta), elimina a necessidade de configurar CORS no
backend (tudo vem do mesmo origin do ponto de vista do navegador) e permite
usar URLs relativas no React, sem variável de ambiente.

A ordem de inicialização também está garantida: o Postgres tem um
`healthcheck` com `pg_isready`, e o backend só sobe depois que o healthcheck
passa.

## Estrutura

```
pratica-devops-garimpo-musical/
├── compose.yml          orquestração das 3 camadas
├── README.md
├── frontend/            React + Nginx
│   ├── Dockerfile       multi-stage: node (build) → nginx (runtime)
│   ├── default.conf     configuração do Nginx (proxy /api → backend)
│   └── src/...
└── backend/             Spring Boot
    ├── Dockerfile       multi-stage: maven (build) → JDK (runtime)
    ├── pom.xml
    └── src/...
```

## Pré-requisitos

Apenas Docker Desktop (ou Docker Engine + Compose v2). Não é preciso ter
Node, Java, Maven nem Postgres na máquina.

## Como rodar

```
git clone https://github.com/digo-smithh/pratica-devops-garimpo-musical.git
cd pratica-devops-garimpo-musical
docker compose up --build
```

Esse comando baixa a imagem do Postgres, constrói as imagens do backend e do
frontend, cria a rede e o volume e sobe os três contêineres na ordem certa.
Quando os logs estabilizarem (o Spring Boot vai imprimir `Started
BackendJavaApplication`), abra `http://localhost:3000`.

Para parar, `docker compose down`. Para parar e apagar o volume com os dados
do banco, `docker compose down -v`.

## Verificando que está funcionando

`docker compose ps` deve mostrar três contêineres no ar: o frontend com
mapeamento `0.0.0.0:3000->80/tcp`, e o backend e o Postgres mostrando apenas
a porta interna, sem mapeamento. Isso é o esperado.

Como confirmação, uma chamada direta ao backend a partir do host falha
(`curl http://localhost:8080` retorna `Connection refused`), mas a mesma
chamada feita através do proxy do frontend funciona normalmente
(`curl http://localhost:3000/api/home/albums` devolve a lista de álbuns em
JSON).

## Decisões de projeto

A versão do Postgres foi fixada em `16-alpine` em vez da tag `latest`, porque
o Postgres 18 introduziu mudanças incompatíveis na estrutura do diretório de
dados.

A dependência `spring-boot-docker-compose` do Spring Boot foi desabilitada
explicitamente (`SPRING_DOCKER_COMPOSE_ENABLED=false`). Esse plugin tenta
subir os serviços do compose automaticamente quando detecta o arquivo, o que
faz sentido em desenvolvimento local mas atrapalha quando o backend já está
rodando dentro de um container.

O `npm install` do frontend foi mantido em vez de `npm ci` porque o
`package-lock.json` original estava dessincronizado de algumas dependências —
como o foco do trabalho é Docker, deixei a instalação mais permissiva no
Dockerfile.

## Autor

Rodrigo Smith
