
## refreshSession (service do /refresh)

A query atual do repositório só atualiza a linha se o usuário existir e o hash ainda for o antigo:

```
WHERE id = $2 AND refresh_token_hash = $3
```

Se o usuário não existir, o hash tiver sido apagado no logout, ou o token for antigo, nenhuma linha será atualizada. O `rowCount === 1` transforma esse resultado em `true` ou `false`. Assim, o service pode confiar no resultado da rotação para aceitar ou rejeitar o refresh.

Isso também protege a concorrência: duas requisições podem ler o hash antigo, mas, no PostgreSQL, a segunda atualização aguarda a primeira e reavalia o `WHERE`. Depois que a primeira troca o hash, a segunda não encontra mais a condição e falha.

A diferença prática é que, sem o `SELECT` do `getRefreshTokenById` para pegar o refreshTokenHash antigo do DB, o service gera os novos tokens antes de descobrir se a sessão ainda é válida. Se a rotação falhar, eles são descartados: não foram persistidos nem enviados ao cliente. O custo é algum processamento extra; o benefício é remover uma consulta e deixar a atualização condicional como única validação do estado da sessão.