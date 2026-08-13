# FM Signal - SRE handoff

## Operational posture

- Static Vite output served through Vercel CDN.
- No server-side API, database, cron or runtime secret is required.
- Primary health signal is successful response and client rendering for `/`, `/select` and `/signal`.

## Monitoring and response

- Check Vercel deployment status and build logs after each release.
- If the public URL fails, inspect the latest deployment, then promote the last known-good deployment.
- For portfolio review, validate the selector and both dashboard routes after a deployment.

## Known risk

- `npm audit` reports existing dependency advisories; no forced upgrade was applied because it could change approved visual/runtime behavior.
