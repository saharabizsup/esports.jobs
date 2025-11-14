# Engineering Standards for Esports.Jobs

## Definition of Ready (DoR)
A user story or task is considered **Ready** when:
1. Business value and user outcome are clearly articulated.
2. Acceptance criteria are defined and testable.
3. Dependencies, risks, and non-functional requirements are identified.
4. Designs, mockups, or data requirements are attached where relevant.
5. Story size has been estimated by the delivery team and falls within a single sprint.
6. Success metrics and telemetry needs are noted.

## Definition of Done (DoD)
Work is **Done** when all of the following are true:
1. Code is implemented, peer reviewed, and merged into the main branch.
2. Automated tests (unit, integration, or end-to-end as applicable) are added/updated and passing in CI.
3. Feature flags, configuration, and documentation are in place.
4. Relevant monitoring/alerting has been updated and dashboards reviewed.
5. Product owner has accepted the work in the sprint review or via async demo.
6. Release notes and runbooks are updated if production impact exists.

## Coding Standards
- Follow the language-specific style guides (e.g., TypeScript/React: ESLint + Prettier defaults; Python: PEP 8; Go: gofmt).
- Prefer clear, self-documenting code; use docstrings or comments for complex logic only.
- Write modular, testable functions with single responsibility.
- Keep secrets and credentials out of the codebase; leverage environment variables and secret managers.
- Ensure accessibility (a11y) considerations for front-end work (ARIA labels, keyboard navigation, color contrast).
- Use feature flags for risky or incremental releases.

## PR Review Checklist
Before requesting a review:
- [ ] Confirm the work satisfies the Definition of Done.
- [ ] Run all applicable automated tests locally.
- [ ] Provide a concise summary of changes and screenshots for UI updates.
- [ ] Highlight areas needing extra attention (complex logic, security impact, migrations).
- [ ] Ensure migrations/data changes include rollback steps.
- [ ] Update related documentation, configuration, and tracking tools (Linear tickets).

For reviewers:
- [ ] Validate the change against requirements and acceptance criteria.
- [ ] Review code structure, readability, and adherence to standards.
- [ ] Check test coverage and request additional tests where gaps exist.
- [ ] Assess security, performance, and reliability implications.
- [ ] Verify documentation and release notes are adequate.
- [ ] Confirm the feature is behind flags or has safe rollout plan if necessary.
