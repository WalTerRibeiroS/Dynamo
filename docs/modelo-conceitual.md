## Visão geral

```
User       1 ───── 0..5  Workspace

Workspace  1 ───── 0..20 Domain

Domain     1 ───── 0..N  Content

Domain     1 ───── 0..N  Note
```

## Relacionamentos (linha, seta e seta bidirecional)

```
	   Domain
		 │
		 │ 0..N
		 ▼
 DomainRelationship
		 ▲
		 │ 0..N
		 │
	   Domain
```

## Workspace mais a fundo

```
Workspace 
├── nome
├── zoom (0.50 a 3)
├── posição da câmera 
├── paleta de cores
├── modo leitura/edição (global ao Workspace)
└── Domains
```

## Domínios mais a fundo

```
Domain
├── nome
├── descrição
├── relacionamentos
|    ├── origem 
|    ├── destino 
|    └── tipo
|         ├── linha 
|         ├── direcionada
|         └── bidirecional
├── posição X
└── posição Y
```

## User

```
User 
├── Username 
├── Senha
├── Email
├── Avatar
├── Tema (light, dark, system)
├── Configurações
└── Workspaces
```
