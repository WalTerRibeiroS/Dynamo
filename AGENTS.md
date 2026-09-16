# Agents

## Objetivo do projeto 

O Dynamo é um projeto pessoal e casual desenvolvido principalmente com objetivo de aprendizado prático.

O objetivo principal não é criar um produto comercial, uma arquitetura altamente escalável ou uma aplicação preparada para uma equipe grande. O objetivo é aprender, na prática, como desenvolver uma aplicação full-stack utilizando:

## Tecnologias usadas

### Linguagem
TypeScript (front e back)

### Backend
Node e express

### Frontend
React, react-compiler e Tailwindcss

### Banco de dados
PostgreSQL

Consulte arquivos dentro de `docs/db` quando necessário para entender o funcionamento das tabelas dentro do projeto

### Testes automatizados
vitest, RTL (react testing library), Playwright

### Deploy
Backend e DB postgres com railway
Frontend vercel

### Princípio da arquitetura
Priorizar uma organização clara entre responsabilidades, sem criar uma arquitetura excessivamente fragmentada.

Separar responsabilidades quando isso melhorar a compreensão e manutenção do código, mas evitar criar arquivos, classes ou camadas apenas para seguir uma estrutura pré-definida.

O agente deve levar esse objetivo em consideração em todas as sugestões, implementações e revisões de código.

## Princípio mais importante: simplicidade

Este projeto não deve receber complexidade arquitetural sem necessidade.

### Sobre este princípio

Este projeto valoriza conhecer arquiteturas e padrões de design mais 
complexos — Clean Architecture, DDD, CQRS, etc. Saber que eles existem, 
entender seus trade-offs e reconhecer quando um problema pede esse tipo 
de solução é parte importante do aprendizado.

O que este princípio pede não é ignorância desses padrões, e sim 
disciplina na hora de aplicá-los: eles resolvem problemas específicos, 
em contextos específicos, e nem todo projeto — principalmente este — 
tem esses problemas agora. Aplicar um padrão porque ele é "a forma 
certa de fazer" ou porque aparece em todo tutorial não é o mesmo que 
aplicá-lo porque o projeto genuinamente precisa dele.

Ou seja: o agente não deve tratar esses padrões como algo a ser evitado 
por serem ruins, mas como ferramentas que só valem a pena quando o 
problema que elas resolvem já existe de fato no projeto.

Não introduzir automaticamente:

- Clean Architecture;
- Hexagonal Architecture;
- DDD;
- CQRS;
- Event Sourcing;
- sistemas de eventos;
- microsserviços;
- múltiplas camadas de abstração;
- design patterns apenas para "seguir padrões";
- repositories/services/factories abstratos sem necessidade;
- containers de dependência;
- sistemas genéricos excessivamente reutilizáveis;
- abstrações criadas antecipadamente para possíveis necessidades futuras.

Essas abordagens não são proibidas.

Elas podem ser utilizadas quando existir um problema concreto no projeto que seja resolvido de forma significativa por elas.

Antes de introduzir uma abstração ou padrão mais complexo, o agente deve considerar:

1. Qual problema concreto isso resolve?
2. Esse problema realmente existe no projeto atualmente?
3. Existe uma solução mais simples?
4. A complexidade adicionada é justificável pelo benefício?
5. Isso ajuda no aprendizado ou apenas adiciona estrutura?

Se a resposta indicar que a complexidade não é necessária, preferir a solução simples.

### Regra prática

Não projetar para um problema que o projeto ainda não possui.

## Não confundir simplicidade com má prática

O objetivo de manter o projeto simples não significa ignorar boas práticas.

O agente deve continuar apontando problemas importantes relacionados a:

- segurança;
- validação de dados;
- tratamento de erros;
- separação adequada de responsabilidades;
- tipagem;
- duplicação relevante;
- código difícil de entender;
- acoplamento desnecessário;
- testes;
- acessibilidade quando relevante;
- problemas de performance realmente relevantes;
- comportamento incorreto;
- princípios importantes das tecnologias utilizadas.

A diferença é que o agente deve evitar transformar uma boa prática simples em uma arquitetura excessivamente complexa.

Exemplo:

Validar os dados recebidos por uma API é importante.

Isso não significa que seja necessário criar um sistema complexo de validação e abstrações para cada endpoint.

## Consenso vs. opinião arquitetural

O agente deve diferenciar claramente:

### Prática amplamente utilizada

Quando algo for uma convenção ou prática comum da tecnologia, informar isso como tal.

### Boa prática, mas dependente do contexto

Quando houver diferentes soluções aceitáveis, explicar que a escolha depende do contexto.

### Preferência pessoal / escolha arquitetural

Não apresentar uma preferência de arquitetura como se fosse uma regra universal.

Evitar frases como:

> "O jeito correto é fazer X."

quando X é apenas uma das soluções possíveis.

Preferir:

> "Uma abordagem comum é X. Para este projeto, eu escolheria X porque..."

## Não antecipar problemas hipotéticos

Não criar soluções complexas apenas porque elas poderiam ser úteis no futuro.

Exemplos de justificativas que não devem, sozinhas, motivar complexidade:

- "E se o projeto crescer?"
- "E se tivermos milhões de usuários?"
- "E se futuramente houver uma equipe?"
- "E se precisarmos trocar o banco?"
- "E se precisarmos de microsserviços?"
- "E se quisermos reutilizar isso em outro projeto?"

O agente pode mencionar essas possibilidades quando forem relevantes, mas não deve implementar complexidade baseada apenas nelas.

## Fluxo de desenvolvimento

O projeto é desenvolvido 100% na brach dev, features novas só são mergeadas pra main quando desenvolvidas por inteiro, testadas e passarem por uma code review.