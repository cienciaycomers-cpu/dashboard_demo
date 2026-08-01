# FM Signal - Delivery plan

## Sequenced tasks

1. **T1 - Route shell and selector**: add deterministic `/select` and `/signal` routing while preserving `/`; create the experience selector. Verify the current route still renders.
2. **T2 - Shared view-model adapter**: expose the existing filtered aggregates, metrics, comparison and alerts in a presentation-friendly shape without duplicating formulas. Add unit coverage for empty and missing states.
3. **T3 - FM Signal visual system**: add scoped theme tokens, typography hierarchy, chapter layout and responsive foundations.
4. **T4 - Profitability hero**: build the opening scene with ACOS, ROAS, contribution margin, break-even and result after ads.
5. **T5 - Narrative chapters**: implement Acquisition, Conversion and Profitability scenes using reusable chapter/metric/chart components.
6. **T6 - Motion layer**: integrate Motion for React with viewport entrances, bounded parallax and reduced-motion behavior.
7. **T7 - Hypothesis close**: build the evidence-backed investment opportunity state and formula/context affordances.
8. **T8 - QA and regression**: verify `/`, `/select` and `/signal` across viewport sizes, keyboard navigation, missing data and reduced motion.

## Milestones

- M1: route selector and `/signal` shell visible.
- M2: profitability hero with real shared view models.
- M3: complete narrative and motion layer.
- M4: verified portfolio-ready release candidate.

## Risks

- Motion can obscure metrics or hurt mobile performance; keep animations bounded and test reduced motion.
- Shared state changes can regress `/`; isolate presentation adapters.
- Strong visual abstraction can hide definitions; keep labels, formulas and status text available.
