ERD (texto) — Entidades principais e relacionamentos

Principais entidades
- tenants (1) —< users (N)
- users (1) —< user_roles (N) >— roles (1)
- roles (1) —< role_permissions (N) >— permissions (1)
- tenants (1) —< courses (N)
- courses (1) —< modules (N)
- modules (1) —< lessons (N)
- lessons (1) —< resources (N)
- users (1) —< enrollments (N) >— courses (1)
- users (instrutor) (1) —< courses (N) (owner)
- courses (1) —< certificates (N)
- users (1) —< messages (N) —> users (1) (conversations)
- payments (N) —> enrollments (1) / invoices (1)

Atributos essenciais (resumido)
- tenants: id, name, slug, domain, logo, plan, config
- users: id, tenant_id, email, password_hash, display_name, role(s), metadata
- roles: id, name, description
- permissions: id, name, resource, action
- courses: id, tenant_id, title, description, published, visibility, price
- modules: id, course_id, title, order
- lessons: id, module_id, title, content_type (video/pdf/quiz), duration
- resources: id, lesson_id, type, url, metadata
- enrollments: id, user_id, course_id, status, progress, started_at, completed_at
- payments/transactions: id, enrollment_id, amount, status, gateway, reference
- certificates: id, enrollment_id, code, issued_at, qr_code_url

Notas
- Todas as tabelas core incluem `tenant_id` para multi-tenancy scoping (quando aplicável).
- Use chaves UUID e timestamps `created_at`/`updated_at` em todas as linhas.
- For large tenants evaluate separate schemas or DBs.
