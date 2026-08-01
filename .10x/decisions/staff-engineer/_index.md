# Staff Engineer decisions index

## Active features

| Feature | Description | Status |
|---|---|---|
| `paid-media-dashboard` | Standards for maintainable offline dashboard implementation | Design complete |

## Cross-cutting principles

- Keep business formulas in pure, testable functions.
- Keep UI components focused on rendering and interaction orchestration.
- Use explicit types for metric values, missing values, alerts and comparison states.
- Favor small modules over a large dashboard component.
- Do not add abstractions until a second use case justifies them.
