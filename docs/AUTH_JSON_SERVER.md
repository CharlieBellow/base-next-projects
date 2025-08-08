# Autenticação com JSON Server

Este projeto suporta duas formas de autenticação:

1. **Banco de dados real** (PostgreSQL com Drizzle ORM) - para produção
2. **JSON Server** - para testes e desenvolvimento

## Configuração para Testes com JSON Server

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure as seguintes variáveis no `.env.local`:

```env
# Para usar JSON Server em vez do banco real
USE_JSON_SERVER=true

# Configurações do GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
```

### 2. Configurar GitHub OAuth

1. Acesse: https://github.com/settings/applications/new
2. Crie uma nova aplicação OAuth com:
   - **Application name**: Seu projeto
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copie o `Client ID` e `Client Secret` para o `.env.local`

### 3. Iniciar os Serviços

#### Opção A: Manualmente

Terminal 1 - JSON Server:

```bash
pnpm run db
```

Terminal 2 - Next.js com JSON Server:

```bash
pnpm run dev:json
```

#### Opção B: Script automatizado

```bash
pnpm run test:auth
```

### 4. Testar Autenticação

1. Acesse: http://localhost:3000/login
2. Clique em "Sign in with GitHub"
3. Autorize a aplicação no GitHub
4. Verifique se o usuário foi criado em: http://localhost:3001/users

## Alternando entre Modos

### Desenvolvimento com JSON Server

```bash
pnpm run dev:json
```

### Desenvolvimento com Banco Real

```bash
pnpm run dev:db
```

## Estrutura dos Dados no JSON Server

O arquivo `public/db.json` contém:

```json
{
  "users": [
    {
      "id": "1",
      "name": "Usuario Teste",
      "email": "teste@example.com",
      "emailVerified": null,
      "image": "https://avatars.githubusercontent.com/u/1?v=4"
    }
  ],
  "accounts": [...],
  "sessions": [...],
  "verificationTokens": [...]
}
```

## Endpoints Disponíveis

Com o JSON Server rodando em `http://localhost:3001`:

- `GET /users` - Listar usuários
- `GET /accounts` - Listar contas vinculadas
- `GET /sessions` - Listar sessões ativas
- `POST /users` - Criar novo usuário (usado pelo NextAuth)
- `POST /sessions` - Criar nova sessão (usado pelo NextAuth)

## Troubleshooting

### JSON Server não inicia

```bash
# Verificar se a porta 3001 está livre
lsof -i :3001

# Se estiver ocupada, matar o processo
kill -9 $(lsof -t -i:3001)
```

### Erro de CORS

O JSON Server já está configurado para aceitar requests do localhost:3000.

### Dados não persistem

Os dados são salvos no arquivo `public/db.json`. Certifique-se de que o arquivo tem permissões de
escrita.

### GitHub OAuth não funciona

1. Verifique se as URLs de callback estão corretas no GitHub
2. Confirme se as variáveis `GITHUB_ID` e `GITHUB_SECRET` estão definidas
3. Verifique se `NEXTAUTH_URL` aponta para `http://localhost:3000`
