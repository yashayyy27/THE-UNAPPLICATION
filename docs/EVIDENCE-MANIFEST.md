# Evidence manifest

Machine-readable source: [public/evidence-manifest.json](../public/evidence-manifest.json). All upstream artifact links are pinned to `35f1aff81c166215496b0f0b2b041db7a4c0360e`.

## E01 / SQL you can trace.

REPRODUCIBLE SOURCE. An ordered, session-grain funnel. Deduplication and transaction revenue have separate definitions.

[Primary artifact](https://github.com/yashayyy27/exclamation-ai/blob/35f1aff81c166215496b0f0b2b041db7a4c0360e/data/sql/sessions.sql) · [Python pipeline](https://github.com/yashayyy27/exclamation-ai/blob/35f1aff81c166215496b0f0b2b041db7a4c0360e/services/api/analytics.py)

Limit: The public dashboard uses invented events; it is not client performance.

## E02 / A real Google reconciliation.

DOCUMENTED HISTORICAL RUN. 22,096 public historical events. Nine reconciled checks. One bounded day, 1 January 2021 UTC.

[Primary artifact](https://github.com/yashayyy27/exclamation-ai/blob/35f1aff81c166215496b0f0b2b041db7a4c0360e/docs/bigquery-analysis-2026-10-25.md) · [Reconciliation receipt](https://github.com/yashayyy27/exclamation-ai/blob/35f1aff81c166215496b0f0b2b041db7a4c0360e/docs/evidence/bigquery-console-20261025-reconciliation.json)

Limit: Console execution is documented upstream. SDK authentication remains unverified.

## E03 / Measurement, with receipts.

DOCUMENTED TEST DELIVERY. Eight event types and two distinct demo purchases received through unpublished GTM Preview → GA4 DebugView.

[Primary artifact](https://github.com/yashayyy27/exclamation-ai/blob/35f1aff81c166215496b0f0b2b041db7a4c0360e/docs/google-tracking-2026-10-26.md) · [Event contracts](https://github.com/yashayyy27/exclamation-ai/blob/35f1aff81c166215496b0f0b2b041db7a4c0360e/apps/web/src/measurement.ts)

Limit: Owner test property. Public tracking is disabled; daily export arrival is unverified.

## E04 / A failure worth showing.

DETERMINISTIC ADVERSARIAL TEST. An evidence validator accepted a duplicate metric substitution. The recorded replay shows the repaired gate rejecting it.

[Primary artifact](https://github.com/yashayyy27/exclamation-ai/blob/35f1aff81c166215496b0f0b2b041db7a4c0360e/docs/failure-analysis.md) · [Inspect the replay](https://github.com/yashayyy27/exclamation-ai/blob/35f1aff81c166215496b0f0b2b041db7a4c0360e/docs/evidence/validator-replay.json)

Limit: Fixture and mocked-provider results. No live model quality or client uplift is claimed.

The current synthetic scenario and every sensitivity estimate are demonstrations, not professional achievements. See RESEARCH.md for classification A–E and factual gaps.
