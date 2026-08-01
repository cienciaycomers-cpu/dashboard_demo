# FM Signal - Architecture decision

## Experience boundaries

- `/` remains the existing dashboard.
- `/select` is a lightweight experience selector.
- `/signal` owns the new cinematic composition.
- Existing domain modules remain the source of truth for facts, metrics, periods and alerts.

## Component model

- `ExperienceSelector`: chooses Classic Dashboard or FM Signal.
- `SignalShell`: global theme, scroll progress, navigation and reduced-motion state.
- `SignalHero`: profitability-led opening scene.
- `SignalChapter`: reusable narrative section for Acquisition, Conversion and Profitability.
- `SignalMetric`: large editorial metric with definition, status and variation.
- `SignalChart`: SVG-based visualizations driven by existing view models.
- `SignalHypothesis`: evidence-backed closing recommendation state.

## Data flow

`demoDataset` -> existing metric/analysis engines -> shared view models -> Classic Dashboard or FM Signal presentation components.

FM Signal must not duplicate ACOS, ROAS, margin, period or alert formulas in visual components.

## Interaction architecture

- Motion for React controls viewport entrances, scene transitions and bounded parallax.
- SVG remains the rendering layer for charts.
- CSS variables define the luxury editorial theme and semantic states.
- `prefers-reduced-motion` disables parallax and reduces transitions to immediate state changes.
- Scroll progress is contextual UI, not a replacement for accessible navigation.

## Failure modes

- Missing metrics remain explicit and render as unavailable states.
- Empty filtered contexts show a clear empty state without breaking the narrative.
- Animation failure must not affect metric rendering or navigation.
- The `/` route must remain isolated from FM Signal styling and state.
