# Architect decisions index

## Active features

| Feature | Description | Status |
|---|---|---|
| `paid-media-dashboard` | Offline-capable React dashboard with local data model | Design complete |

## Cross-cutting principles

- Prefer a static, reversible architecture for this portfolio demo.
- Keep data normalization, metric calculation, comparison and alerting separate from UI rendering.
- Treat null, zero and not-calculable as distinct states.
- Preserve a migration path from local data to future platform adapters without introducing a backend now.
