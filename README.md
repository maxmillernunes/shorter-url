# shorter-url

API RESTful para encurtamento de URLs com autenticação, CRUD, contagem de acessos, soft delete e documentação, construída com Node.js e NestJS.

## Descrição

Este projeto implementa um sistema de encurtamento de URLs que permite a criação de links encurtados com código único de 6 caracteres, associando URLs a usuários autenticados, e contabilizando acessos a cada link. Inclui autenticação via JWT, operações CRUD para URLs, soft delete, testes unitários com Jest, ambiente local via Docker e documentação Swagger.

## Tecnologias Usadas

- Node.js (NestJS, última versão LTS)
- PostgreSQL (configurável via Docker)
- JWT para autenticação
- Docker e Docker Compose para ambiente local
- Jest para testes unitários
- Swagger/OpenAPI para documentação da API
- TypeScript

## Funcionalidades

- Cadastro e autenticação de usuários via e-mail/senha com JWT
- Encurtamento de URLs com slug fixo de 6 caracteres (case-sensitive), com e sem autenticação
- Permite criação de alias customizados únicos (3 a 30 caracteres, letras, números, - e _)
- URLs autenticadas associadas ao usuário proprietário
- Usuário pode listar, atualizar e apagar seus próprios links (soft delete)
- Contabilização de acessos para cada URL
- Soft delete via campo `deletedAt`
- Timestamps de criação e atualização

## Instalação e Execução

1. Clone o repositório:

```
git clone https://github.com/maxmillernunes/shorter-url.git
cd shorter-url
```

2. Configure as variáveis de ambiente conforme `.env.example`.
- Não esqueça de gerar o par de chaves publica e privada.
- - Passo 1: Gerar chave privada RSA 256 bits
    ```
    openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
    ```

- - Passo 2: Extrair a chave pública a partir da privada
    ```
    openssl rsa -pubout -in private_key.pem -out public_key.pem
    ```

- - Passo 3: Converter a chave privada para base64 (sem cabeçalhos)
    ```
    openssl base64 -A -in private_key.pem -out private_key_base64.txt
    ```

- - Passo 4: Converter a chave pública para base64 (sem cabeçalhos)
    ```
    openssl base64 -A -in public_key.pem -out public_key_base64.txt
    ```

3. Execute com Docker Compose:

```
docker-compose up --build
```

3. Execute com Docker Compose para desenvolvimento com hot reload:

```
docker-compose -f docker-compose.dev.yml up --build
```

4. A API estará disponível em `http://localhost:3333`.

## Uso da API

- **Login:** POST `/auth/login` com e-mail e senha para receber token Bearer.
- **Encurtar URL:** POST `/shorten` com URL original e opcional alias customizado (autenticado para alias).
- **Listar URLs:** GET `/my-urls` (autenticado).
- **Atualizar URL:** PUT `/my-urls/:id` (autenticado).
- **Excluir URL:** DELETE `/my-urls/:id` (soft delete, autenticado).
- **Redirecionamento:** GET `/:short` para redirecionar e contar acessos.

Consulte a documentação Swagger em `http://localhost:3333/docs`.

## Testes

Execute os testes unitários com:

```
pnpm run test
```

Execute os testes E2E:
- Antes, altera a seguinte env  `POSTGRES_HOST=postgres` para `POSTGRES_HOST=localhost`, pois essa env esta configurada para dentro do container.
- Depois execute:
```
pnpm run test:e2e
```

## Diagrama de Arquitetura

- [Diagrama de Arquitetura (Lucidchart)](https://lucid.app/lucidchart/545ef74c-7a2a-40ae-897e-2c4c1b9561d3/edit?viewport_loc=202%2C570%2C1727%2C915%2C0_0&invitationId=inv_334c27fa-8d89-4f06-8d08-7fe5d0c73fb0)

## Escalabilidade

Para escalabilidade em produção, o sistema pode ser replicado horizontalmente atrás de um balanceador de carga, permitindo múltiplas instâncias do serviço API NestJS. O banco relacional pode ser escalado verticalmente, porém assim poderíamos ter problema caso o banco venha a ficar indisponível. Sendo assim o ideal utilizar réplicas para leitura (Master e Slave). Para o contador de acessos, uma solução pode ser a utilização de sistemas de cache distribuído (ex: Redis) e processamento assíncrono para evitar bloqueios no banco, Mais detalhes no diagrama de arquitetura.

## Licença

MIT License

---

Qualquer dúvida para ajustes ou melhorias, fique à vontade para pedir.