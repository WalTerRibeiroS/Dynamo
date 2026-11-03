```SQL
CREATE TABLE domains (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL,
    domain_name VARCHAR(50) NOT NULL,
    description TEXT,
    position_x DOUBLE PRECISION NOT NULL DEFAULT 0,
    position_y DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT domains_workspace_id_fkey
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    CONSTRAINT domains_name_not_blank_check
        CHECK (char_length(btrim(domain_name)) > 0),

    CONSTRAINT domains_description_length_check
        CHECK (description IS NULL OR char_length(description) <= 200)
);

CREATE UNIQUE INDEX domains_workspace_name_unique
    ON domains (workspace_id, lower(btrim(domain_name)));
```

O índice torna o nome único sem diferenciar maiúsculas e minúsculas dentro do
mesmo Workspace. `domain_name` também é obrigatório, limitado a 50 caracteres
e não pode conter apenas espaços. A descrição é opcional e limitada a 200
caracteres. A coluna `icon` ficou fora da tabela atual.

## Limite de Domains por Workspace

O trigger serializa tentativas de criação para o mesmo Workspace antes de
contar seus Domains, evitando que inserções concorrentes ultrapassem o limite:

```SQL
CREATE FUNCTION enforce_domain_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM 1 FROM workspaces WHERE id = NEW.workspace_id FOR NO KEY UPDATE;

    IF (SELECT COUNT(*) FROM domains WHERE workspace_id = NEW.workspace_id) >= 20 THEN
        RAISE EXCEPTION 'Um workspace pode possuir no máximo 20 domínios'
            USING ERRCODE = '23514', CONSTRAINT = 'domains_workspace_limit';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER domains_limit_per_workspace
BEFORE INSERT ON domains
FOR EACH ROW
EXECUTE FUNCTION enforce_domain_limit();
```

## Posição no Canvas

A primeira posição é `(0, 0)`. O backend escolherá posições livres por meio de
uma função como `findFreePosition()`; essa regra não fica no banco. A função e
a inserção precisam fazer parte da mesma transação, que deve bloquear a linha
do Workspace antes de procurar uma posição. Assim, duas criações simultâneas
no mesmo Workspace não escolhem a mesma posição com base no mesmo estado.

As colunas têm `DEFAULT 0` para representar a posição inicial. Como esse padrão
também pode fazer inserções subsequentes sem coordenadas nascerem em `(0, 0)`,
o backend deve sempre enviar as coordenadas calculadas para cada criação.

Ainda falta definir como `findFreePosition()` mede colisão (incluindo dimensões
e espaçamento dos cards) e como se comporta ao não encontrar uma posição livre.

## Notas de persistência

- `id` não tem valor padrão; quem inserir o Domain deve fornecer o UUID, seguindo o padrão atual de `workspaces`.
- A chave estrangeira remove Domains quando o Workspace é excluído. A exclusão do Domain também deve remover conteúdos, anotações e relacionamentos, conforme as regras de negócio.
- `updated_at` recebe valor automaticamente na criação, mas precisa ser atualizado pelo backend nas operações de edição. O `DEFAULT` não muda o campo em atualizações.
- O trigger cobre inserções. Se futuramente for permitido mover um Domain para outro Workspace alterando `workspace_id`, a regra de limite também precisará cobrir essa atualização.