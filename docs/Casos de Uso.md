## 1. Atores

Até o momento existe apenas um ator externo principal:

### Usuário

O usuário pode:

- autenticar-se;
- gerenciar Workspaces;
- organizar domínios;
- gerenciar conteúdos;
- importar anotações;
- gerenciar flashcards;
- realizar revisões;
- pesquisar;
- configurar preferências.

Não existe atualmente:

- administrador;
- colaborador;
- visitante;
- usuário compartilhando Workspace com outro usuário.

---

# 2. Visão geral dos casos de uso

![[visao geral]]

---

# 3. Autenticação e usuário

## UC01 — Fazer login

**Ator:** Usuário

**Objetivo:** acessar sua conta no Dynamo.

### Fluxo principal

```
1. Usuário acessa o Dynamo.
2. Usuário informa suas credenciais.
3. Sistema valida as credenciais.
4. Sistema autentica o usuário.
5. Sistema disponibiliza os Workspaces do usuário.
```

### Resultado

Usuário autenticado e apto a utilizar seus Workspaces.

---

## UC02 — Fazer logout

**Ator:** Usuário

**Objetivo:** encerrar a sessão atual.

### Fluxo

```
1. Usuário abre o menu do avatar.
2. Usuário seleciona "Logout".
3. Sistema encerra a sessão.
4. Usuário deixa de ter acesso à área autenticada.
```

---

## UC03 — Alterar imagem de perfil

**Ator:** Usuário

**Objetivo:** alterar seu avatar.

### Fluxo

```
1. Usuário abre o menu do avatar.
2. Usuário seleciona a opção de alteração.
3. Usuário fornece uma nova imagem.
4. Sistema atualiza o avatar.
```

**Detalhes sobre formato/tamanho da imagem:**  
`[A DEFINIR]`

---

# 4. Workspaces

## UC04 — Criar Workspace

**Ator:** Usuário

**Objetivo:** criar um novo espaço de organização.

### Fluxo

```
1. Usuário seleciona "Adicionar Workspace".
2. Sistema solicita os dados necessários.
3. Usuário informa os dados.
4. Sistema cria o Workspace.
5. Leva o user para o novo workspace.
```

**Dados necessários para criação:**  
Nome do workspace
Tema

---

## UC05 — Alternar de Workspace

**Ator:** Usuário

**Objetivo:** acessar outro Workspace.

### Fluxo

```
1. Usuário seleciona o Workspace q quer.
2. Sistema carrega o Workspace selecionado.
3. Sistema restaura seu estado visual.
```

O estado visual restaurado inclui:

- posição dos domínios;
- zoom;
- estado do Canvas.

---

## UC06 — Persistir estado do Canvas

**Ator:** Sistema

**Objetivo:** preservar a organização espacial do Workspace.

O sistema deve salvar automaticamente:

- posição dos domínios;
- zoom;
- estado da câmera/Canvas.

O usuário **não precisa executar uma ação de salvamento**.

---

## UC07 — Alterar tema do Workspace

**Ator:** Usuário

**Objetivo:** definir uma paleta visual específica para o Workspace.

### Fluxo

```
1. Usuário acessa a configuração do Workspace (botao direito no workspace q quer alterar.
2. Usuário seleciona uma paleta.
3. Sistema aplica a paleta.
4. Sistema persiste a configuração.
```

**Opções de paleta:**  
`[A DEFINIR]`

---
## UC07.5 — Alterar nome do Workspace

**Ator:** Usuário

**Objetivo:** definir novo nome para o Workspace.

### Fluxo

```
1. Usuário acessa a configuração do Workspace (botao direito no workspace q quer alterar.
2. Usuário troca o nome para qual ele quer.
3. Sistema aplica a novo nome.
4. Sistema persiste a configuração.
```

---
## UC07.6 — Deletar Workspace

**Ator:** Usuário

**Objetivo:** Deletar workspace.

### Fluxo

```
1. Usuário acessa a configuração do Workspace (botao direito no workspace q quer alterar.
2. Usuário clica em `deletar workspace ${seuWorkspace}?`.
3. Havera duas opcoes, cancelar e deletar workspace ${seuWorkspace}.
4. Tudo relacionado ao workspace é deletado.
5.Sistema remove todos os domínio.
5. Sistema remove seus conteúdos.
6. Sistema remove suas anotações.
7. Sistema remove seus flashcards.
8. Sistema remove seus relacionamentos.
```

caso cancele nada disso acontece

---
# 5. Canvas

## UC08 — Visualizar Canvas

**Ator:** Usuário

**Objetivo:** visualizar os domínios do Workspace em uma área espacial.

O Canvas apresenta:

```
Workspace
│
├── Domínio
├── Domínio
├── Domínio
└── ...
```

---

## UC09 — Mover Canvas

**Ator:** Usuário

**Objetivo:** navegar pela área espacial.

### Fluxo

```
1. Usuário pressiona e segura o botão esquerdo em uma área vazia.
2. Usuário movimenta o mouse.
3. Canvas acompanha o movimento.
4. Sistema mantém o novo estado da câmera.
```

---

## UC10 — Alterar zoom

**Ator:** Usuário

**Objetivo:** aproximar ou afastar a visualização.

O usuário pode:

- aumentar zoom; clicando no icone ou com o atalho
- diminuir zoom.         //          //                 //

O sistema salva o novo zoom para proximas vezes apos sair do workspace.

**Limite mínimo/máximo de zoom:**  
`[A DEFINIR]`

---

## UC11 — Criar domínio

**Ator:** Usuário

**Objetivo:** adicionar um novo assunto ao Canvas.

### Fluxo

```
1. Usuário seleciona "Adicionar domínio".
2. Sistema solicita os dados do domínio.
3. Usuário informa os dados.
4. Sistema cria o domínio.
5. Domínio aparece no Canvas.
```

**Dados do domínio:**

- nome;
- ícone opcional;
- posição inicial.

**Posição inicial:** `[A DEFINIR]`

A criação de domínio é permitida tanto no modo:

```
Leitura
```

quanto:

```
Edição
```

---

## UC12 — Mover domínio

**Ator:** Usuário

**Objetivo:** alterar a posição espacial do domínio.

### Fluxo

```
1. Usuário seleciona/arrasta um domínio.
2. Usuário posiciona o domínio.
3. Sistema atualiza sua posição.
4. Sistema salva automaticamente.
```

Isso é permitido independentemente do modo leitura/edição.

---

# 6. Gerenciamento de domínio

## UC13 — Abrir domínio

**Ator:** Usuário

**Objetivo:** acessar o conteúdo associado ao domínio.

### Fluxo

```
1. Usuário clica com o botão esquerdo no domínio.
2. Sistema abre a Sidebar.
3. Sidebar apresenta:
   ├── Conteúdo
   ├── Anotações
   └── Revisão
```

---

## UC14 — Editar domínio

**Ator:** Usuário

**Objetivo:** modificar informações do domínio.

Pode alterar:

- nome;
- ícone.

**Modo necessário:** editar dentro da sidebar com o mode "edicao" selecionado

---

## UC15 — Deletar domínio

**Ator:** Usuário

**Objetivo:** remover um domínio.

### Pré-condição

Usuário deve acessar o menu contextual do domínio.

### Fluxo

```
1. Usuário clica com botão direito no domínio.
2. Sistema apresenta menu contextual.
3. Usuário seleciona "Deletar domínio".
4. Sistema apresenta confirmação.
5. Usuário confirma.
6. Sistema remove o domínio.
7. Sistema remove seus conteúdos.
8. Sistema remove suas anotações.
9. Sistema remove seus flashcards.
10. Sistema remove seus relacionamentos.
```

### Cancelamento

Se o usuário cancelar:

```
Nenhum dado é removido.
```

---

# 7. Relacionamentos

## UC16 — Criar relacionamento entre domínios

**Ator:** Usuário

**Objetivo:** representar visualmente uma relação entre dois domínios.

### Fluxo

```
1. Usuário abre o menu contextual de um domínio (botao direito).
2. Seleciona "Criar relacionamento".
3. Usuário seleciona outro domínio.
4. Sistema cria uma linha entre os domínios.
```

O relacionamento é **puramente visual**.

---

## UC17 — Criar relacionamento direcionado

**Ator:** Usuário

**Objetivo:** criar uma relação visual com direção.

### Fluxo

```
Domínio A ─────────► Domínio B
```

A seta não possui significado semântico obrigatório.

---

## UC18 — Remover relacionamento

**Ator:** Usuário

**Objetivo:** remover uma relação visual existente.

**Fluxo:** 
```
1. Usuário abre o menu contextual de um domínio com relacionamento (botao direito).
2. Seleciona "Deletar relacionamento com ${opcoesQTemRelacionamento}".
3. Sistema desfaz a linha entre o domínio selecionado.
```

---

# 8. Sidebar

## UC19 — Alternar modo leitura/edição

**Ator:** Usuário

**Objetivo:** controlar as operações disponíveis dentro das sessões dos domínios.

O estado é global ao Workspace.

```
Workspace
│
├── Domínio A → modo escolhido
├── Domínio B → mesmo modo
└── Domínio C → mesmo modo
```

### Importante

A criação de domínios continua disponível independentemente do modo.

O modo afeta somente:

- Conteúdo;
- Anotações;
- Revisão.

---

## UC19.5 — Minimizar/maximizar Toggle

**Ator:** Usuário

**Objetivo:** visualizar todo o conteudo do dominio com o tamanho maximo, ou ao contrario caso queira minimizar, voltando ao estado default de sidebar

---

## UC19.5 — Fechar sidebar ou a maximizacao

**Ator:** Usuário

**Objetivo:** fechar a sidebar

**Fluxo**
```
1. clica no icone de 'X'
2. sidebar fecha
```

---

# 9. Conteúdo

## UC20 — Adicionar conteúdo

**Ator:** Usuário

**Modo:** Edição

**Objetivo:** adicionar material de estudo a um domínio.

### Dados obrigatórios

```
Nome
Tipo
URL
```

### Dados opcionais

```
Descrição
```

### Tipos

```
Vídeos
Cursos
Documentação
Artigos
Outros
```

### Fluxo

```
1. Usuário abre um domínio.
2. Sidebar está em modo edição.
3. Usuário seleciona "Adicionar conteúdo".
4. Usuário informa nome.
5. Usuário seleciona tipo.
6. Usuário informa URL.
7. Usuário opcionalmente informa descrição.
8. Sistema cria o conteúdo.
```

---

## UC21 — Visualizar conteúdo

**Ator:** Usuário

**Modo:** Leitura

O usuário visualiza:

```
Descrição
Conteúdo
Link
```

A descrição permanece como primeiro elemento da seção.

---

## UC22 — Filtrar conteúdos

**Ator:** Usuário

**Objetivo:** visualizar apenas determinados tipos.

Filtro padrão:

```
Todos
```

Outras opções:

```
Vídeos
Cursos
Documentação
Artigos
Outros
```

---

## UC23 — Editar conteúdo

**Ator:** Usuário

**Modo:** Edição

Pode modificar:

- nome;
- tipo;
- URL;
- descrição;
- ordem de exibição.

**Forma de edição:** `[A DEFINIR]`

---

## UC24 — Deletar conteúdo

**Ator:** Usuário

**Modo:** Edição

### Fluxo

```
1. Usuário seleciona a opção de edição do conteúdo.
2. Usuário seleciona deletar.
3. Sistema remove o conteúdo.
```

**Confirmação antes de deletar:** `[A DEFINIR]`

---

## UC25 — Reordenar conteúdo

**Ator:** Usuário

**Modo:** Edição

O usuário pode modificar a ordem de exibição dos conteúdos.

Regra:

> A descrição permanece sempre no topo, independentemente da ordenação.

**Interface:** `[A DEFINIR]`

---

# 10. Anotações

## UC26 — Importar anotação

**Ator:** Usuário

**Modo:** Edição

**Objetivo:** importar uma anotação existente do Obsidian.

### Fluxo

```
1. Usuário seleciona "Adicionar anotação".
2. Sistema permite selecionar um arquivo .md.
3. Usuário seleciona o arquivo.
4. Sistema extrai o conteúdo exato.
5. Sistema processa o Markdown através de uma biblioteca.
6. Markdown é convertido para HTML.
7. Sistema adiciona a anotação ao domínio.
```

O arquivo original não é sincronizado com o Dynamo.

---

## UC27 — Visualizar anotações

**Ator:** Usuário

As anotações são exibidas em sequência:

```
Nota 1
────────────
Nota 2
────────────
Nota 3
```

Não existe uma interface onde cada nota precise ser aberta individualmente.

O conteúdo aparece como texto corrido.

---

## UC28 — Deletar anotação

**Ator:** Usuário

**Modo:** Edição

```
1. Usuário seleciona a opção de edição.
2. Seleciona deletar anotação isso dentro do submenu de gerenciamento de anotações.
3. Sistema remove a anotação.
```

**Confirmação:** `[A DEFINIR]`

---

## UC29 — Reordenar anotações

**Ator:** Usuário

**Modo:** Edição

### Fluxo

```
1. Usuário abre o submenu de gerenciamento de anotações.
2. Sistema apresenta a lista.
3. Usuário arrasta uma anotação.
4. Usuário solta na nova posição.
5. Sistema atualiza a ordem.
6. Sistema persiste a nova ordem.
```

---

# 11. Revisão

## UC30 — Criar flashcard

**Ator:** Usuário

**Modo:** Edição

### Dados

```
Pergunta
Resposta
```

### Fluxo

```
1. Usuário acessa Revisão.
2. Seleciona "Adicionar flashcard".
3. Informa pergunta.
4. Informa resposta.
5. Sistema cria flashcard.
```

---

## UC31 — Editar flashcard

**Ator:** Usuário

**Modo:** Edição

Pode modificar:

- pergunta;
- resposta.

**Persistência da alteração:** `[A DEFINIR conforme regra de salvamento da operação]`

---

## UC32 — Deletar flashcard

**Ator:** Usuário

**Modo:** Edição

Sistema remove o flashcard do domínio.

**Confirmação:** `[A DEFINIR]`

---

## UC33 — Iniciar revisão

**Ator:** Usuário

**Modo:** Leitura

O usuário acessa a seção Revisão e seleciona os flashcards que deseja revisar.

A seleção poderá utilizar:

- necessidade definida pelo usuário;
- estado de revisão do flashcard.

**Fluxo exato de seleção:** `[A DEFINIR]`

---

## UC34 — Responder flashcard

**Ator:** Usuário

**Modo:** Leitura

### Fluxo

```
1. Sistema apresenta a pergunta.
2. Resposta permanece oculta.
3. Usuário pensa na resposta.
4. Usuário seleciona "Mostrar resposta".
5. Sistema apresenta a resposta.
6. Usuário informa se acertou ou errou.
7. Sistema registra o resultado.
8. Sistema atualiza o estado do flashcard.
```

---

## UC35 — Atualizar estado de revisão

**Ator:** Sistema

Após uma resposta, o sistema atualiza:

```
Última revisão
Número de acertos
Número de erros
Intervalo atual
Próxima revisão
```

Intervalos inicialmente previstos:

```
2 dias
5 dias
7 dias
15 dias
30 dias
```

### Algoritmo

O algoritmo exato:

`[A DEFINIR]`

---

## UC36 — Limitar quantidade de flashcards em uma sessão

**Ator:** Sistema

Existe intenção de estabelecer um limite de aproximadamente:

```
100 flashcards
```

por sessão.

Valor definitivo:

`[A DEFINIR]`

---

# 12. Busca

## UC37 — Pesquisar no Workspace

**Ator:** Usuário

**Objetivo:** localizar informações dentro do Workspace atual.

### Fluxo

```
1. Usuário informa um termo.
2. Sistema pesquisa dentro do Workspace.
3. Sistema apresenta os resultados.
4. Usuário navega pelos resultados.
5. Usuário seleciona um resultado.
6. Sistema leva o usuário até a ocorrência.
```

---

## UC38 — Pesquisar conteúdo de domínio

A busca pode encontrar ocorrências dentro das informações dos domínios.

Exemplo:

```
Linux
```

pode aparecer em:

```
Domínio:
Linux

Conteúdo:
Linux Networking

Anotação:
"... Linux ..."

Flashcard pergunta:
"O que é Linux?"
```

Mas não:

```
Flashcard resposta:
"Linux é um kernel..."
```

### Regra definida

**Pergunta de flashcard → pesquisável**

**Resposta de flashcard → não pesquisável**

---

## UC39 — Navegar entre resultados

A interface deverá permitir navegar pelos resultados, por exemplo:

```
15 resultados

↑
↓
```

Ao navegar:

```
Resultado
   ↓
Domínio correspondente
   ↓
Seção correspondente
   ↓
Ocorrência
```

A ocorrência deverá ser destacada.

### Comportamento exato do highlight:

`[A DEFINIR]`

---

# 13. Configurações

## UC40 — Alterar tema global

**Ator:** Usuário

O usuário pode configurar o tema geral da aplicação.

**Temas disponíveis:** Escuro, Branco e o Padrão do sistemas

---

## UC41 — Configurar atalhos

**Ator:** Usuário

O usuário pode modificar atalhos de teclado.

Exemplos:

```
Trocar Workspace
Maximizar Sidebar
```

### Atalhos disponíveis:

`[A DEFINIR]`

### Conflito entre atalhos:

`[A DEFINIR]`

---

# 14. Persistência das alterações

Existe uma regra geral ainda não fechada:

> Algumas operações serão persistidas automaticamente e outras exigirão confirmação explícita do usuário.

Portanto, **não devemos transformar ainda isso em um requisito técnico de API ou banco**.

As operações deverão ser classificadas individualmente posteriormente.

---

# 15. Casos de uso ainda importantes a definir

Depois de transformar suas ideias em casos de uso, apareceram algumas lacunas que **não precisamos resolver agora**, mas que vale registrar.

### Workspace

- Renomear Workspace — `[A DEFINIR]`
- Deletar Workspace — `[A DEFINIR]`
- Configurar Workspace — `[A DEFINIR]`

### Domínio

- Renomear domínio — **já definido como possível**
- Alterar ícone — **já definido como possível**
- Remover relacionamento — `[A DEFINIR]`

### Conteúdo

- Abrir URL — `[A DEFINIR]` — provavelmente abrir externamente
- Confirmar exclusão — `[A DEFINIR]`
- Reordenar conteúdo — `[A DEFINIR]` interface

### Anotações

- Confirmar exclusão — `[A DEFINIR]`
- O HTML gerado será armazenado no banco ou Markdown + HTML? — `[A DEFINIR]`
- Tratamento de imagens/referências externas do `.md` — `[A DEFINIR]`
- O que acontece quando o `.md` contém recursos que não podem ser importados? — `[A DEFINIR]`

### Flashcards

- Como o usuário escolhe os cards para revisar — `[A DEFINIR]`
- Como funciona uma sessão de revisão — `[A DEFINIR]`
- Algoritmo de repetição espaçada — `[A DEFINIR]`
- O que acontece quando o usuário erra — `[A DEFINIR]`
- O que acontece quando acerta — `[A DEFINIR]`
- Limite de cards — `[A DEFINIR]`

### Busca

- Quais campos de conteúdo são pesquisáveis — `[A DEFINIR]`
- Como pesquisar HTML das notas — `[A DEFINIR]`
- Como navegar exatamente até uma ocorrência — `[A DEFINIR]`
- Como destacar a ocorrência — `[A DEFINIR]`

### Salvamento

- Quais operações salvam automaticamente — `[A DEFINIR]`
- Quais exigem confirmação — `[A DEFINIR]`
- O que acontece se o usuário sair enquanto possui alterações não confirmadas — `[A DEFINIR]`