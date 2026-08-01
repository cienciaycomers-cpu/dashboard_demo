# FM Signal - Staff engineering decision

## Reuse rules

- Reuse `src/domain`, `src/data` and current filter/period semantics.
- Create presentation-specific components rather than branching the current dashboard markup deeply.
- Keep all new visual state local to FM Signal unless it is a shared domain concern.

## Standards

- TypeScript strictness remains enabled.
- No external runtime data fetch.
- No real brand or campaign identifiers.
- Use semantic labels and text in addition to color and motion.
- Every motion-heavy component needs a reduced-motion path.
- Preserve keyboard navigation for selector, filters, chapters and details.

## Cross-cutting concerns

- Route handling must be deterministic for `/`, `/select` and `/signal`.
- Shared view models should be tested independently of the visual layer.
- Build size and mobile performance must be measured after Motion integration.
- Avoid loading large visual assets or WebGL runtimes for decorative effects.
