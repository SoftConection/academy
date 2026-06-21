OpenVision Academy — Arquitetura de Alto Nível

Visão resumida
- Plataforma multi-tenant de ensino corporativo focada no mercado angolano, escalável globalmente.
- Principais requisitos: Security First, Scalability First, Fail-First, Mobile/Performance/Accessibility First, Cloud Native, Event Driven, AI Ready.

Componentes principais
- Frontend: Next.js 15 + React 19 + TypeScript + TailwindCSS + shadcn/ui.
- Backend: Supabase (Postgres + Auth + Realtime) + Node serverless functions (Vercel Edge/Serverless) quando necessário.
- ORM: Prisma para modelagem e migrations.
- Storage: Supabase Storage (objetos), CDN via Cloudflare.
- Email: Resend for transactional emails.
- Observability: Sentry (errors), Better Stack (logs/alerts), PostHog (analytics).
- Payments: Stripe + local gateways (Multicaixa, EMIS, Unitel Money) via payment microservices.
- Messaging/Eventing: Postgres pub/sub + Redis/Queue (BullMQ) + Dead Letter Queue.

Arquitetura e fluxos
- Frontend (Vercel) — CDN (Cloudflare) — Edge WAF/Turnstile — API (Supabase + serverless functions).
- Autenticação: Supabase Auth + OAuth providers; session tokens (JWT) + refresh tokens stored securely.
- RBAC: Roles/permissions stored in DB; enforcement via middleware + Supabase RLS policies.
- Tenancy: single database, tenant_id scoping per row (row-level security) and optional separate schemas for large tenants.
- File uploads: Direct-to-storage signed URLs; background processing for transcodes and thumbnails.
- Payments: Orchestrator service receives webhooks, writes transactions, triggers enrollment and receipts generation.

Fail-First patterns
- Retry with exponential backoff for network/external calls.
- Circuit breaker around payment and external APIs.
- Message queues for asynchronous work; dead-letter queue for failed jobs.
- Bulkhead isolation for resource-intensive tasks (transcode, report generation).
- Backup and PITR for Postgres; automated snapshots.

Scalability and performance
- Read replicas for heavy analytics reporting.
- Caching at CDN and application layers (Redis) for hot data.
- Use TanStack Query + SWR patterns on frontend for performant data fetching.

Security
- HTTPS everywhere, secure cookies, HSTS.
- MFA (TOTP + SMS push via provider), device session management.
- Rate limiting via Cloudflare + application guards.
- RLS policies for tenant isolation.
- Encryption at rest for sensitive data, AES-256 for proprietary secrets.

Observability
- Structured logging (JSON) to centralized store.
- Tracing (distributed tracing) integrated with Sentry/Better Stack.
- Health checks, SLIs/SLOs, alerting rules.

CI/CD & DevOps
- GitHub Actions pipelines: lint, test, build, infra plan, deploy.
- Deploy to Vercel for frontend; Supabase managed Postgres for DB.
- IaC (Terraform) for Cloudflare, DNS, and infra outside Supabase/Vercel.

Deliveráveis imediatos
- ERD e DDL para PostgreSQL.
- Prisma schema e migrations.
- Auth & RBAC spec.
- API surface (next steps).

Notas
- Prefer RLS + single DB multi-tenant for simpler ops initially; evaluate separate DB per tenant when scale or security demands.
- Keep GDPR/Local data protection (Angola) compliance in mind for PII.
