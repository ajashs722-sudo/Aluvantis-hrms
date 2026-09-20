import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Employee,
  Shift,
  KPIMetric,
  KPIManualEntry,
  KPIResult,
  UserRole,
  PayrollRecord,
} from '../types';
import {
  DEFAULT_KPI_METRICS,
  computeEmployeeKPI,
  validateMetricWeights,
  syncKPIBonusToPayroll,
} from '../lib/kpi';

const STORAGE_METRICS_KEY = 'aluvantis_kpi_metrics_v2';
const STORAGE_MANUAL_KEY = 'aluvantis_kpi_manual_v2';
const STORAGE_RESULTS_KEY = 'aluvantis_kpi_results_v2';

export function useKPI(
  employees: Employee[],
  shifts: Shift[],
  currentUserRole: UserRole,
  currentEmployeeId?: number,
  payrollRecords: PayrollRecord[] = [],
  onUpdatePayroll?: (updated: PayrollRecord[]) => void
) {
  // Load saved metrics or seed
  const [metrics, setMetrics] = useState<KPIMetric[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_METRICS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_KPI_METRICS;
  });

  const [manualEntries, setManualEntries] = useState<KPIManualEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MANUAL_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-09');
  const [isComputing, setIsComputing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Save metrics to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_METRICS_KEY, JSON.stringify(metrics));
  }, [metrics]);

  // Save manual entries
  useEffect(() => {
    localStorage.setItem(STORAGE_MANUAL_KEY, JSON.stringify(manualEntries));
  }, [manualEntries]);

  // RBAC visible employees
  const accessibleEmployees = useMemo(() => {
    if (currentUserRole === 'admin' || currentUserRole === 'hr') {
      return employees;
    }
    if (currentUserRole === 'manager') {
      return employees.filter(
        (e) => e.manager_id === currentEmployeeId || e.id === currentEmployeeId
      );
    }
    // Employee sees only self
    return employees.filter((e) => e.id === (currentEmployeeId || employees[0]?.id));
  }, [employees, currentUserRole, currentEmployeeId]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(() => {
    return accessibleEmployees[0]?.id || employees[0]?.id || 1;
  });

  useEffect(() => {
    if (accessibleEmployees.length > 0 && !accessibleEmployees.find((e) => e.id === selectedEmployeeId)) {
      setSelectedEmployeeId(accessibleEmployees[0].id);
    }
  }, [accessibleEmployees, selectedEmployeeId]);

  // Compute results for selected employee across periods
  const currentResult: KPIResult | null = useMemo(() => {
    const emp = employees.find((e) => e.id === selectedEmployeeId);
    if (!emp) return null;
    return computeEmployeeKPI(emp, metrics, selectedPeriod, shifts, manualEntries);
  }, [selectedEmployeeId, employees, metrics, selectedPeriod, shifts, manualEntries]);

  // History periods (last 6 months)
  const historyData = useMemo(() => {
    const emp = employees.find((e) => e.id === selectedEmployeeId);
    if (!emp) return [];

    const periods = [
      '2026-04',
      '2026-05',
      '2026-06',
      '2026-07',
      '2026-08',
      '2026-09',
    ];

    return periods.map((periodKey) => {
      const res = computeEmployeeKPI(emp, metrics, periodKey, shifts, manualEntries);
      const [y, m] = periodKey.split('-');
      const monthNames = ['', 'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
      return {
        period: `${monthNames[parseInt(m, 10)]} ${y.slice(2)}`,
        periodKey,
        score: res.total,
        bonus: res.bonus_percent,
      };
    });
  }, [selectedEmployeeId, employees, metrics, shifts, manualEntries]);

  // Metric CRUD
  const saveMetric = useCallback(
    (metric: KPIMetric) => {
      const existing = metrics.find((m) => m.id === metric.id);
      let updatedList: KPIMetric[];
      if (existing) {
        updatedList = metrics.map((m) => (m.id === metric.id ? metric : m));
      } else {
        updatedList = [...metrics, metric];
      }

      const validation = validateMetricWeights(updatedList);
      if (!validation.valid) {
        showToast(validation.message);
        return false;
      }

      setMetrics(updatedList);
      showToast('KPI ko‘rsatkichi saqlandi');
      return true;
    },
    [metrics, showToast]
  );

  const deleteMetric = useCallback(
    (id: number) => {
      const updated = metrics.filter((m) => m.id !== id);
      const validation = validateMetricWeights(updated);
      if (!validation.valid && updated.length > 0) {
        showToast(validation.message);
        return false;
      }
      setMetrics(updated);
      showToast('Ko‘rsatkich o‘chirildi');
      return true;
    },
    [metrics, showToast]
  );

  // Compute trigger for all active employees
  const runBatchCompute = useCallback(() => {
    setIsComputing(true);
    setTimeout(() => {
      let updatedPayroll = [...payrollRecords];
      employees.forEach((emp) => {
        const res = computeEmployeeKPI(emp, metrics, selectedPeriod, shifts, manualEntries);
        updatedPayroll = syncKPIBonusToPayroll(res, emp, updatedPayroll);
      });

      if (onUpdatePayroll) {
        onUpdatePayroll(updatedPayroll);
      }

      setIsComputing(false);
      showToast('Barcha xodimlar KPI natijalari hisoblandi va Oylik qaydnomasiga DRAFT sifatida kiritildi');
    }, 600);
  }, [employees, metrics, selectedPeriod, shifts, manualEntries, payrollRecords, onUpdatePayroll, showToast]);

  return {
    metrics,
    selectedPeriod,
    setSelectedPeriod,
    selectedEmployeeId,
    setSelectedEmployeeId,
    accessibleEmployees,
    currentResult,
    historyData,
    isComputing,
    toastMessage,
    saveMetric,
    deleteMetric,
    runBatchCompute,
    showToast,
  };
}
