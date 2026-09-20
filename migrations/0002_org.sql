-- Migration 0002_org.sql: Tashkiliy tuzilma va bo'limlar jadvali

CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL REFERENCES companies(id),
  name TEXT NOT NULL,
  head_employee_id INTEGER REFERENCES employees(id),
  color TEXT DEFAULT '#C6A15B',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Employee modellariga bo'lim va rahbarni ulash ustunlari
ALTER TABLE employees ADD COLUMN department_id INTEGER REFERENCES departments(id);
ALTER TABLE employees ADD COLUMN manager_id INTEGER REFERENCES employees(id);

CREATE INDEX IF NOT EXISTS idx_emp_dept ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_emp_manager ON employees(manager_id);

-- Demo korxona uchun boshlang'ich bo'limlar urug'i (Seed)
INSERT INTO departments (id, company_id, name, head_employee_id, color, created_at) VALUES
(1, 1, 'Boshqaruv', 1, '#C6A15B', datetime('now')),
(2, 1, 'Ombor', 2, '#3B82F6', datetime('now')),
(3, 1, 'Kassa', 3, '#10B981', datetime('now')),
(4, 1, 'Zal', 4, '#F59E0B', datetime('now')),
(5, 1, 'Oshxona', 5, '#EF4444', datetime('now'));
