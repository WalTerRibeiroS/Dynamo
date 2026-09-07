# O que é o Dynamo?

O Dynamo é um forma de centralizar e organizar o processo de estudo em uma estrutura visual baseada em canvas e mapas visuais, conectando conteúdos, materiais, anotações, planejamento e revisão tudo em um lugar só, resolvendo o problema de desconexão entre diferentes elementos do estudo

Imagine que você precisa estudar linux, você tem documentação, videos, cursos, anotações tudo fragmentado em lugares diferentes.

O Dynamo tenta criar uma camada de organização sobre tudo isso, descomplicando e organizando tudo em um lugar sem tornar você dependente do Dynamo as suas anotações continuam existindo na sua máquina, os videos, cursos e documentação ainda estão disponíveis na internet.

---

| Questão                                                   | Estado                                        |
| --------------------------------------------------------- | --------------------------------------------- |
| Domínios podem se conectar?                               | sim                                           |
| Domínios podem possuir subdomínios?                       | não                                           |
| Como progresso é calculado?                               | não vai ter por enquanto                      |
| Markdown será importado ou sincronizado?                  | importado                                     |
| Usuários individuais ou multiusuário?                     | individuais                                   |
| Haverá colaboração?                                       | não                                           |
| Flashcards terão algoritmo próprio de repetição espaçada? | sim                                           |
| Busca global?                                             | busca apenas no workspace                     |
| WebSocket?                                                | Não                                           |
| Upload de arquivos?                                       | apenas extracao dos conteudos de arquivos .md |
| Tags?                                                     | não                                           |
| Favoritos?                                                | não                                           |
| Histórico/versionamento das anotações?                    | não                                           |
sobre o planejamento é mais sobre a organização dos dominios e conteudos q são colocados dentro do dominio q servem como "planejamento"
## Feautures e funcionalidades

### Workspaces

Workspaces são a grande entidade que engloba os dominios, possibilitando visualizar dominios, sendo possivel ter mais de um workspace com diferentes (ou mesmos) dominios
#### Funcionalidades

É nos workspaces onde é 
criado os dominios, 
onde é feito a movimentação (espacial 2D),
onde é feito o zoom in zoom out, 
pesquisa nos dominios (relacionado ao workspace atual)
escolher o tema de cor (paleta de cor) do workspace em especifico

segurar o esquerdo na area vazia movimenta o canva/tela

### Dominios

São eles que contem em um mesmo lugar o conteudo que pode ser links de videos, cursos, documentacoes, anotações que devem ser exportadas do obsidian, revisão criando flashcards próprios

Dominios podem ser posicionados em qualquer lugar do canva adicionado um significado visual significativo para o(s) dominio(s)

#### Funcionalidades

É nos dominios onde é 
clicando com o botao esquerdo que abre um menu sidebar, q é onde o dominio realmente funciona
clicando com o direito abre um menuzinho onde tem as seguintes opcoes:
deletar dominio, criar relacionamento (linha entre um e outro dominio), 
e linha de prioridade/direcao (uma flecha de um dominio pra outro)

com o menu sidebar (no mode edicao)
pode ser adicionado conteudo, anotacoes podendo tbm na hora que clica em "adicionar dominio" ou clicando em um dominio ja existente em um campo "adicionar"

criar flash cards personalizados na sessao revisao

### Fora do workspace (partes em volta)

#### Avartar do usuario (login)
ao clicar o usuario pode logar ou deslogar, mudar a imagem de perfil

#### Engrenagem 
vai ter configuracoes de tema (algo q quero levar em consideracao para usar funcionalidades do tailwind)
configuracoes de atalhos de tecla (de trocar workspaces, maximizar side bar do dominio)

## Resposta

### B) Dois domínios independentes que possuem o mesmo nome?

```
Workspace A
└── Linux A

Workspace B
└── Linux B
```

### Ao sair e voltar para um workspace, o usuário deve retornar exatamente à posição/zoom anterior?
Sim zoom deve se manter igual estava quando saiu do workspace, posicao dos dominios tbm devem se manter na mesma posicao que estavam
### Relacionamentos entre domínios
é apenas visual, tanto o com seta ou só linha
### Exclusao de dominios
ao excluir um dominio é feito um efeito em cascada tudo q estava "dentro" do dominio é deletado (conteudo, notas, revisao (flashcards) e relacionamento entre dominios)

para excluir e necessario clicar com o botao direito sobre o dominio e ir na opcao "deletar dominio"
### Estrutura/como funciona da Sessão "Conteudo"
```
Conteudo
├── nome (obrigatório)
├── icone (opcional)
├── descrição (opcional)
├── URL do video, curso, documentacao, artigo (opcional, porem o usuario deve informar o tipo na hora de adicionar)
```

Onde a ordem da possicão pode mudar porem é sempre descriacao no topo

Tbm vai ser uma opcao na parte de conteudo onde é possivel selecionar apenas para aparecer, só documentacao, videos, cursos. . .

### Estrutura/como funciona da Sessão "Anotações"

vai ter uma opcao que é extrai o markdown de um arquivo para html ou markdown n me decidi ainda para ser visivel na sessao

### Estrutura/como funciona da Sessão "Revisão"
opcao criar flash card, onde coloca a pergunta e a resposta da pergunta e apartir disso tem um flash card disponivel para treinar

Ao clicar no flash card criado so mostra a pergunta e mostra a resposta apos clicar em "mostrar resposta" pra checar se esta correto com o q o usuario achou q era e ele pode selecionar se ele acertou ou errou
### Esclarecendo Modo edicao/leitura na sidebar do dominio
Mode de leitura/edicao é possivel ser feito toggle entre eles apenas na sidebar do dominio e valera para todos os dominios daquele workspace, porem a criacao de dominios sempre sera possivel independente do modo, ou seja so vale pras sessoes dentro dos dominios

Só sera possivel criar, deletar ou editar descricao do conteudo; links, documentacao no modo edicao, no modo leitura n sera possivel
mesma coisa pra exportacao de notas ou criacao de flash cards

quando esta no modo edicao é visivel certas "sugestoes"

`Conteudo| modo edicao`
```
...descricao [icone de editavel]← so mostra no modo edicao

...link [icone de editavel]← so mostra no modo edicao

+ adicionar conteudo ← so mostra no modo edicao
```

Ao clicar no icone de editavel é possivel deletar ou mudar a ordem de display dos conteudo (movendo pra cima ou pra baixo, ainda n sei como exatamente fazer isso)

Enquanto no modo leitura so aparece

`Conteudo | modo leitura`
```
...descricao

...link do video
```


Anotacoes apareceram em forma de texto corrido em markdown
`Anotações | modo edicao`
```
... anotacao em markdown/html (logo abaixo dela)
[adicionar nova nota][deletar nota] ← só em modo de edicao
```

Eu ainda to pensando em como eu posso fazer com q fique coerrente uma opcao "alterar ordem das notas" as vezes ter um menu com só o titulo das notas e ser possivel mudar a ordem delas assim

`Anotações submenu, so aparece a opcao de abrir esse menu no modo de edicao`
```
- Nota 1 [flecha cima baixo]
- Nota 2 [flecha cima baixo]
- Nota 3 [flecha cima baixo]
- Nota 4 [flecha cima baixo]
```

com os flash cards seria so possivel adicionar, deletar e editar no modo edicao, no de leitura seria so possivel "responder" os flash cards

`Revisão | modo edicao`
```
flashcard 1 | [icone de edicao, q contem deletar editar]
flashcard 2 | [icone de edicao, q contem deletar editar]
flashcard 3 | [icone de edicao, q contem deletar editar]

[adicionar novo flashcard]
```

`Revisão | modo leitura`
```
flashcard 1
flashcard 2
flashcard 3
```

Ainda n sei como fazer o algoritmo dos flashcards de revisao espaçada

Talvez no momento q edita algo no modo edicao aparece uma opcao de salvar alteracoes? pq dai eu n precisaria mandar uma req a cada alteracao, adicao, delatacao

Dai ai entraria talvez o redu undo?

Estados do flashcard

última revisão
número de acertos
número de erros
intervalo atual (2 -5 - 7 - 15 - 30 dias)
próxima revisão

### Sobre a Busca
N sei exatamente como ela deve se comportar mas provavelmente sim ela deve funcionar tanto no workspace quanto nas sessoes do dominio

```
[Busca: linux]
resultado: aparece 15 vezes [seta pra cima e baixo] tipo de navegar q leva direto pra onde a palavra aparece
```

aparece em highlight o nome do domino linux mas tbm a palavra linux sla no "conteudo" ou na "Nota" pq a palavra linux existe nessas sessoes tbm, porem n sei como fazer isso acontecer, pq o conteudo de dentro do dominio teria q ja estar renderizado na pagina pra isso funcionar(?)

### Themes
```
Configuração global
└── light / dark / system

Workspace
└── accent/color palette
```

Assim:

```
Dynamo
├── tema global: dark
│
├── Workspace A: azul
├── Workspace B: verde
└── Workspace C: roxo
```

gostei da sugestao

### Atalhos
Atalhos padroes, porem podem ser alterados pelo usuario

- atalhos padrão;
- possibilidade de alterar;
- detectar conflito entre atalhos;
- impedir combinações inválidas;
- restaurar padrão.

### Login
Logar, cadastrar, logout, adicionar imagem de avatar


Resolvi descartar undo e redo, pq ele estava dando overlap em muitas da funcionalidades de outras features

## Resolvendo decisoes ainda pendentes

### Como serao as Anotacoes
o user vai selecionar o arquivo .md vai ser extrai o exato conteudo da nota, esse conteudo vai passar por uma biblioteca para adaptar para HTML, ou seja vai ficar igual a como estava no .md mas agora em html, como é a aparencia do display das notas, elas n serao ao clicavel pra abrir e ver, mas sim estarao em formato de texto corrido normal, quando uma nota acaba outra comeca

```
Nota 1 - Donec id tortor quam. Curabitur lorem metus, dictum nec felis nec, malesuada laoreet sem. Maecenas augue mi, tempor nec mi eget, commodo pretium lectus. Sed semper feugiat purus, non pellentesque augue mollis lacinia. Nunc elit sem, efficitur ac dapibus ac, euismod eget diam.

[acabou, da um "---"]
[outra nota continua adaptada de markdown pra HTML]

Nota 2 - at gravida molestie, quam lacus accumsan orci, in sagittis mi leo quis nisl. Pellentesque sit amet porttitor velit. In maximus dui at sollicitudin feugiat.
```

### Busca
Entidades n pesquisaveis (pq é mais facil do q listar todas q sao)
- O elemento da busca q esta presente na resposta do flashcard, mas a pergunta ainda é pesquisavel
ou seja se eu pesquisar "linux" na busca n deve aparecer na contagem ou levar para 'linux' q esta na resposta do flashcard

### Canvas
Mover domínios é permitido no modo leitura? Sim

Estado da câmera é salvo automaticamente? Eu n entendi a pergunta, o zoom in? mas sim deve ser salvo automaticamente, o user em momento nenhum deve apertar algo para salvar o zoom in ou estado do canva q ele esta

Como Undo/Redo funcionará? N tera mais

Quais ações serão reversíveis? Nenhuma, só por meio de re editar o q foi alterado

### Domínios

Confirmação antes de exclusão, sim
Undo pode recuperar domínio excluído? N tera mais undo redo
Edição do nome/ícone do domínio, sera possivel

### Conteúdo

Lista definitiva de tipos, a principio:

- Videos
- Cursos
- Documentação
- Artigos
- Outros

Conteúdo sem URL é permitido? apenas descricao, o resto sera preciso enserir URL para ser criado, ou seja informar o tipo e o link/URL do conteudo relacionado e um nome q referencie a esse conteudo

Interface de ordenação, o padrao sera "Todos", com sempre a descriacao como primeiro independente da ordenacao

### Anotacoes
Interface de ordenacao vai ser por meio de um submenu drag and drop

### Revisão
Estado interno do flashcard
- última revisão
- número de acertos
- número de erros
- intervalo atual (2 -5 - 7 - 15 - 30 dias)
- próxima revisão

Como funciona uma sessão de revisão
a sessao de revisao é o nome q eu me refiro a sessao no dominio q "armazena" os flashcards relacionados ao dominio

Quantos flashcards aparecem por sessão, limite ainda n definido mas talvez uns 100 como limite deve estar bom

Como escolher os cards que devem ser revisados, o proprio user define isso baseado na necessidade ou as infromacoes de estado do card como ultima revisao e os outros

### Edição

Alterações são salvas imediatamente?
Existe botão "Salvar alterações"?
Em quais operações?

resposta pra todas, depende, algumas por conveniencia sao melhores q sejam automaticas e outras o user é obrigado a confirmar