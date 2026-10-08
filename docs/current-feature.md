# Feature atual: Gerenciamento de Usuário (/users)

## Objetivo

Implementar, no backend, o módulo de gerenciamento de usuário autenticado (`/users`), incluindo o middleware de autenticação (`authMiddleware` / `requireAuth`) necessário para proteger as rotas e identificar o usuário logado via Access Token.

## Decisões e Escopo

- **Middleware de autenticação:** Todas as rotas de `/users` dependem da validação do Access Token enviado no header `Authorization: Bearer <token>`.
- **Separação de responsabilidades na escrita:**
  - **Perfil / Identidade:** `PATCH /users/me` atualiza informações de perfil (atualmente `username`).
  - **Configurações / Preferências:** `PATCH /users/me/settings` atualiza preferências de aplicação (atualmente `theme`).
  - **Segurança de credenciais:** `PATCH /users/me/password` é isolado, exige a senha atual e encerra a sessão ativa do usuário (invalida o refresh token no banco e limpa cookies).
  - **Exclusão de conta:** `DELETE /users/me` exige confirmação com a senha atual no corpo e desloga o usuário.
- **Leitura unificada:** `GET /users/me` permanece unificado, retornando os dados essenciais de perfil e preferências para evitar múltiplas requisições no carregamento inicial da aplicação.
- **Fora do escopo desta feature:**
  - Alteração de e-mail (requereria fluxo de verificação com SMTP).
  - Atualização de avatar (`avatar_url`).
  - Customização de atalhos (`shortcuts`).

---

## Rotas e Fluxos

### 1. `GET /api/v1/users/me`
**Objetivo:** Obter as informações agregadas do usuário autenticado (perfil + preferências).

1. Middleware valida o Access Token e extrai o `userId`.
2. Busca o usuário no banco pelo `id`.
3. Se não encontrado, retorna `404 Not Found`.
4. Retorna os dados seguros: `id`, `username`, `email`, `theme`, `createdAt`.
   *(Campos sensíveis como `password_hash` e `refresh_token_hash` jamais são expostos)*.

---

### 2. `PATCH /api/v1/users/me`
**Objetivo:** Atualizar informações de perfil/identidade do usuário.

1. Middleware valida o Access Token e extrai o `userId`.
2. Valida o corpo da requisição:
   - `username`: obrigatório (string respeitando tamanho mínimo/máximo e formato).
3. Verifica se o `username` já está em uso por outro usuário (retorna erro de conflito caso exista).
4. Atualiza o `username` no banco e o campo `updated_at`.
5. Retorna os dados atualizados do usuário.

---

### 3. `PATCH /api/v1/users/me/settings`
**Objetivo:** Atualizar configurações e preferências de uso da aplicação.

1. Middleware valida o Access Token e extrai o `userId`.
2. Valida o corpo da requisição:
   - `theme`: obrigatório (enum: `'light' | 'dark' | 'system'`).
3. Atualiza o `theme` no banco e o campo `updated_at`.
4. Retorna as configurações atualizadas (ou os dados do usuário com o novo tema).

---

### 4. `PATCH /api/v1/users/me/password`
**Objetivo:** Alterar a senha da conta.

1. Middleware valida o Access Token e extrai o `userId`.
2. Valida o corpo da requisição:
   - `currentPassword`: obrigatória.
   - `newPassword`: obrigatória (respeitando regras de complexidade).
3. Busca o `password_hash` do usuário no banco.
4. Compara a `currentPassword` com o hash atual. Se não coincidir, rejeita com erro apropriado.
5. Gera o novo hash da `newPassword`.
6. Atualiza `password_hash` no banco e define `refresh_token_hash` como `NULL` (invalidando a sessão persistente).
7. Limpa o cookie de refresh token.
8. Retorna sucesso informando que a senha foi alterada e a sessão encerrada.

---

### 5. `DELETE /api/v1/users/me`
**Objetivo:** Excluir permanentemente a conta do usuário autenticado.

1. Middleware valida o Access Token e extrai o `userId`.
2. Valida o corpo da requisição:
   - `password`: obrigatória para confirmação de segurança.
3. Busca o usuário e valida se a senha informada corresponde ao hash atual. Se incorreta, rejeita a exclusão.
4. Remove o registro do usuário na tabela `users`.
5. Limpa o cookie de refresh token.
6. Retorna resposta de sucesso.