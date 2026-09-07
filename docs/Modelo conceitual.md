
## Visão geral

```
User       1 ───── 0..5  Workspace

Workspace  1 ───── 0..20 Domain

Domain     1 ───── 0..N  Content

Domain     1 ───── 0..N  Note

Domain     1 ───── 0..100 Flashcard
```

## Relacionamentos (linha e flecha)

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
├── zoom 
├── posição da câmera 
├── tema
└── Domains
```

## Domínios mais a fundo

```
Domain
├── nome
├── ícone
├── descrição
├── relacionamentos
|    ├── origem 
|    ├── destino 
|    └── tipo
|         ├── linha 
|         └── direcionada
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

