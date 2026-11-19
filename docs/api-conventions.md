# API Conventions

This document is the source of truth for API structure, request handling, error responses, and success response formats. Existing code is an example, not an override of these conventions.

## Module structure and request flow

Organize the API by feature under `backend/src/routes/v1/modules/`. Keep responsibilities separated by layer without adding layers that do not solve a concrete problem.

```text
backend/src/routes/
└── v1/
    ├── index.ts                    # Mounts modules and applies shared middleware
    └── modules/
        ├── auth/
        │   ├── auth.routes.ts      # HTTP methods, middleware, and paths
        │   ├── auth.controller.ts  # Handles req/res and coordinates the request
        │   ├── auth.service.ts     # Implements business rules
        │   ├── auth.repository.ts  # Reads and writes database records
        │   ├── auth.cookie.ts      # Cookie helpers
        │   ├── auth.tokens.ts      # Token helpers
        │   └── schemas/
        │       ├── auth.login.schema.ts
        │       └── auth.register.schema.ts
        ├── users/
        │   ├── users.routes.ts
        │   ├── users.controller.ts
        │   ├── users.service.ts
        │   ├── users.repository.ts
        │   └── schemas/
        │       ├── users.delete.user.schema.ts
        │       ├── users.username.schema.ts
        │       ├── users.update.password.schema.ts
        │       └── users.update.settings.schema.ts
        └── pgErrorMapper.ts        # Maps PostgreSQL errors to application errors
```

Requests flow through the layers in one direction:

```text
Client
  ↓
v1/index.ts       Mounts modules and applies shared middleware
  ↓
*.routes.ts       Defines endpoints and validates input when needed
  ↓
*.controller.ts   Coordinates the HTTP request and response
  ↓
*.service.ts      Applies business rules
  ↓
*.repository.ts   Accesses PostgreSQL when persistence is needed
  ↓
Database
```

## Zod-inferred input types

This is a recommended practice, not a strict requirement. Define the input schema and export its inferred type from the schema file:

```typescript
export const updateSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
})

export type UserSettingsUpdate = z.infer<typeof updateSettingsSchema>
```

Use the inferred type in the controller instead of maintaining a duplicate request type under `src/types/`.

If a type is used beyond request handling or across multiple modules, consider whether it represents a domain concept that belongs in `src/types/` rather than in a request schema.

## API error responses

Use an existing typed error when one matches the situation. If no specific error class fits, use `AppError` directly. Create a custom error class when the same error case recurs and a dedicated type would make the code clearer.

Provide the appropriate HTTP status code and a clear message. Include a stable `code` in most cases so clients can handle the error without relying on its message. Use `issues` when the response should identify specific invalid fields. For a request-level issue that does not belong to one field, use `field: 'root'`. Do not create an issue for an unexpected failure; let it reach the global error middleware.

`AppError` requires a message. `ValidationError` can use its default message or receive a more specific one. A more specific message can help explain the failure, but keep client-facing messages safe and useful.

```typescript
throw new ValidationError({
  issues: [
    {
      field: 'password',
      message: 'The password is incorrect; the account was not deleted.',
      code: 'INVALID_VALUE',
    },
  ],
})
```

## Success response format

Successful API responses should use `sendSuccess` and an appropriate `2xx` status code. Keep the domain payload in `data` and return it as an object. If the value being returned is already an object, wrap it under a named property to make the response shape explicit.

```typescript
return sendSuccess<{ user: UserData }>(res, {
  data: {
    user: userData,
  },
})
```