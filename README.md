# Garimpo Musical com Docker

Aplicação web em três camadas (frontend, backend e banco) containerizada com
Docker, entregue como trabalho da disciplina de DevOps.

## Sobre

O Garimpo Musical é uma plataforma para descobrir artistas independentes:
mostra os lançamentos atuais, sugere artistas a partir da localização do
usuário e tem perfil próprio para cada artista, com músicas e link para o
Spotify. O acesso é protegido por uma tela de login, com cadastro próprio e
escolha de avatar.

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

## Configuração (variáveis de ambiente)

As credenciais do banco e a porta exposta do frontend são lidas de um
arquivo `.env` na raiz do projeto. O repositório traz um `.env.example` com
os valores padrão; basta copiá-lo:

```
cp .env.example .env
```

O `.env` está no `.gitignore` e não é versionado — só o `.env.example`,
que serve de referência.

## Como rodar

```
git clone https://github.com/digo-smithh/pratica-devops-garimpo-musical.git
cd pratica-devops-garimpo-musical
cp .env.example .env
docker compose up --build
```

Esse comando baixa a imagem do Postgres, constrói as imagens do backend e do
frontend, cria a rede e o volume e sobe os três contêineres na ordem certa.
Quando os logs estabilizarem (o Spring Boot vai imprimir `Started
BackendJavaApplication`), abra `http://localhost:3000`.

Para parar, `docker compose down`. Para parar e apagar o volume com os dados
do banco, `docker compose down -v`.

## Acesso ao banco

O Postgres não é exposto no host (só vive na rede `garimpo-net`), então
não dá para conectar com `localhost:5432`. Para inspecionar o banco, use
`docker exec` direto no contêiner:

```
docker exec -it garimpo-postgres psql -U postgres -d garimpo-db
```

Credenciais padrão (definidas no `.env`):

- host (interno do compose): `postgres`
- porta: `5432`
- database: `garimpo-db`
- usuário: `postgres`
- senha: `password`

## Login da aplicação

Ao abrir `http://localhost:3000` o site cai numa tela de login. Há duas
opções para entrar:

**Usar a conta de demonstração** (criada automaticamente pelo seed):

- email: `demo@garimpo.test`
- senha: `demo123`

**Criar uma conta nova** pelo botão "Criar conta", informando nome, email,
senha (com indicador de força) e escolhendo um dos seis avatares disponíveis.

A autenticação é baseada em sessão guardada no banco: o `POST /api/auth/login`
gera um token UUID, persistido na tabela `session` com expiração de 7 dias,
e retornado para o frontend, que o armazena em `localStorage`. Cada chamada
subsequente envia `Authorization: Bearer <token>`. Ao clicar em "Sair", o
backend apaga a linha da `session`.

As senhas são guardadas com **BCrypt** na coluna `password_hash` da tabela
`app_user`.

## Endpoints da API

Todas as chamadas passam pelo Nginx do frontend (`/api/...`). Não há acesso
direto ao backend a partir do host.

Públicos (sem token):

- `GET /api/home/albums` — lista os álbuns em destaque.
- `GET /api/home/artists?city=&state=` — lista artistas, com filtro opcional por cidade e estado.
- `GET /api/home/artists/{id}` — detalhes de um artista, com as músicas.

Autenticação (escrevem no banco):

- `POST /api/auth/register` — cria um `app_user` e já abre uma `session`.
- `POST /api/auth/login` — verifica a senha (BCrypt) e abre uma nova `session`.
- `POST /api/auth/logout` — apaga a `session` correspondente ao token enviado.
- `GET /api/auth/me` — retorna o usuário do token (sem gravar nada).

Os endpoints autenticados esperam o header `Authorization: Bearer <token>`,
onde `<token>` é o UUID retornado por `/login` ou `/register`.

## Persistência no banco

A aplicação não é só leitura — três operações escrevem no Postgres em tempo
real, em duas tabelas criadas pelo Hibernate no startup:

- `app_user` — uma linha por usuário cadastrado (nome, email, hash BCrypt da
  senha, avatar e data de criação).
- `session` — uma linha por login ativo (token UUID, FK para o usuário,
  data de criação e expiração).

O mapeamento de cada endpoint para o efeito no banco:

- `POST /auth/register` faz `INSERT` em `app_user` e `INSERT` em `session`.
- `POST /auth/login` faz `INSERT` em `session`.
- `POST /auth/logout` faz `DELETE` em `session`.

Os dados sobrevivem entre execuções porque o `compose.yml` declara um volume
nomeado para o diretório de dados do Postgres:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

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
