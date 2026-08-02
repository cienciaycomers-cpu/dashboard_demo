# FM Signal - SDE implementation log

## T1 - route shell and selector

Implemented the first reversible slice without changing the existing dashboard markup.

- `/` continues to render the current dashboard.
- `/select` renders the experience selector.
- `/signal` renders the initial FM Signal shell placeholder.
- Added scoped selector/signal visual foundations and responsive behavior.
- Kept the new route components independent from the existing metric engine.

Verification:

- `npm run typecheck` passed.
- `npm test -- --run` passed: 10 tests in the source tree.
- `npm run build` passed.

Notes:

- The temporary `deploy-public` staging folder is ignored and is not part of the application source.
- FM Signal visual chapters and Motion integration are still pending.

## T2 - shared view-model adapter

Added `src/domain/viewModels.ts` and `src/domain/viewModels.test.ts`.

- Centralizes filtered current/previous windows.
- Exposes aggregates, derived metrics, alerts, campaign rows and platform rows.
- Preserves explicit missing and zero-denominator behavior.
- FM Signal shell now consumes the adapter for its initial ACOS and margin state.

Verification:

- `npm run typecheck` passed.
- `npm test -- --run` passed: 13 tests.
- `npm run build` passed.
