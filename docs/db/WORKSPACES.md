```SQL
CREATE TABLE workspaces (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    workspace_name VARCHAR(50) NOT NULL,
    zoom DOUBLE PRECISION NOT NULL DEFAULT 1,
    camera_x DOUBLE PRECISION NOT NULL DEFAULT 0,
    camera_y DOUBLE PRECISION NOT NULL DEFAULT 0,
    color_palette VARCHAR(10) NOT NULL DEFAULT 'purple',
    is_edit_mode BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT workspaces_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT workspaces_user_name_unique
        UNIQUE (user_id, workspace_name),

    CONSTRAINT workspaces_zoom_range_check
        CHECK (zoom BETWEEN 0.50 AND 3),

    CONSTRAINT workspaces_color_palette_check
        CHECK (color_palette IN (
            'red', 'green', 'blue', 'purple', 'yellow', 'white', 'black'
        ))
);
```

no futuro se sobrar tempo e vontade eu queria adiconar uma coluna de `position` para poder reondenar os workspaces na ordem que o user quisesse

e tambem uma coluna de `icon` que o user poderia escolher para representar o workspace

Trigger para evitar que passe de 5 workspaces por user:

```SQL
CREATE FUNCTION enforce_workspace_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM 1 FROM users WHERE id = NEW.user_id FOR NO KEY UPDATE;

    IF (SELECT COUNT(*) FROM workspaces WHERE user_id = NEW.user_id) >= 5 THEN
        RAISE EXCEPTION 'Um usuário pode possuir no máximo 5 workspaces'
            USING ERRCODE = '23514', CONSTRAINT = 'workspaces_user_limit';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER workspaces_limit_per_user
BEFORE INSERT ON workspaces
FOR EACH ROW
EXECUTE FUNCTION enforce_workspace_limit();
```
