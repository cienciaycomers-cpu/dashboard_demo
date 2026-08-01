# Staff Engineer decision: paid-media-dashboard

## Recommended implementation standards

### Type and module boundaries

- Define typed domain records for daily campaign facts and typed view models for each dashboard section.
- Keep metric formulas in pure functions with no browser or React dependency.
- Keep filter state in one state boundary; derive filtered data rather than mutating the source dataset.
- Keep charts, tables, KPI cards and alert rows presentational where possible.

### Data quality conventions

- Use `null` or an explicit status for unavailable values; never use `0` as a substitute for missing data.
- Validate row shape before calculations.
- Preserve source-of-record metadata internally without rendering sensitive identifiers.
- Make formulas and benchmark constants discoverable through tooltips or a methodology panel.

### Interaction standards

- Every global filter updates all sections from the same derived context.
- Empty states explain whether there is no activity or whether data is unavailable.
- Alert colors must be paired with text and icons for accessibility.
- Detail panels must be dismissible and must preserve the selected filter context.

### Performance and accessibility

- Precompute or memoize derived aggregates for the selected context.
- Avoid unnecessary full-page rerenders when only a filter changes.
- Use semantic headings, keyboard-accessible controls and visible focus states.
- Ensure readable contrast in the dark theme and provide text alternatives for chart insights.

### Verification expectations

- Unit-test every metric formula and denominator edge case.
- Test period comparison with partial months and month boundaries.
- Test filters in combination across platform, campaign and objective.
- Test anomaly severity transitions and empty states.
- Verify responsive layout at desktop and smaller viewport widths.

## What not to change

- No backend, authentication, live connectors or export system in the initial version.
- No generic design system abstraction beyond the components required by this dashboard.
- No unrelated refactoring or speculative infrastructure.

## Adoption path

Implement the domain model and pure engines first, then bind them to the UI. This allows metric correctness to be verified independently before visual polish and deployment.
