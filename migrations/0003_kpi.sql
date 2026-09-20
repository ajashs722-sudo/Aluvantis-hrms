-- Migration 0003: KPI Engine and Department Canvas Coordinates
ALTER TABLE departments ADD COLUMN x REAL;
ALTER TABLE departments ADD COLUMN y REAL;

CREATE TABLE IF NOT EXISTS kpi_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL REFERENCES companies(id),
  name TEXT NOT NULL,
  source TEXT NOT NULL CHECK(source IN ('attendance','sales','tasks','rating','manual')),
  target REAL NOT NULL,
  direction TEXT NOT NULL DEFAULT 'up' CHECK(direction IN ('up','down')),
  weight REAL NOT NULL,
  period TEXT NOT NULL DEFAULT 'month',
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS kpi_manual (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  metric_id INTEGER NOT NULL REFERENCES kpi_metrics(id),
  period_key TEXT NOT NULL,
  value REAL NOT NULL,
  entered_by INTEGER REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS kpi_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  period_key TEXT NOT NULL,
  total REAL NOT NULL,
  bonus_percent REAL NOT NULL DEFAULT 0,
  breakdown JSON NOT NULL,
  computed_at TEXT DEFAULT (datetime('now')),
  UNIQUE(employee_id, period_key)
);

CREATE INDEX IF NOT EXISTS idx_kpi_results_period ON kpi_results(period_key);
