# FM Signal - Delivery decision

## Release

- Target: Vercel production.
- Project: `dashboard-demo` in team `ECOMERS`.
- Source branch: `agent/dashboard-demo`.
- Deployment URL: `https://dashboard-demo-8bifylcd5-ecomers.vercel.app`.
- Stable alias: `https://dashboard-demo-ecomers.vercel.app`.
- Release commit: `184d638`.

## Strategy

- Deploy the existing Vite application as a static production build.
- Keep all demo data local; no runtime external fetch is introduced.
- Use GitHub as the source of truth and Vercel as the public delivery layer.

## Rollback

- Roll back by promoting the previous known-good Vercel deployment from the project dashboard, or redeploying the previous Git commit.
- The classic dashboard remains available at `/` as the operational fallback while `/signal` is reviewed.

## Verification

- Public HTTP checks returned `200` for `/`, `/select` and `/signal`.
