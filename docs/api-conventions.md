# API Conventions

Source of truth for API architecture, module structure, validation, layer responsibilities, and response formats. Existing code is an example, not an override of these rules.

## Structure

- Organize APIs by domain under `src/routes/v1/modules/<module>/`.
- Keep the flow unidirectional: `Request → Routes + Zod validation → Controller → Service → Repository (when DB is needed)`.
- Mount every module in `src/routes/v1/index.ts` under its domain prefix. Module route paths are relative to that prefix; `router.get("/", ...)` in `health.routes.ts`, mounted with `v1.use("/health", ...)`, creates `GET /v1/health`.
- Import controllers as a namespace: `import * as controller from "./<module>.controller.js"`.
- Use auxiliary files such as `auth.tokens.ts` or `auth.cookie.ts` for narrowly scoped helpers that would clutter a layer file.

## Layers

### Routes (`*.routes.ts`)

Always required. Map HTTP methods and paths and compose middleware, such as `validateBody(schema)`. Do not put business logic or direct database access here.

### Schemas (`schemas/*.schema.ts`)

Required when an endpoint receives `body`, `params`, or `query` input. Create one Zod schema per operation and export its inferred type:

```typescript
export const registerUserSchema = z.object({ ... })
export type RegisterUserInput = z.infer<typeof registerUserSchema>
```

`validateBody` uses `safeParse`; on failure, convert the result with `zodAdapter` and forward a `ValidationError` containing `issues` to the global error handler. Endpoints with no input do not need a schema.

### Controllers (`*.controller.ts`)

Always required. Handle HTTP concerns and orchestration only:

- Wrap every handler with `asyncHandler`.
- Type `Request` with the schema-inferred input when applicable, for example `Request<unknown, unknown, RegisterUserInput>`.
- Extract validated input and pass it to the service. Do not implement business rules or construct domain responses here.
- Handle cookies and headers through dedicated helpers such as `*.cookie.ts`.
- Send responses with `sendSuccess(res, { statusCode, data, message })`.
- Use `baseLogger.child({ layer: "controller" })` for logging.

### Services (`*.service.ts`)

Always required. Services do not receive `req`/`res` or handle HTTP status codes.

- Implement business rules and assemble domain data, including simple payloads such as a health status.
- Keep password hashing, JWT generation, calculations, and similar domain logic here.
- Call repositories when persistence or queries are needed.
- Throw typed errors (`ValidationError`, `UnauthorizedError`, `NotFoundError`, or `AppError`) when a rule fails. Include structured `issues` (`field`, `message`, `code`) when applicable.
- Use `baseLogger.child({ layer: "service" })` for logging.

### Repositories (`*.repository.ts`)

Required only for PostgreSQL access. Do not create one for static health checks or pure in-memory calculations.

- Use `pool.query` from `pg` and parameterized SQL (`$1`, `$2`, ...); never interpolate values into queries.
- Keep business rules out of repositories.
- Alias `snake_case` columns to `camelCase`, for example `password_hash AS "passwordHash"`.
- In write operations, use `mapPgError` in `catch` to map PostgreSQL errors such as `23505` to `AppError` instances.

## Response formats

All responses use an outer envelope. Domain data, including a domain status such as `{ status: "ok" }`, belongs inside `data`, never at the root. Root fields are reserved for the HTTP envelope.

### Success

Use `sendSuccess`. Common status codes are `200` and `201`.

```json
{
  "success": true,
  "status": "success",
  "data": "...",
  "message": "Operação realizada com sucesso"
}
```

- `success` is always `true`; `status` is always `"success"`.
- `data` contains the domain payload; domain statuses belong inside it.
- `message` is optional and human-readable.

### Errors

Use `AppError` instances and the global error middleware. Common status codes are `401`, `404`, `409`, `422`, `429`, and `500`.

```json
{
  "success": false,
  "status": "fail",
  "code": "VALIDATION_ERROR",
  "message": "Dados inválidos",
  "issues": [
    {
      "field": "email",
      "message": "email já está em uso",
      "code": "EMAIL_ALREADY_EXISTS"
    }
  ],
  "publicDetails": {}
}
```

- `success` is always `false`.
- `status` is `"fail"` for 4xx errors and `"error"` for 5xx errors.
- `code` is an optional machine-readable identifier; `message` is human-readable.
- `issues` is optional and contains `field`, `message`, and `code` for specific violations.
- `publicDetails` is optional and must contain only safe client-facing details.