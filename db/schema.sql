-- OpenVision Academy PostgreSQL schema (initial)

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tenants
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  domain text,
  logo_url text,
  plan text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  email text NOT NULL,
  email_verified boolean DEFAULT false,
  password_hash text,
  display_name text,
  avatar_url text,
  mfa_enabled boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, email)
);
CREATE INDEX idx_users_tenant ON users(tenant_id);

-- Roles & Permissions
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  resource text,
  action text,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role_id)
);

-- Courses, modules, lessons, resources
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  instructor_id uuid REFERENCES users(id),
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  published boolean DEFAULT false,
  visibility text DEFAULT 'private',
  price numeric(12,2) DEFAULT 0,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, slug)
);

CREATE TABLE modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_type text,
  content jsonb,
  duration_seconds integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  type text,
  url text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enrollments
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  progress numeric(5,2) DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, course_id)
);

-- Payments/Transactions/Invoices
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  enrollment_id uuid REFERENCES enrollments(id),
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'AOA',
  gateway text,
  gateway_reference text,
  status text DEFAULT 'pending',
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  enrollment_id uuid REFERENCES enrollments(id),
  amount numeric(12,2) NOT NULL,
  issued_at timestamptz DEFAULT now(),
  pdf_url text,
  metadata jsonb
);

-- Certificates
CREATE TABLE certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  enrollment_id uuid REFERENCES enrollments(id) UNIQUE,
  code text UNIQUE NOT NULL,
  qr_code_url text,
  issued_at timestamptz DEFAULT now(),
  metadata jsonb
);

-- Messaging & Notifications
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  sender_id uuid REFERENCES users(id),
  recipient_id uuid REFERENCES users(id),
  content text,
  attachments jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  user_id uuid REFERENCES users(id),
  type text,
  payload jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Audit & Email logs
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  action text,
  resource text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  to_email text,
  subject text,
  template text,
  status text,
  response jsonb,
  created_at timestamptz DEFAULT now()
);

-- Analytics (event sink)
CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  event_name text,
  properties jsonb,
  occurred_at timestamptz DEFAULT now()
);

-- Configurations
CREATE TABLE configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  key text,
  value jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_courses_tenant ON courses(tenant_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_payments_tenant ON payments(tenant_id);

-- Triggers to keep updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to tables with updated_at
DO $$
BEGIN
  EXECUTE 'CREATE TRIGGER trg_set_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp()';
  EXECUTE 'CREATE TRIGGER trg_set_timestamp_courses BEFORE UPDATE ON courses FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp()';
  EXECUTE 'CREATE TRIGGER trg_set_timestamp_enrollments BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp()';
EXCEPTION WHEN duplicate_object THEN NULL;
END;
$$;
