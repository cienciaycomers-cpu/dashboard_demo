# Senior Engineer approach: paid-media-dashboard

## Implementation approach by task

### T1 — Baseline

Use React + TypeScript + Vite with strict TypeScript settings and local scripts for build, type-check and tests. Keep the initial shell minimal so the first verification is fast.

### T2 — Dataset

Define a versioned domain type for daily campaign facts. Use a separate adapter/fixture module for source-to-demo transformation. Validate required fields and keep nullable economics explicit. Do not make components aware of workbook columns.

### T3 — Metrics

Use pure functions with small input/output types. Centralize safe division. Return a discriminated result for calculated, missing-input and zero-denominator states. Test formulas with hand-calculated fixtures and boundary cases.

### T4 — Comparisons and alerts

Represent a period as start date, end date and elapsed-day count. Build the previous-period window from the selected period rather than hardcoding month lengths. Keep alert rules as data-driven evaluators with severity and explanation.

### T5 — Shell

Create tokens for background, surface, text, semantic accents, spacing and focus. Use semantic HTML and CSS media queries. Keep chart colors aligned with acquisition, conversion and profitability semantics.

### T6 — State

Use a single typed filter state and derive filtered rows with memoized selectors. Keep the raw fixture immutable. Ensure the month selector and global filters produce the same analysis context for every section.

### T7 — Sections

Build each section around a typed view model rather than passing raw rows into charts. Start with KPI cards and tables, then add charts. Avoid misleading dual axes; use separate scales or normalized comparisons when necessary.

### T8 — Detail

Use a dismissible contextual panel controlled by selected campaign/alert state. Preserve filters when opening and closing detail. Tooltips should explain formulas and benchmark semantics without hiding essential information.

### T9 — Responsive/accessibility

Test keyboard paths, focus states, contrast and mobile overflow. Provide text summaries or tables for chart insights. Do not rely on color alone for alert severity or performance state.

### T10 — Verification

Run unit tests for formulas and analysis engines, component tests for filters and empty states, build/type checks and browser QA. Include an identifier scan for source brand/campaign names and a network check confirming no runtime data fetch.

## Key gotchas

- ACOS uses gross attributed revenue; contribution margin uses net revenue and non-ad costs. Do not silently mix denominators.
- A partial current month must compare only the same elapsed days in the prior month.
- Missing values are not zeros.
- A zero-conversion campaign can have undefined CPA; show not-calculable rather than infinity.
- A missing margin input makes break-even ACOS unavailable.

## SDE handoff

Start with T1, then T2–T4. Do not begin UI sections until the domain engines have passing tests and their view-model contracts are stable.
