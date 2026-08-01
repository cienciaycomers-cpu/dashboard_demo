# FM Signal - CTO strategy

## Strategic intent

Build a second public portfolio experience that demonstrates both paid-media judgment and advanced product/design execution. The new experience should increase memorability without destabilizing the existing dashboard.

## Build verdict

Build as a route within the current React + TypeScript + Vite project. Reuse the existing domain and data layers; isolate the visual experience in a new `/signal` route and keep `/` unchanged.

## Product direction

- Product: FM Signal / Paid Media Intelligence.
- Concept: Data Cinema with luxury editorial treatment.
- Primary outcome: balance visual impact with analytical depth.
- Recommendation style: actionable hypothesis supported by metrics, never an automatic business command.

## Strategic trade-offs

- Shared code reduces divergence and protects metric consistency.
- A dedicated route preserves reversibility and makes A/B review easy.
- SVG/CSS plus controlled depth effects provides strong visual differentiation without WebGL weight or browser fragility.
- Full responsiveness is required because the portfolio may be viewed on unknown devices.

## Success criteria

- A visitor understands the profitability state and opportunity within one minute.
- The design is visibly distinct from the current dashboard.
- The existing route remains regression-free.
- The experience can be deployed through the existing GitHub/Vercel pipeline.
