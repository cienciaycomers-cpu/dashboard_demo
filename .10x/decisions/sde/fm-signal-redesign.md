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
