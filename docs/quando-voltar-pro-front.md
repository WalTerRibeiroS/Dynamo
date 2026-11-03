# Contexto atual: frontend da aplicação

## Objetivo de aprendizado

O frontend está sendo desenvolvido como um exercício prático para aprender React e Tailwind CSS e entender, pelo uso, em que situações bibliotecas adicionais ajudam. A primeira versão da home, workspace e das telas de login deve ser feita com React, Tailwind e recursos nativos da plataforma, sem adicionar de início as bibliotecas listadas abaixo. Depois, partes do código poderão ser refeitas com essas bibliotecas para comparar a solução manual com a solução que elas oferecem.

Não se trata de evitar essas ferramentas. O objetivo é reconhecer que existem maneiras mais simples ou convenientes de resolver certos problemas, compreender qual trabalho elas reduzem e aprender quando esse benefício se aplica. A implementação inicial deve incluir fluxos e estados realistas o bastante para que essas necessidades possam aparecer, sem criar requisitos artificiais apenas para justificar uma dependência.

## Bibliotecas a avaliar na refatoração

- **class-variance-authority (CVA):** organizar variantes reutilizáveis de componentes quando houver variantes reais, como estilos e estados de um botão.
- **clsx:** compor classes condicionais sem concatenação manual quando isso começar a ocorrer nos componentes.
- **tailwind-merge:** resolver conflitos entre classes Tailwind quando componentes aceitarem classes externas que devam sobrescrever estilos padrão.
- **zustand:** compartilhar estado de interface entre componentes quando ele realmente precisar ser acessado em lugares distintos sem prop drilling inconveniente.
- **@tanstack/react-query:** cuidar de dados remotos quando houver necessidades como cache, atualização, invalidação ou coordenação de requisições; não confundir estado remoto com estado local da interface.
- **react-hook-form:** reduzir trabalho manual de formulários quando valores, validação, erros e submissão justificarem a ferramenta.
- **zod:** validar dados por schema e derivar tipos, avaliando seu uso tanto nos dados recebidos quanto na integração com formulários. A validação no backend continua necessária.
- **@hookform/resolvers:** conectar schemas do Zod à validação do React Hook Form, caso ambas as bibliotecas sejam adotadas.
- **react-router:** tratar rotas quando URLs, navegação pelo histórico, acesso direto às telas ou rotas protegidas fizerem parte do fluxo.
- **axios:** comparar com `fetch` e adotar se configuração compartilhada, interceptors ou tratamento de respostas trouxerem benefício concreto.

## Critério para decidir

Para cada biblioteca, registrar qual dificuldade apareceu na implementação sem ela, como a biblioteca mudou o código e qual configuração ou complexidade adicional trouxe. Não é obrigatório adotar todas: se a home, workspace e o login não apresentarem um caso que justifique alguma delas, essa conclusão faz parte do aprendizado e a avaliação pode ficar para um fluxo futuro.

## Escopo desta etapa

Construir primeiro a home, workspace e as telas de login em React com Tailwind, usando as dependências que já fazem parte da base do frontend. Manter a solução simples, funcional e acessível, e observar as necessidades reais que surgirem antes de decidir quais partes refazer com bibliotecas adicionais.
