Aqui já temos bastante coisa definida.

## Workspace

### RN01 — Workspaces pertencem a um usuário

Um Workspace é associado a um único usuário.

```
Usuário
   │
   ├── Workspace A
   ├── Workspace B
   └── Workspace C
```

---

### RN01.5 — Um unico usuário pode possuir no máximo 5 workspaces

O usuário pode ter 5 workspaces no máximo

O sistema deve impedir a criação de um sexto Workspace para o mesmo usuário.

```
Usuário
   │
   ├── Workspace A
   ├── Workspace B
   ├── Workspace C
   ├── Workspace D
   └── Workspace E [máximo]
```

---
### RN01.6 — Exclusão da conta remove seus Workspaces

Ao excluir uma conta, todos os Workspaces pertencentes a ela também são removidos.

---
### RN02 — Workspaces são independentes

Dois Workspaces podem possuir domínios com o mesmo nome sem que sejam o mesmo domínio.

```
Workspace A
└── Linux

Workspace B
└── Linux
```

São entidades independentes.

---

### RN02.5 — Nomes de Workspaces são únicos por usuário

Um usuário não pode possuir dois Workspaces com o mesmo nome. Usuários diferentes podem usar o mesmo nome.

---

### RN03 — O estado visual pertence ao Workspace

O Workspace deve manter:

- posição dos domínios;
- zoom, entre `0.50` e `3` inclusive;
- posição da câmera/Canvas;
- paleta de cores do Workspace.

E isso deve ser persistido automaticamente.

As paletas disponíveis são `red`, `green`, `blue`, `purple`, `yellow`, `white` e `black`. O padrão inicial é `purple`.

---
### RN03.5 — Exclusão de Workspaces é em cascata

Ao excluir um Workspace:

```
Workspace
|
├── Domínios
├── Conteúdos
├── Anotações
└── Relacionamentos
```

todos os elementos dependentes são removidos.

---

# Domínios

### RN04 — Um domínio pertence a um Workspace

```
Workspace
   │
   ├── Domain A
   ├── Domain B
   └── Domain C
```

---

### RN04.5 — Um Workspace só pode conter até 20 domínios

```
Workspace
   │
   ├── Domain 1
   ├── Domain 2
   ├── Domain 3
   ├── Domain 4
   . . .
   └── Domain 20 [máximo]
```

---

### RN05 — Domínios não possuem subdomínios

Não existe relação hierárquica:

```
Domínio
   └── Subdomínio
```

---

### RN06 — Domínios podem possuir o mesmo nome em diferentes Workspaces

O nome pode se repetir dentro de diferentes Workspaces.

Então é completamente possivel existir

```
Workspace A
└── Linux A

Workspace B
└── Linux B
```

---
### RN06.5 — Domínios não podem possuir o mesmo nome em mesmos Workspaces

O nome não pode se repetir dentro de um mesmo Workspace, sem diferenciar
maiúsculas de minúsculas. Ele é limitado a 50 caracteres e não pode ser vazio
ou conter apenas espaços.

Isso é regra

```
Workspace A
├── Linux 
└── Linux - "X" não pode
```

---

### RN07 — Domínio possui posição espacial

A posição do domínio faz parte da organização visual do Workspace.

---

### RN08 — Domínio pode ser movimentado independentemente do modo

O usuário pode mover domínios tanto em:

```
Modo leitura
```

quanto:

```
Modo edição
```

---

### RN09 — Exclusão de domínio é em cascata

Ao excluir um domínio:

```
Domínio
├── Conteúdos
├── Anotações
└── Relacionamentos
```

todos os elementos dependentes são removidos.

---

### RN10 — Exclusão exige confirmação

O domínio não deve ser excluído imediatamente após o primeiro comando.

O usuário precisa confirmar.

---

### RN10.5 — Domínio exige nome e pode ter descrição

O nome é o único dado obrigatório para criar um domínio. Ele pode ter até 50
caracteres e não pode ser vazio ou conter apenas espaços. O usuário pode
informar uma descrição de até 200 caracteres no momento da criação ou deixá-la
vazia.

Domínios não terão ícone na funcionalidade atual. A tabela atual não terá uma
coluna de ícone; ela poderá ser adicionada se a funcionalidade entrar no escopo
futuramente.

---

# Relacionamentos

### RN11 — Relacionamentos são visuais

Uma relação entre domínios não possui significado semântico obrigatório.

```
A ───── B
```

não significa necessariamente:

> A depende de B.

---

### RN12 — Relacionamentos podem possuir direção

Um relacionamento é puramente visual e pode ter um destes tipos:

```
A ───── B
A ─────► B
A ◄────► B
```

Os tipos são `line`, `arrow` e `bidirectional`. Em `arrow`, a direção vai de
`source` para `target`. Em `line` e `bidirectional`, a ordem de `source` e
`target` não altera a renderização.

### RN12.5 — Um par de domínios possui no máximo um relacionamento

Para um mesmo par de domínios, só pode existir um relacionamento, sem
considerar a ordem dos domínios. Isso também vale para relacionamentos `arrow`:
uma seta inversa não é outro relacionamento permitido. Para indicar os dois
sentidos, o relacionamento existente deve ser alterado para `bidirectional`.

Uma tentativa de criar um segundo relacionamento para o par é conflito. O
backend responde com HTTP `409`; a interface pode oferecer alterar o
relacionamento existente para bidirecional.

### RN12.6 — Um domínio não pode se relacionar consigo mesmo

`source` e `target` devem ser domínios diferentes.

---

# Conteúdos

### RN13 — Conteúdo pertence a um domínio

```
Domínio
   │
   ├── Conteúdo
   ├── Conteúdo
   └── Conteúdo
```

---

### RN14 — Conteúdo exige dados obrigatórios

Para criar um conteúdo são necessários:

```
Nome
Tipo
URL
```

Descrição é opcional.

---

### RN15 — Conteúdo possui tipo

Tipos definidos:

```
Vídeos
Cursos
Documentação
Artigos
Outros
```

---

### RN16 — Conteúdo possui ordem

Os conteúdos possuem uma ordem de exibição configurável mas o padrão é a ordem de criação.

---

### RN17 — Descrição possui posição especial

A descrição do domínio deve aparecer primeiro, independentemente da ordenação dos conteúdos.

Essa regra é interessante porque posteriormente teremos que decidir **como exatamente isso será representado**.

---

# Anotações

### RN18 — Anotação pertence a um domínio

```
Domínio
   │
   ├── Nota
   ├── Nota
   └── Nota
```

---

### RN19 — Anotações são importadas do Markdown

O Dynamo não edita o arquivo original do Obsidian.

Fluxo:

```
.md
 ↓
extração
 ↓
Markdown
 ↓
conversão
 ↓
HTML
 ↓
Dynamo
```

---

### RN20 — Não existe sincronização com Obsidian

Depois da importação, o Dynamo não mantém sincronização com o arquivo original.

---

### RN21 — Anotações possuem ordem

As notas possuem uma ordem de exibição.

Essa ordem pode ser modificada pelo usuário.

---

# Busca

### RN28 — Busca é limitada ao Workspace atual

Se o usuário está em:

```
Workspace A
```

a busca não deve retornar informações de:

```
Workspace B
```

---

# Modo leitura/edição

### RN31 — O modo pertence ao Workspace

Não existe:

```
Domínio A → leitura
Domínio B → edição
```

Existe:

```
Workspace → modo edição
```

e todos os domínios seguem esse estado.

O modo é persistido por Workspace. Um Workspace novo começa em modo edição.

---

### RN32 — O modo não controla o Canvas

Mesmo em modo leitura:

- mover domínio continua permitido;
- zoom continua permitido;
- navegação do Canvas continua permitida.

---

### RN33 — O modo controla as sessões internas do domínio

Ele afeta:

```
Conteúdo
Anotações
```

---

### RN34 — Criação de domínio independe do modo

Mesmo em modo leitura:

```
Adicionar domínio
```

continua disponível.

---

# Persistência

### RN35 — Nem toda alteração necessariamente possui o mesmo comportamento de salvamento

Algumas operações serão:

```
salvas automaticamente
```

e outras poderão exigir:

```
confirmação do usuário
```

Essa decisão será feita por operação.
