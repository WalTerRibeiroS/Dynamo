# Typescript conventions

- Keep TypeScript strict and resolve type errors instead of weakening compiler options.
- Avoid `any` . Treat data from requests, responses, and other external boundaries as unknown until it has been validated or narrowed.
- Prefer inference for local implementation details and explicit types at exported package boundaries.
- Derive request and response types from shared Zod schemas when possible so runtime validation and static types stay aligned.
- Use `import type` for type-only imports.
- Prefer discriminated unions when modeling a fixed set of states or outcomes.
- Avoid type assertions (`as`) and non-null assertions (`!`) as a substitute for a real runtime check. They are acceptable only when:
  - the invariant is guaranteed and clear from nearby code (e.g. a length check
    performed immediately before), or
  - the assertion is contained inside a small, well-named function — typically a type guard — whose sole job is to narrow a wide value, and the actual safety comes from a runtime check elsewhere in that same function (e.g. working around a library signature that is stricter than its real behavior, such as `Set<T>.has()`).
  In both cases, the assertion itself must never be the thing doing the safety work.
- Keep types close to their implementation when they are private to one module. Put contracts shared by applications in ther proped package.
- Mark values `readonly` when callers should not mutate them, and avoid mutating objects received from another layer. 
- Choose descriptive domain names instead of generic names such as `Data` , `Item`, or `Result`.