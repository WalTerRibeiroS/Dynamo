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

### RN03 — O estado visual pertence ao Workspace

O Workspace deve manter:

- posição dos domínios;
- zoom;
- estado da câmera/Canvas.

E isso deve ser persistido automaticamente.

---
### RN03.5 — Exclusão de Workspaces é em cascata

Ao excluir um Workspace:

```
Workspace
|
├── Domínios
├── Conteúdos
├── Anotações
├── Flashcards
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

O nome não pode se repetir dentro de um mesmo Workspace.

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
├── Flashcards
└── Relacionamentos
```

todos os elementos dependentes são removidos.

---

### RN10 — Exclusão exige confirmação

O domínio não deve ser excluído imediatamente após o primeiro comando.

O usuário precisa confirmar.

---

### RN10.5 — A criação de um novo domínio exige os dados

```
Domínio
├── Nome
├── Icone representando o dominio (escolhido pelo user)
└── Descrição sobre o que o domínio aborda
```

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

Pode existir:

```
A ─────► B
```

ou:

```
A ───── B
```

A direção é uma característica visual da relação.

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

# Flashcards

### RN22 — Flashcard pertence a um domínio

```
Domínio
   │
   ├── Flashcard
   ├── Flashcard
   └── Flashcard
```

---

### RN23 — Flashcard possui pergunta e resposta

```
Flashcard
├── pergunta
└── resposta
```

---

### RN24 — Resposta permanece oculta inicialmente

Durante a revisão:

```
Pergunta
   ↓
Mostrar resposta
   ↓
Resposta
```

---

### RN25 — Usuário avalia a própria resposta

Depois de visualizar a resposta, o usuário informa:

```
Acertei
```

ou

```
Errei
```

---

### RN26 — O resultado altera o estado do flashcard

O sistema mantém:

```
última revisão
acertos
erros
intervalo atual
próxima revisão
```

---

### RN27 — Flashcards utilizam repetição espaçada

O Dynamo terá um algoritmo próprio.

Intervalos atualmente considerados:

```
2 → 5 → 7 → 15 → 30 dias
```

O algoritmo exato ainda não está definido.

---

### RN27.5 — O Limite de Flash cards por Domínio é de 100

```
Revisão
   │
   ├── Flashcard 1
   ├── Flashcard 2
   ├── Flashcard 3
   ├── Flashcard 4
   . . .
   └── Flashcard 100 [máximo]
```

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

### RN29 — Perguntas de flashcards são pesquisáveis

Se:

```
Pergunta:
"O que é Linux?"
```

então:

```
buscar "Linux"
```

pode encontrar esse flashcard.

---

### RN30 — Respostas de flashcards não são pesquisáveis

Se:

```
Resposta:
"Linux é um kernel..."
```

a palavra `Linux` nessa resposta **não deve gerar resultado**.

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
Revisão
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