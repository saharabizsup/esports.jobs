# Infrastructure Monitoring, Logging, and Alerting

This directory captures the baseline operational tooling for the esports.jobs
platform. The configuration is intentionally lightweight so it can be adapted to
most container-based deployment strategies.

## Layout

- `monitoring/` – Prometheus scraping rules and Grafana dashboard stubs focused
  on application performance metrics emitted by the XP services.
- `logging/` – Vector pipeline that ships structured logs to an OpenSearch
  domain while maintaining a local retention buffer.
- `alerting/` – Alertmanager policies that translate SLO regressions and error
  spikes into actionable pager and chat notifications.

## Getting Started

1. Update secrets (API keys, webhook URLs, etc.) via your orchestration
   platform's secret manager. Placeholder environment variables are documented
   inline.
2. Mount the configuration maps into your observability stack. When using
   Kubernetes, convert each file into a `ConfigMap` and annotate your deployments
   accordingly.
3. Review retention windows and rate limits to ensure the defaults align with
   your budget and compliance constraints.

## Security Considerations

- All external integrations (Slack, PagerDuty, OpenSearch) must be protected via
  TLS and scoped API keys.
- The logging pipeline redacts common PII fields by default; extend the
  `redact_fields` list in `logging/vector.toml` as your data model evolves.
- Alert destinations should use dedicated credentials with rotation managed by
  your secret store.

## Extending the Stack

- Add synthetic probes by defining additional Prometheus jobs that scrape a
  `/healthz` or `/readyz` endpoint exposed by the API.
- Introduce tracing by deploying an OpenTelemetry collector and exporting spans
  to your preferred backend; the Vector pipeline already ships JSON logs with
  trace identifiers when available.
- Align dashboard thresholds with product SLOs so alerts fire on user-impacting
  regressions rather than transient noise.
