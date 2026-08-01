# FM Signal - Implementation approach

## T1 route shell

Use deterministic pathname handling compatible with the current Vite SPA. Preserve the current App as the `/` experience and introduce explicit entry components for `/select` and `/signal`.

## T2 shared view models

Extract or compose pure selectors around the existing metric/analysis functions. Keep `null`, missing and zero-denominator states explicit. Do not move business formulas into visual components.

## T3 visual system

Scope FM Signal tokens under a root class or data attribute so the current dashboard CSS cannot be affected. Build mobile-first layout rules while tuning the hero for desktop.

## T4-T5 composition

Build the hero and chapters as independent components. Each chapter receives a stable view-model contract and can render an empty or unavailable state without layout failure.

## T6 motion

Use Motion for React only after static composition is verified. Add motion in layers: entrance, progress, then bounded parallax. Respect `prefers-reduced-motion` and keep semantic focus order independent from visual movement.

## T7-T8 release gates

Run typecheck, unit tests, production build and route smoke checks after each milestone. Compare `/` before and after FM Signal changes and keep deployment behind the existing branch until review approval.
