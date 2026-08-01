# CTO decision: paid-media-dashboard

## Decision

Build a public, client-side interactive web application with a controlled local dataset for the Faithis demo. Do not connect Google Ads or Meta Ads in the first version.

## Business justification

The goal is to demonstrate the user's paid-media judgment, product thinking and technical execution in a portfolio context. A live connector would shift effort toward credentials, refresh behavior, platform APIs, privacy and operational maintenance rather than the core story: acquisition, conversion, ACOS, contribution margin and actionable anomalies.

## Alternatives considered

### Static visual mockup

Lowest effort and lowest risk, but does not prove filter behavior, period comparisons or interactive analysis.

### Local interactive web app — selected

Best balance of time-to-value, visual control, demonstrable technical depth and reversibility. The dataset can be regenerated or replaced later without changing the product surface.

### Live BI/API integration

More operationally realistic, but introduces account access, credentials, API limits, data privacy, refresh monitoring and platform discrepancies. Deferred until a real product need exists.

## Technical direction

- Public web app with no authentication.
- Local or bundled data for the demo.
- Responsive desktop-first experience.
- No external data fetch required for the initial portfolio version.
- Architecture should isolate the metric model from the presentation layer so a future connector can replace the data adapter.

## Risks and mitigations

- **Risk:** Modeled periods could be mistaken for client facts. **Mitigation:** Present the experience as a client demo and avoid source brand/campaign identifiers; retain internal provenance in the data model and methodology.
- **Risk:** ACOS and margin definitions could be inconsistent. **Mitigation:** Centralize formulas and expose concise metric explanations.
- **Risk:** Dark visual treatment could reduce accessibility. **Mitigation:** Validate contrast, labels and non-color status indicators.
- **Risk:** Scope expands into a full reporting platform. **Mitigation:** Keep live integrations, exports, auth and multi-client support out of P0.

## Success criteria

- A visitor can understand the current month's performance within one screen.
- Filters and month selection update all dependent views consistently.
- The app demonstrates the distinction between ACOS target and break-even ACOS.
- The demo can be deployed publicly without exposing source credentials or identifiers.

## Review point

Revisit the live connector decision only after the local interactive version is validated and a concrete need for fresh data is identified.
