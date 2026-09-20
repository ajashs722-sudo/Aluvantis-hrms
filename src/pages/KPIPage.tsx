import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Calculator, Sliders } from 'lucide-react';
import { Employee, Shift, UserRole, PayrollRecord } from '../types';
import { useKPI } from '../hooks/useKPI';
import { KPICalculationTab } from '../components/kpi/KPICalculationTab';
import { KPISettingsTab } from '../components/kpi/KPISettingsTab';

interface KPIPageProps {
  employees: Employee[];
  shifts: Shift[];
  currentUserRole: UserRole;
  currentEmployeeId?: number;
  payrollRecords: PayrollRecord[];
  onUpdatePayroll?: (updated: PayrollRecord[]) => void;
}

export const KPIPage: React.FC<KPIPageProps> = ({
  employees,
  shifts,
  currentUserRole,
  currentEmployeeId,
  payrollRecords,
  onUpdatePayroll,
}) => {
  const [activeTab, setActiveTab] = useState<'calc' | 'settings'>('calc');

  const {
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
  } = useKPI(
    employees,
    shifts,
    currentUserRole,
    currentEmployeeId,
    payrollRecords,
    onUpdatePayroll
  );

  const canManageSettings = currentUserRole === 'admin' || currentUserRole === 'hr';

  return (
    <div className="space-y-4 w-full">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#C6A15B] text-[#14201F] font-bold text-xs shadow-2xl border border-border"
          >
            ✓ {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight flex items-center gap-2.5">
            <Target className="w-6 h-6 sm:w-7 sm:h-7 text-[#0E4F4F] dark:text-[#C6A15B]" />
            <span>KPI va Samaradorlik Boshqaruvi</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Xodimlar natijalari, maqsadli mezonlar va bonuslarni avtomatik hisoblash tizimi
          </p>
        </div>

        {/* Tab Switcher: Two tabs only: Hisob & Sozlash */}
        <div className="p-1 rounded-2xl bg-card border border-border flex items-center text-xs shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('calc')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calc'
                ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Hisob</span>
          </button>

          {canManageSettings && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sozlash</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'calc' && (
            <KPICalculationTab
              employees={accessibleEmployees}
              selectedEmployeeId={selectedEmployeeId}
              onSelectEmployee={setSelectedEmployeeId}
              selectedPeriod={selectedPeriod}
              onSelectPeriod={setSelectedPeriod}
              currentResult={currentResult}
              historyData={historyData}
              userRole={currentUserRole}
              isComputing={isComputing}
              onRunCompute={runBatchCompute}
            />
          )}

          {activeTab === 'settings' && canManageSettings && (
            <KPISettingsTab
              metrics={metrics}
              onSaveMetric={saveMetric}
              onDeleteMetric={deleteMetric}
              onShowToast={showToast}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
