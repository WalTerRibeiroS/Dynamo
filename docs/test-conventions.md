# Testing

already existing test are only for exemple they do not serve as an overide of these conventions.

- Add unit tests for business logic, zod schemas and important utilities.
- API tests should call endpoints through the Express app and verify the observable HTTP contract.
- Integration tests should validate behavior with relevant real dependencies, isolate state, and verify observable effects.
- Run the narrowest relevant tests during development. Before calling the task done, run:

```bash
npm run test
npm run typecheck
```