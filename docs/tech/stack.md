# Tech Stack Assumptions

| Layer | Assumption | Rationale | Open Questions |
| --- | --- | --- | --- |
| Frontend | Next.js (React + TypeScript) | Mature ecosystem, SEO-friendly for job listings, supports rapid iteration with SSR/ISR. | Validate team familiarity and hosting budget (Vercel vs. self-hosted). |
| Backend | Node.js with NestJS | Opinionated structure for modular services, TypeScript alignment with frontend. | Consider Go or Python for specific services (analytics, ML). |
| API | REST with GraphQL overlay for talent profiles | REST covers core CRUD; GraphQL enables flexible profile querying. | Confirm performance implications and caching strategy. |
| Authentication | Auth0 or Clerk | Fast to market with enterprise-grade security and social login support. | Evaluate cost vs. building custom auth. |
| Database | PostgreSQL (managed, e.g., Supabase or RDS) | Strong relational model for jobs, applications, and orgs; JSON support for metadata. | Assess need for Redis cache or search engine (Meilisearch/Algolia). |
| Storage | AWS S3 or Supabase Storage | Handles resumes, media portfolios securely with CDN. | Decide on region and compliance requirements. |
| Infrastructure | Vercel for frontend, AWS for backend services | Simplifies deployment while leveraging AWS flexibility. | Determine networking/security architecture and IaC tooling (Terraform/CDK). |
| Analytics | PostHog + Segment | Product analytics and event routing for experimentation. | Ensure privacy compliance and cost controls. |
| DevOps | GitHub Actions CI/CD | Seamless integration with repo, testing, linting, deployments. | Extend to cover infrastructure provisioning workflows. |

## Next Steps
- Validate assumptions with engineering leadership.
- Prototype core flows to test performance and developer experience.
- Document alternative stacks if requirements shift (e.g., real-time communications).
