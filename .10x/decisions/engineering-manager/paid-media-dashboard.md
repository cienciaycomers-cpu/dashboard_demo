# Engineering Manager plan: paid-media-dashboard

## Delivery context

- Team model: one autonomous contributor with role switching.
- Cadence: no external deadline; work in verified increments.
- Delivery mode: local-first, public portfolio app after explicit approval of implementation.
- WIP limit: one implementation task at a time.

## Ordered task breakdown

### T1 — Project baseline and toolchain (S)

Create the Vite/React/TypeScript baseline and establish scripts for development, build, type-check and tests. Verify that the empty app builds before adding domain logic.

Dependency: none.

### T2 — Dataset contract and safe fixture preparation (M)

Define the normalized daily campaign record and create a safe demo fixture from the approved reference structure. Replace brand/campaign identifiers, preserve missing values, and mark internal provenance without rendering it in the UI.

Dependency: T1 and read-only source inspection.

Risk: source workbook may require a separate bounded extraction path because it is an Excel file.

### T3 — Metric engine (M)

Implement pure calculations for CTR, CPC, CPA, conversion rate, ROAS, ACOS, net revenue, contribution margin, margin after ads and break-even ACOS. Add denominator and null behavior.

Dependency: T2.

### T4 — Period comparison and anomaly engine (M)

Implement current-month selection, same-elapsed-days previous-month comparison, partial-period context and hybrid alert rules with severity.

Dependency: T3.

### T5 — Application shell and visual tokens (S)

Build dark premium layout primitives, typography, spacing, semantic colors, responsive containers and accessible focus states.

Dependency: T1.

### T6 — Shared filter state and view models (M)

Implement month, platform, campaign and objective filters with one derived analysis context consumed by all sections.

Dependency: T2, T3, T4, T5.

### T7 — Overview and funnel sections (L, split into slices)

Implement Overview, Adquisición, Conversión and Rentabilidad as independent sections with KPI cards, charts and tables. Add ACOS target/actual/equilibrium states.

Dependency: T6.

### T8 — Contextual detail and alert interactions (M)

Add campaign/alert selection, contextual detail panel, formulas and methodology tooltips, empty states and non-calculable states.

Dependency: T7.

### T9 — Responsive and accessibility pass (S)

Verify desktop and smaller viewports, keyboard navigation, focus, contrast, chart labels and non-color status communication.

Dependency: T7 and T8.

### T10 — Verification and portfolio readiness (M)

Run formula tests, filter/comparison tests, alert edge cases, build checks and browser QA. Confirm no source identifiers, no external runtime fetches and correct public-demo behavior.

Dependency: T9.

## Sequencing strategy

Domain correctness comes before visual integration. T2–T4 are the highest analytical risk and should be verified independently. T5 can proceed in parallel conceptually but remains a single implementation stream. UI composition starts only after the shared view model is stable.

## Risks

- Workbook extraction may reveal inconsistent columns or undocumented definitions.
- Synthetic extension may create visually smooth data; anomaly fixtures must remain intentional and explainable.
- ACOS target and break-even ACOS may diverge; the UI must label them separately.
- Chart libraries can introduce external dependencies; all runtime assets must be bundled for offline use.

## Definition of done for Planning

- Every implementation task has a dependency and verification condition.
- No task requires live platform access.
- No task authorizes changing the source workbook.
- SDE receives the ordered plan and Senior Engineer approach notes.
