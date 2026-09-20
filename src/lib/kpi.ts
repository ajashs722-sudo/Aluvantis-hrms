import {
  Employee,
  Shift,
  KPIMetric,
  KPIManualEntry,
  KPIResult,
  KPIMetricResult,
  PayrollRecord,
} from '../types';

export const DEFAULT_KPI_METRICS: KPIMetric[] = [
  {
    id: 1,
    company_id: 1,
    name: 'Davomat intizomi',
    source: 'attendance',
    target: 95,
    direction: 'up',
    weight: 30,
    period: 'month',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    company_id: 1,
    name: 'Savdo rejasi',
    source: 'sales',
    target: 100,
    direction: 'up',
    weight: 40,
    period: 'month',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 3,
    company_id: 1,
    name: 'Vazifalar ijrosi',
    source: 'tasks',
    target: 100,
    direction: 'up',
    weight: 20,
    period: 'month',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 4,
    company_id: 1,
    name: 'Mijoz bahosi',
    source: 'rating',
    target: 4.5,
    direction: 'up',
    weight: 10,
    period: 'month',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const BONUS_TIERS = [
  { min: 120, max: Infinity, percent: 15, label: '120 ball → +15% mukofot' },
  { min: 110, max: 119.99, percent: 10, label: '110–119 ball → +10% mukofot' },
  { min: 100, max: 109.99, percent: 5, label: '100–109 ball → +5% mukofot' },
  { min: 0, max: 99.99, percent: 0, label: '<100 ball → 0% (reja bajarilmadi)' },
];

export function computeMetricScore(
  value: number,
  target: number,
  direction: 'up' | 'down'
): number {
  if (target <= 0) return 100;
  const ratio = direction === 'up' ? value / target : target / Math.max(0.001, value);
  const clamped = Math.min(1.2, Math.max(0, ratio));
  return Number((clamped * 100).toFixed(1));
}

export function mapScoreToBonusPercent(totalScore: number): number {
  if (totalScore >= 120) return 15;
  if (totalScore >= 110) return 10;
  if (totalScore >= 100) return 5;
  return 0;
}

export function validateMetricWeights(metrics: KPIMetric[]): {
  valid: boolean;
  sum: number;
  message: string;
} {
  const activeMetrics = metrics.filter((m) => m.active);
  const sum = activeMetrics.reduce((acc, m) => acc + Number(m.weight || 0), 0);
  const valid = Math.abs(sum - 100) < 0.01;
  return {
    valid,
    sum: Number(sum.toFixed(1)),
    message: valid ? 'Og‘irliklar me’yorda (100%)' : "Og'irliklar yig'indisi 100% bo'lishi kerak",
  };
}

export function extractMetricActualValue(
  metric: KPIMetric,
  employee: Employee,
  periodKey: string,
  shifts: Shift[] = [],
  manualEntries: KPIManualEntry[] = []
): number {
  // Check manual overrides first
  const manual = manualEntries.find(
    (m) => m.employee_id === employee.id && m.metric_id === metric.id && m.period_key === periodKey
  );
  if (manual !== undefined) return manual.value;

  // Source-specific logic
  if (metric.source === 'attendance') {
    const empShifts = shifts.filter((s) => s.employee_id === employee.id);
    if (empShifts.length === 0) return 96.0; // standard default
    const completed = empShifts.filter(
      (s) => s.status === 'checked_out' || s.status === 'checked_in'
    ).length;
    return Number(((completed / empShifts.length) * 100).toFixed(1));
  }

  if (metric.source === 'sales') {
    // Generate deterministic yet realistic baseline based on employee ID
    const seed = (employee.id * 17) % 30;
    return 95 + seed; // 95% - 124%
  }

  if (metric.source === 'tasks') {
    const seed = (employee.id * 23) % 25;
    return 88 + seed; // 88% - 112%
  }

  if (metric.source === 'rating') {
    const seed = ((employee.id * 13) % 10) / 10;
    return Number((4.2 + (seed * 0.8)).toFixed(1)); // 4.2 - 5.0
  }

  return metric.target;
}

export function computeEmployeeKPI(
  employee: Employee,
  metrics: KPIMetric[],
  periodKey: string,
  shifts: Shift[] = [],
  manualEntries: KPIManualEntry[] = []
): KPIResult {
  const activeMetrics = metrics.filter((m) => m.active);
  let totalWeightedScore = 0;

  const breakdown: KPIMetricResult[] = activeMetrics.map((metric) => {
    const actual_value = extractMetricActualValue(
      metric,
      employee,
      periodKey,
      shifts,
      manualEntries
    );
    const score = computeMetricScore(actual_value, metric.target, metric.direction);
    const weighted_score = Number(((score * metric.weight) / 100).toFixed(2));
    totalWeightedScore += weighted_score;

    return {
      metric_id: metric.id,
      name: metric.name,
      source: metric.source,
      target: metric.target,
      direction: metric.direction,
      weight: metric.weight,
      actual_value,
      score,
      weighted_score,
      unit: metric.source === 'rating' ? 'ball' : '%',
    };
  });

  const total = Number(totalWeightedScore.toFixed(1));
  const bonus_percent = mapScoreToBonusPercent(total);
  const bonus_amount = Number(((employee.base_salary * bonus_percent) / 100).toFixed(0));

  return {
    employee_id: employee.id,
    period_key: periodKey,
    total,
    bonus_percent,
    bonus_amount,
    breakdown,
    computed_at: new Date().toISOString(),
  };
}

export function syncKPIBonusToPayroll(
  kpiResult: KPIResult,
  employee: Employee,
  payrollRecords: PayrollRecord[]
): PayrollRecord[] {
  const [yearStr, monthStr] = kpiResult.period_key.split('-');
  const year = parseInt(yearStr, 10) || 2026;
  const month = parseInt(monthStr, 10) || 9;

  const existingIndex = payrollRecords.findIndex(
    (p) => p.employee_id === employee.id && p.year === year && p.month === month
  );

  const bonusPay = kpiResult.bonus_amount || 0;

  if (existingIndex >= 0) {
    const rec = payrollRecords[existingIndex];
    // Keep as DRAFT and update bonus
    const updatedGross = rec.base_salary + bonusPay + (rec.allowances || 0) + (rec.overtime_pay || 0);
    const taxJshds = Math.round(updatedGross * 0.12);
    const taxPensionEmp = Math.round(updatedGross * 0.001);
    const taxSocial = Math.round(updatedGross * 0.12);
    const netSalary = updatedGross - taxJshds - taxPensionEmp;

    const updated: PayrollRecord = {
      ...rec,
      bonuses: bonusPay,
      bonus_pay: bonusPay,
      gross_salary: updatedGross,
      tax_jshds: taxJshds,
      tax_pension_employee: taxPensionEmp,
      tax_social: taxSocial,
      net_salary: netSalary,
      status: 'draft', // MUST remain DRAFT (never auto-paid)
    };

    const copy = [...payrollRecords];
    copy[existingIndex] = updated;
    return copy;
  }

  return payrollRecords;
}
