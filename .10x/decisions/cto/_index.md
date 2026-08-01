# CTO decisions index

## Active features

| Feature | Description | Status |
|---|---|---|
| `paid-media-dashboard` | Public portfolio dashboard for Faithis demo e-commerce | Strategy complete |
| `fm-signal-redesign` | Immersive portfolio experience for paid-media intelligence | Strategy complete |

## Cross-cutting principles

- Prioritize portfolio value, clarity and reversibility over production-scale infrastructure.
- Keep the original Drive source read-only and isolated from the demo dataset.
- Avoid live platform connectors in the first version because they add credential, privacy and maintenance risk without improving the core portfolio proof.
- Treat metric definitions and data provenance as first-class product concerns.
