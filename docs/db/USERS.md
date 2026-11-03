
```SQL
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    theme VARCHAR(10) DEFAULT 'system' NOT NULL,
    shortcuts JSONB NOT NULL DEFAULT '{}'::jsonb,
    refresh_token_hash TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_username_unique UNIQUE (username),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_theme_check CHECK (theme IN ('light', 'dark', 'system'))
);
```
descobrir as constraint: `SELECT conname FROM pg_constraint WHERE conrelid = 'users'::regclass;`

alterar nome da constraint:

`ALTER TABLE users RENAME CONSTRAINT users_username_key TO users_username_unique;`
`ALTER TABLE users RENAME CONSTRAINT users_email_key TO users_email_unique;`

configurado o banco para o horario do brasil

```SQL
ALTER DATABASE meu_banco
SET timezone TO 'America/Sao_Paulo';
```
