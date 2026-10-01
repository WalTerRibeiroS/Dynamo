# Agents

## Project Goal

Dynamo is a casual personal project developed primarily for hands-on learning.

The main goal is not to create a commercial product, a highly scalable architecture, or an application built for a large team. The goal is to learn, in practice, how to develop a full-stack application using:

## Technologies Used

### Language
TypeScript (frontend and backend)

#### TypeScript Conventions
When using TypeScript, read `docs/typescript-conventions.md` before making changes involving TypeScript code. Treat the document as the source of truth for project-specific TypeScript conventions.

### API / Backend
Node and Express

#### API Conventions
When developing or modifying API routes, read docs/api-conventions.md before making changes to the API. Treat the document as the source of truth for project-specific API conventions.

### Frontend
React, React Compiler, and Tailwind CSS

When using **React**, refer to `docs/react-conventions.md` for the correct guidelines and style to follow.

### Database
PostgreSQL

Refer to files inside `docs/db` when needed to understand how the tables operate within the project.

### Automated Testing
Vitest, RTL (React Testing Library), Playwright

### Deployment
Backend and PostgreSQL DB with Railway
Frontend with Vercel

### Architectural Principle
Prioritize a clear division of responsibilities without creating an overly fragmented architecture.

Separate concerns whenever it improves code comprehension and maintainability, but avoid creating files, classes, or layers merely to adhere to a predefined structure.

The agent must keep this goal in mind across all suggestions, implementations, and code reviews.

## Most Important Principle: Simplicity

This project must not receive unnecessary architectural complexity.

### About This Principle

This project values knowing more complex architectures and design patterns — Clean Architecture, DDD, CQRS, etc. Knowing they exist, understanding their trade-offs, and recognizing when a problem calls for that kind of solution is an important part of learning.

What this principle asks for is not ignorance of these patterns, but rather discipline when applying them: they solve specific problems in specific contexts, and not every project — especially this one — has those problems right now. Applying a pattern because it is "the right way to do it" or because it appears in every tutorial is not the same as applying it because the project genuinely needs it.

In other words: the agent should not treat these patterns as something to be avoided because they are bad, but as tools that are only worthwhile when the problem they solve actually exists in the project.

Do not automatically introduce:

- Clean Architecture;
- Hexagonal Architecture;
- DDD;
- CQRS;
- Event Sourcing;
- Event systems;
- Microservices;
- Multiple abstraction layers;
- Design patterns merely to "follow patterns";
- Abstract repositories/services/factories without necessity;
- Dependency injection containers;
- Overly generic, reusable systems;
- Abstractions created in advance for possible future needs.

These approaches are not forbidden.

They may be used when a concrete problem exists in the project that is meaningfully solved by them.

Before introducing an abstraction or a more complex pattern, the agent must consider:

1. What concrete problem does this solve?
2. Does this problem actually exist in the project right now?
3. Is there a simpler solution?
4. Is the added complexity justified by the benefit?
5. Does this help with learning or does it merely add structure?

If the answer indicates that complexity is not necessary, prefer the simple solution.

### Practical Rule

Do not design for a problem the project does not yet have.

## Do Not Confuse Simplicity with Bad Practice

The goal of keeping the project simple does not mean ignoring best practices.

The agent must continue to point out important issues related to:

- Security;
- Data validation;
- Error handling;
- Proper separation of concerns;
- Typing;
- Meaningful duplication;
- Hard-to-understand code;
- Unnecessary coupling;
- Testing;
- Accessibility when relevant;
- Genuinely relevant performance issues;
- Incorrect behavior;
- Core principles of the technologies used.

The difference is that the agent should avoid turning a simple best practice into an overly complex architecture.

Example:

Validating data received by an API is important.

This does not mean it is necessary to create a complex validation system and abstractions for every endpoint.

## Consensus vs. Architectural Opinion

The agent must clearly differentiate:

### Widely Used Practice

When something is a common convention or standard practice of the technology, state it as such.

### Best Practice, but Context-Dependent

When there are multiple acceptable solutions, explain that the choice depends on the context.

### Personal Preference / Architectural Choice

Do not present an architectural preference as if it were a universal rule.

Avoid phrases like:

> "The right way is to do X."

when X is only one of several possible solutions.

Prefer:

> "A common approach is X. For this project, I would choose X because..."

## Do Not Anticipate Hypothetical Problems

Do not create complex solutions merely because they might be useful in the future.

Examples of justifications that should not, on their own, motivate complexity:

- "What if the project grows?"
- "What if we have millions of users?"
- "What if there is a team in the future?"
- "What if we need to switch the database?"
- "What if we need microservices?"
- "What if we want to reuse this in another project?"

The agent may mention these possibilities when relevant, but must not implement complexity based solely on them.

## Development Workflow

The project is developed 100% on the `dev` branch. New features are only merged into `main` once fully developed, tested, and after passing a code review.