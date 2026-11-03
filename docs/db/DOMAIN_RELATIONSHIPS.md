```SQL
ALTER TABLE domains
    ADD CONSTRAINT domains_id_workspace_unique UNIQUE (id, workspace_id);

CREATE TABLE domain_relationships (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL,
    source_domain_id UUID NOT NULL,
    target_domain_id UUID NOT NULL,
    type VARCHAR(15) NOT NULL DEFAULT 'line',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT domain_relationships_source_fkey
        FOREIGN KEY (source_domain_id, workspace_id)
        REFERENCES domains (id, workspace_id) ON DELETE CASCADE,

    CONSTRAINT domain_relationships_target_fkey
        FOREIGN KEY (target_domain_id, workspace_id)
        REFERENCES domains (id, workspace_id) ON DELETE CASCADE,

    CONSTRAINT domain_relationships_no_self_check
        CHECK (source_domain_id <> target_domain_id),

    CONSTRAINT domain_relationships_type_check
        CHECK (type IN ('line', 'arrow', 'bidirectional'))
);

CREATE UNIQUE INDEX domain_relationships_pair_unique
    ON domain_relationships (
        LEAST(source_domain_id, target_domain_id),
        GREATEST(source_domain_id, target_domain_id)
    );

CREATE INDEX domain_relationships_workspace_id_idx
    ON domain_relationships (workspace_id);
```

## Regras do modelo

- `workspace_id` identifica o Workspace dos dois domínios. As chaves
  estrangeiras compostas impedem relacionar domínios de Workspaces diferentes.
- `domains_id_workspace_unique` repete uma chave já identificada por `id`, mas
  é necessária para que as chaves estrangeiras compostas referenciem o par
  `(id, workspace_id)`.
- A exclusão de qualquer Domain remove os relacionamentos que o referenciam;
  a exclusão do Workspace também os remove em cascata por meio dos Domains.
- A verificação `domain_relationships_no_self_check` impede que um Domain seja
  origem e destino da mesma relação.
- O índice único por `LEAST` e `GREATEST` permite apenas um relacionamento por
  par, independentemente da ordem de `source_domain_id` e `target_domain_id`.
  Isso vale também para `arrow`: criar a seta inversa como outra linha gera um
  conflito de unicidade. Para indicar ambos os sentidos, atualiza-se o registro
  para `bidirectional`. O índice não inclui `workspace_id` porque `domains.id`
  é chave primária global; o mesmo UUID não pode identificar domínios em
  Workspaces diferentes.
- A ordem de origem e destino é preservada no registro. Para `line` e
  `bidirectional`, ela não altera o desenho; em `arrow`, a seta aponta de
  `source` para `target`.
- `type` usa `VARCHAR` com `CHECK`, aceitando `line`, `arrow` e
  `bidirectional`, e assume `line` quando omitido. Os valores precisam ser
  mantidos alinhados com a fonte de verdade TypeScript:

```ts
export const RELATIONSHIP_TYPES = ['line', 'arrow', 'bidirectional'] as const;
export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];
```

O schema Zod deve derivar seu enum desse array (`z.enum(RELATIONSHIP_TYPES)`),
e a interface pode usar o mesmo array para apresentar as opções.

## Índices

- `domain_relationships_pair_unique` bloqueia pares duplicados nos dois
  sentidos.
- `domain_relationships_workspace_id_idx` atende consultas de relacionamentos
  por Workspace. A unicidade por par não começa por `workspace_id`.
