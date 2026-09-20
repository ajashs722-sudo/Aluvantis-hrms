-- Migration: 0001_init.sql
-- Aluvantis HR — Cloudflare D1 Relational Schema & Seed Data

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,          -- admin|hr|manager|employee|cashier|storekeeper
  description TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,          -- e.g. payroll.approve
  description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL REFERENCES roles(id),
  permission_id INTEGER NOT NULL REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  tax_id TEXT,
  logo_key TEXT,                       -- R2 key
  settings JSON DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER REFERENCES companies(id),
  google_sub TEXT UNIQUE NOT NULL,     -- Google subject id
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_key TEXT,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  telegram_id TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL REFERENCES companies(id),
  user_id INTEGER UNIQUE REFERENCES users(id),
  full_name TEXT NOT NULL,
  position TEXT,
  hire_date TEXT NOT NULL,
  base_salary INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  shift_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  check_in TEXT,
  check_out TEXT,
  UNIQUE(employee_id, shift_date)
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  approved_by INTEGER REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payroll (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  gross INTEGER NOT NULL,
  jshds INTEGER NOT NULL,
  pension INTEGER NOT NULL,
  social INTEGER NOT NULL,
  net INTEGER NOT NULL,
  status TEXT DEFAULT 'draft',
  payslip_key TEXT,
  UNIQUE(employee_id, month, year)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- SEED roles
INSERT OR IGNORE INTO roles (id, name, description) VALUES
  (1, 'admin', 'To''liq ruxsat'),
  (2, 'hr', 'Kadrlar va oylik'),
  (3, 'manager', 'O''z jamoasi'),
  (4, 'employee', 'Self-service'),
  (5, 'cashier', 'Davomat'),
  (6, 'storekeeper', 'Davomat');

-- SEED permissions
INSERT OR IGNORE INTO permissions (id, code, description) VALUES
  (1, 'employees.read', 'Xodimlar ro''yxatini ko''rish'),
  (2, 'employees.write', 'Xodimlarni tahrirlash va qo''shish'),
  (3, 'shifts.read', 'Smena jadvalini ko''rish'),
  (4, 'shifts.write', 'Smenalarni belgilash va o''zgartirish'),
  (5, 'leave.approve', 'Ta''til arizalarini tasdiqlash'),
  (6, 'leave.request', 'Ta''til arizasi yuborish'),
  (7, 'payroll.read', 'Oylik hisob-kitoblarini ko''rish'),
  (8, 'payroll.approve', 'Oylikni tasdiqlash va to''lash'),
  (9, 'payroll.write', 'Oylik hisob-kitobini yaratish'),
  (10, 'reports.read', 'Soliq va 1C hisobotlarini yuklab olish'),
  (11, 'settings.write', 'Korxona sozlamalarini o''zgartirish'),
  (12, 'audit.read', 'Xavfsizlik audit jurnallarini ko''rish');

-- SEED role_permissions
-- admin = all (1..12)
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12),
  -- hr = employees.*, payroll.read/write, reports, leave.approve
  (2, 1), (2, 2), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
  -- manager = shifts.*, leave.approve, reports(read own)
  (3, 1), (3, 3), (3, 4), (3, 5), (3, 6), (3, 10),
  -- employee = leave.request, payroll.read(own)
  (4, 6), (4, 7),
  -- cashier/storekeeper = shifts.read(own)+check-in
  (5, 3), (6, 3);

-- INDICES
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_payroll_period ON payroll(month, year);
