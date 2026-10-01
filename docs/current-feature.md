# Feature atual: logout e refresh de autenticação

## Objetivo

Implementar, somente no backend, as rotas de renovação de autenticação e encerramento da sessão.

## Decisões

- O refresh token continuará sendo enviado somente em cookie `HttpOnly`.
- O cookie terá o path `/api/v1/auth`, para estar disponível tanto em `/refresh` quanto em `/logout`.
- O sistema manterá uma única sessão ativa por usuário.
- O refresh token não será enviado no body das respostas.
- O logout limpará o cookie e invalidará o hash do refresh token armazenado no banco.
- O access token já emitido não será revogado imediatamente; ele continuará válido até expirar.

## Fluxo de `/refresh`

1. Ler o refresh token do cookie.
2. Rejeitar a requisição se o cookie não existir ou estiver malformado.
3. Validar assinatura, expiração e payload do JWT usando o segredo de refresh.
4. Localizar o usuário e comparar o hash do token recebido com o hash armazenado.
5. Rejeitar com `401` se o token não corresponder ao hash ativo.
6. Gerar um novo access token e um novo refresh token.
7. Substituir o hash antigo pelo hash do novo refresh token.
8. Atualizar o cookie e retornar o novo access token no envelope padrão da API.

## Fluxo de `/logout`

1. Ler o refresh token do cookie, quando existir.
2. Identificar o usuário pelo refresh token válido.
3. Invalidar o hash do refresh token no banco.
4. Limpar o cookie com as mesmas opções relevantes usadas na criação, especialmente nome e path.
5. Retornar sucesso mesmo se não houver uma sessão ativa, mantendo o logout idempotente.

## Pontos de segurança e comportamento

- A atualização do refresh token deve impedir que duas requisições concorrentes validem e reutilizem o mesmo token antigo.
- Tokens ausentes, expirados, com assinatura inválida ou cujo hash não corresponda devem resultar em `401`quando fazer sentido.
- O logout impede novos refreshes, mas não invalida access tokens que já foram emitidos.