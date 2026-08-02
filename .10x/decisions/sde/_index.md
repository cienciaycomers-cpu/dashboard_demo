# SDE decisions index

## Active features

| Feature | Description | Status |
|---|---|---|
| `paid-media-dashboard` | Implementation of the offline Faithis portfolio dashboard | T1-T4 complete, T5/T6 in progress |
| `fm-signal-redesign` | Static visual system plus bounded Motion interactions implemented | T1-T6 complete |

## Cross-cutting notes

- Baseline uses React 18, TypeScript 5.7, Vite 6 and Vitest 3.
- Runtime data will remain local and no external fetch will be introduced.
- T1 verification passed with type-check and production build.
