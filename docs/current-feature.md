# Feature atual: operações de Workspaces

## Objetivo

Disponibilizar operações para criar, listar, carregar, atualizar e excluir Workspaces do usuário autenticado. Cada Workspace mantém seus metadados e o estado da visualização do Canvas.

## `POST /workspaces`

1. Receber `name` e, opcionalmente, `colorPalette`.
2. Aparar espaços no início e no fim do nome. O nome é obrigatório, não pode ficar vazio e tem limite de 50 caracteres; a regra exata de contagem após aparar ainda está pendente.
3. Aceitar apenas as paletas `red`, `green`, `blue`, `purple`, `yellow`, `white` e `black`. Usar `purple` quando a paleta for omitida.
4. Gerar o `workspaceId` no backend e associar o Workspace ao usuário autenticado, sem aceitar `workspaceId` ou `userId` do cliente.
5. Impedir nomes repetidos para o mesmo usuário, ignorando maiúsculas e minúsculas. A regra atual documentada no banco ainda precisa ser ajustada para refletir essa comparação e o aparo de espaços.
6. Impedir que o usuário ultrapasse o limite de cinco Workspaces.
7. Iniciar a visualização com `zoom: 1`, `cameraX: 0` e `cameraY: 0`, e o Workspace em modo de edição (`isEditMode: true`).

## `GET /workspaces`

1. Listar somente os dados necessários ao seletor: `workspaceId`, `userId`, `workspaceName` e `colorPalette`.
2. Retornar o nome em camelCase.

## `GET /workspaces/:workspaceId`

1. Carregar o Workspace solicitado pelo usuário autenticado.
2. Retornar `zoom`, `cameraX`, `cameraY` e `isEditMode`.
3. Não incluir Domains nesta etapa. O campo `domains` será adicionado quando a parte de Domains estiver disponível.

## `PATCH /workspaces/:workspaceId`

1. Aceitar alterações de `workspaceName`, `colorPalette` ou ambos.
2. Aplicar ao nome as mesmas regras de aparo, obrigatoriedade, limite, unicidade e comparação sem diferenciar maiúsculas e minúsculas da criação.
3. Aceitar somente as paletas definidas na criação.
4. Rejeitar requisição sem campo atualizável, inclusive quando os valores enviados forem `null`.
5. Tornar conflitos de nome identificáveis pelo cliente. Os códigos e mensagens exatos ainda serão definidos na implementação.

## `PATCH /workspaces/:id/viewport`

1. Aceitar qualquer subconjunto de `zoom`, `cameraX` e `cameraY`; campos omitidos permanecem inalterados.
2. Aceitar corpo vazio e valores `null` como operação sem alteração.
3. Restringir `zoom` ao intervalo de `0.50` a `3`, inclusive.
4. Usar como limite experimental para `cameraX` e `cameraY` o intervalo de `-1_000_000` a `1_000_000`, inclusive. O frontend também precisa respeitar esse limite.
5. Tratar `cameraX` e `cameraY` como deslocamento da câmera; essa rota não move nem altera a posição dos Domains.
6. Ao centralizar o Canvas, definir `cameraX` e `cameraY` como `0` e preservar o zoom atual.

## `PATCH /workspaces/:workspaceId/mode`

1. Receber `{ isEditMode: boolean }` e persistir o valor solicitado, sem alternar implicitamente o estado atual.
2. Iniciar novos Workspaces com `isEditMode: true`.

## `DELETE /workspaces/:workspaceId`

1. Excluir o Workspace e seus Domains e dados dependentes, conforme as regras de cascata do banco.

## Dados de entrada

```text
POST /workspaces
{ workspaceName: string, colorPalette?: WorkspaceColorPalette }

PATCH /workspaces/:id
{ workspaceName?: string, colorPalette?: WorkspaceColorPalette }

PATCH /workspaces/:id/viewport
{ zoom?: number, cameraX?: number, cameraY?: number }

PATCH /workspaces/:id/mode
{ isEditMode: boolean }
```