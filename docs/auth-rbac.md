Autenticação e RBAC — Resumo de Design

Autenticação
- Providers: Email/password, Google, GitHub, LinkedIn (via Supabase OAuth).
- Session model: short-lived JWT access token + long-lived refresh token stored in secure HTTP-only cookie.
- MFA: TOTP + recovery codes; optional SMS/Push via provider.
- Device/session management: store active sessions table with device metadata and allow revocation.

Fluxo de login (email)
1. User submits email+password to Auth endpoint.
2. Verify password; emit access JWT (expires ~15m) and refresh token (7-30d).
3. Store refresh token fingerprint hashed in DB, linked to session record.
4. On refresh, validate fingerprint and rotate refresh token (rotate+revoke previous).
5. On logout, revoke refresh token and delete session record.

OAuth flows
- Use Supabase/OAuth providers; link provider identity to user account; support account linking.

RBAC model
- Core tables: `roles`, `permissions`, `role_permissions`, `user_roles`.
- Roles are tenant-scoped where applicable.
- Permission model: resource + action (e.g., course:create, course:publish).
- Enforcement: middleware checks user roles→permissions for protected routes.

Supabase RLS
- Use RLS to enforce tenant isolation and row-level policies (e.g., allow select on courses where tenant_id = current_setting('x_tenant')::uuid).
- Set `x-hasura-tenant`-like header at request time or use JWT claims to inject `tenant_id` in policy context.

Policies & middleware
- For serverless APIs (Vercel), validate JWT, extract tenant_id and user_id, and attach to request context.
- Middleware should check permissions using a cached permission matrix for low-latency.
- Sensitive operations require additional checks (ownership checks for course edits).

Administrative roles
- SUPER_ADMIN: global scope, manage tenants and platform-level configs.
- ADMIN: tenant-level full control.
- DIRETOR_ACADEMICO / INSTRUTOR / ASSISTENTE / FINANCEIRO / SUPORTE / EMPRESA / PARCEIRO / ESTUDANTE: domain-specific permissions.

Auditing
- All authorization decisions and sensitive actions are logged to `audit_logs` with metadata.

Notes
- Prefer least privilege; default deny.
- Implement permission caching in Redis for speed.
- Regularly rotate keys and enforce strong password policy.
