# Anka Tech - API de Gestão (Backend)

Este repositório contém o backend da aplicação de gestão de clientes e ativos, desenvolvido para o case da Anka Tech.

A API foi construída com **Node.js**, **Fastify**, **Prisma** e **TypeScript**, e é totalmente containerizada com **Docker**.

## Funcionalidades

* **CRUD completo** para Clientes (`/api/v1/clients`).
* Endpoint para listagem de **Ativos Financeiros** (`/api/v1/assets`).
* Validação de dados com **Zod**.
* Configuração de **CORS** para permitir acesso do frontend.

## Como Rodar o Projeto Completo (Backend + Frontend)

Este serviço é orquestrado pelo `docker-compose.yml` localizado na raiz do projeto, que gerencia tanto o backend quanto o banco de dados.

### Pré-requisitos
* Docker e Docker Compose instalados.
* Repositório do frontend clonado em uma pasta separada.

### Passos para Execução

1.  **Configurar Variáveis de Ambiente:**
    * Na raiz deste projeto backend, crie um arquivo chamado `.env`.
    * Copie e cole o seguinte conteúdo nele:
        ```env
        # Backend Environment
        NODE_ENV=development
        PORT=3333

        # Database Credentials
        DB_ROOT_PASSWORD=root
        DB_NAME=ankadb
        DB_USER=ankadev
        DB_PASSWORD=dev
        DATABASE_URL="mysql://ankadev:dev@db:3306/ankadb"
        ```

2.  **Iniciar os Serviços com Docker Compose:**
    * Ainda na raiz do projeto backend, execute:
        ```bash
        sudo docker-compose up --build -d
        ```
    * Aguarde cerca de 1 minuto na primeira execução para que o banco de dados seja inicializado.

3.  **Configuração Inicial do Banco de Dados (Apenas na Primeira Execução):**
    * Após os containers estarem rodando, execute os seguintes comandos para configurar o banco de dados:
        ```bash
        # 1. Conceder permissão para o Prisma
        sudo docker-compose exec db mysql -u root -p # (senha: root)
        
        # Dentro do prompt do MySQL, execute:
        GRANT CREATE DATABASE ON *.* TO 'ankadev'@'%';
        FLUSH PRIVILEGES;
        exit;

        # 2. Rodar a migração do Prisma para criar as tabelas
        sudo docker-compose exec backend npx prisma migrate dev
        ```

4.  **Iniciar o Frontend:**
    * Em outro terminal, navegue até a pasta do projeto frontend e execute `npm run dev`.

5.  **Acessar a Aplicação:**
    * O frontend estará disponível em `http://localhost:3000`.
    * A API do backend estará escutando em `http://localhost:3333`.
