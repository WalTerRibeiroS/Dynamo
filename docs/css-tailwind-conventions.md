[ANTES DE ADICIONAR ESSA CONVENTION INSTALAR - `npm install clsx tailwind-merge`, adicionar nos patterns e adaptar no final]

# When to use Tailwind vs. pure CSS

* Use Tailwind utilities for spacing, colors, typography, layout (`flex`/`grid`), states (`hover:`, `focus-visible:`, `dark:`), and simple responsive variations.
* Use plain CSS for multi-stage `@keyframes`, complex selectors such as `:has()` or sibling combinators, elaborate pseudo-elements, `clip-path`, or deeply nested `calc()` expressions.
* Use plain CSS when a long combination of utility classes is repeated across multiple places without naturally mapping to a reusable React component.
* Keep plain CSS consistent with the existing CSS conventions: low specificity, no `!important`, and theme tokens.
* Treat Tailwind and plain CSS as complementary tools; use each where it is most appropriate.

# CSS/Tailwind Conventions

- Use Tailwind v4 syntax and avoid deprecated v3 patterns like:
  - `@theme { }` instead of `tailwind.config.js` for theme customization.
  - `@import "tailwindcss";` instead of `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;`.
  - `bg-red-500/50` instead of `bg-opacity-50`.
  - `bg-linear-to-r` instead of `bg-gradient-to-r`.
  - `flex!` instead of `!flex`.
- Follow already existing patterns:
  - order: layout → spacing → size → color → state...
  - class-naming: kebab-case
- Reuse existing custom properties and shared values (like `@theme` or `:root`) before introducing new ones.
- Prefer low-specificity class selectors and avoid `!` or `!important`.
- Use flexible layout primitives such as Grid and Flexbox instead of fixed positioning for page structure.
- **[IGNORE THIS ONE]** Design mobile-first where practical and verify that layouts remain usable at narrow and wide viewport sizes.
- Use relative units for scalable typography and spacing while retaining pixels where they are appropriate for borders or small fixed details.
- Provide visible `:focus-visible` styles for interactive controls and do not remove browser focus indicators without an accessible replacement.
- Ensure hover-only information is also available to keyboard and touch users, prefer the component's semantic state (such as aria-expanded) when visibility depends on actual component state rather than styling alone.
- Use `motion-reduce/safe:` respecting `prefers-reduced-motion` when adding nonessential motion.
- Maintain sufficient text and control contrast against the dark interface.
- Keep transitions restrained and limited to properties that do not trigger unnecessary layout work.

## React + Tailwind only

- Never build Tailwind classes dynamically with template strings (`bg-${color}-500`).
- Use complete class names in static maps so Tailwind can detect and generate them.
- Use `clsx` for conditional classes instead of manual string concatenation.
- Use `clsx` + `tailwind-merge` (`cn`) when conditional classes may conflict.
- Extract repeated utility-class combinations into React components instead of using `@apply`.
- Prefer reusable components such as `<Card className="...">` over repeating large utility-class blocks.
- Use `class-variance-authority` (CVA) when variants such as size, color, and state start creating complex conditional logic.