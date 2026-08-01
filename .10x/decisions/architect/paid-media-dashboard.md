# Architecture decision: paid-media-dashboard

## Decision

Use a React + TypeScript + Vite single-page application with a static build, local bundled data and no runtime backend or external data fetch for the first version.

## Boundaries

### Data boundary

Owns the local dataset and its adapter. It exposes normalized daily campaign facts and economic inputs without knowing how the UI renders them.

### Metric boundary

Owns formulas for CTR, CPC, CPA, conversion rate, ROAS, ACOS, net revenue, contribution margin and break-even ACOS. Derived values are calculated here rather than duplicated in components.

### Analysis boundary

Owns period comparison, partial-period handling and anomaly evaluation. It consumes normalized facts and metric outputs.

### Presentation boundary

Owns Overview, Adquisición, Conversión, Rentabilidad, alert list and contextual detail panel. It consumes view models and never recalculates business formulas.

## Data flow

1. Local JSON or typed data is loaded at build/runtime without network access.
2. `DataAdapter` validates and normalizes rows.
3. `MetricEngine` derives metrics from normalized facts.
4. `ComparisonEngine` creates equivalent-period comparisons.
5. `AnomalyEngine` produces severity-tagged alerts.
6. Global filter state creates a filtered analysis context.
7. UI sections render the resulting view models.

## Core normalized record

One record represents one day, platform and demo campaign:

- `date`, `monthKey`;
- `platform`;
- `campaignId`, `campaignName`;
- `objective`, `funnelStage`;
- `spend`, `impressions`, `clicks`, `conversions`;
- `grossRevenue`;
- `discounts`, `returns`, `cancellations`;
- `variableCosts`.

The source-specific names are transformed before they reach the UI. No source brand or campaign identifiers cross the data boundary.

## Metric contracts

- Rates and ratios return a numeric value only when the denominator is positive.
- Missing or non-comparable inputs return an explicit not-calculable state.
- ACOS target is a configurable constant with default 10%.
- Break-even ACOS requires comparable gross revenue and contribution margin before ads.
- Current partial month comparison uses the same elapsed days in the previous month.

## Failure modes

- **Malformed row:** reject or quarantine the row and expose a data-quality alert.
- **Missing metric input:** preserve null; do not coerce to zero.
- **Zero denominator:** render `—` and an explanatory state.
- **Empty filtered segment:** show an empty state with active filters.
- **Incomplete current period:** label the period context and restrict comparison to elapsed days.
- **Alert calculation failure:** keep the data view usable and show a methodology warning rather than a fabricated alert.

## Scalability and migration path

The first version is sized for a small portfolio dataset and static hosting. If a real connected version is needed later, a new adapter can replace the local data boundary while reusing the normalized model, metric engine, analysis engine and UI contracts.

## Alternatives rejected

- Vanilla HTML/JS: simpler but less maintainable for shared filter state and contextual panels.
- Next.js with backend: more capability than the current product requires and adds operational complexity.

## Design checkpoint

Architecture accepted by the user. No implementation should begin until Planning completes its task breakdown and checkpoint.
