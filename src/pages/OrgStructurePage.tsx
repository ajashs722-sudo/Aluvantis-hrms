import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Network, List, Plus, Grid } from 'lucide-react';
import { Company, UserRole, Employee, Department } from '../types';
import { useOrgStructure } from '../hooks/useOrgStructure';
import { OrgChartView } from '../components/org/OrgChartView';
import { OrgCanvasBuilder } from '../components/org/OrgCanvasBuilder';
import { OrgListView } from '../components/org/OrgListView';
import { DepartmentModal } from '../components/org/DepartmentModal';
import { EmployeeDetailSheet } from '../components/org/EmployeeDetailSheet';
import { canEditOrg } from '../lib/orgService';
import { useLanguage } from '../lib/i18n';

interface OrgStructurePageProps {
  company: Company;
  userRole: UserRole;
  onOpenEmployeeCard?: (empId: number) => void;
}

export const OrgStructurePage: React.FC<OrgStructurePageProps> = ({
  company,
  userRole,
  onOpenEmployeeCard,
}) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'canvas' | 'chart' | 'list'>('canvas');
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    departments,
    employees,
    tree,
    departmentStats,
    addDepartment,
    deleteDepartment,
    setAllDepartments,
    moveEmployee,
    setDepartmentHead,
  } = useOrgStructure(company.name, userRole);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddDept = (name: string, color: string, headId?: number | null) => {
    addDepartment(name, color, headId);
    showToast("Bo‘lim muvaffaqiyatli qo‘shildi");
  };

  const handleDirectAddDept = (dept: Partial<Department>) => {
    addDepartment(dept.name || 'Yangi Bo‘lim', dept.color || '#0E4F4F', dept.head_employee_id);
    showToast("Bo‘lim tuzilmaga qo‘shildi");
  };

  const handleUpdateDeptsList = (depts: Department[]) => {
    setAllDepartments(depts);
    showToast("Tashkiliy tuzilma saqlandi");
  };

  const handleDeleteDept = (id: number) => {
    deleteDepartment(id);
    showToast("Bo‘lim o‘chirildi");
  };

  const handleMoveEmp = (empId: number, deptId: number) => {
    moveEmployee(empId, deptId);
    showToast("Xodim ko‘chirildi");
  };

  const handleSetHead = (deptId: number, empId: number) => {
    setDepartmentHead(deptId, empId);
    showToast("Boshliq yangilandi");
  };

  const canEdit = canEditOrg(userRole);

  return (
    <div
      className={`w-full ${
        viewMode === 'canvas'
          ? 'flex-1 flex flex-col h-[calc(100dvh-130px)] min-h-[520px] overflow-hidden'
          : 'flex-1 flex flex-col min-h-0 px-2 sm:px-6 py-2 space-y-4 pb-28'
      }`}
    >
      {/* Toast Notification */}
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

      {/* Header Bar - Clean & Roomy without overlapping */}
      <div className="border-b border-border pb-2 px-1 sm:px-4 pt-1 shrink-0 space-y-2">
        {/* Main Row: Title & Action Buttons */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Title - Full and Clear, never squished */}
          <div className="flex items-center gap-1.5 shrink-0">
            <h1 className="font-display font-black text-sm sm:text-lg text-foreground tracking-tight whitespace-nowrap">
              {t.org_title || 'Tashkiliy tuzilma'}
            </h1>
            <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/15 text-[#0E4F4F] dark:text-[#C6A15B] whitespace-nowrap">
              {departments.length} ta bo‘lim
            </span>
          </div>

          {/* Action buttons on the right */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Desktop View Switcher */}
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-card border border-border text-xs shadow-xs h-9">
              <button
                type="button"
                onClick={() => setViewMode('canvas')}
                className={`h-7 px-3 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'canvas'
                    ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Canvas</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('chart')}
                className={`h-7 px-3 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'chart'
                    ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Sxema</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`h-7 px-3 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Ro‘yxat</span>
              </button>
            </div>

            {/* Add Department button */}
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsDeptModalOpen(true)}
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-[#C6A15B] text-[#14201F] hover:bg-[#d6b36e] font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Bo‘lim qo‘shish</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Switcher Segment */}
        <div className="flex sm:hidden w-full p-0.5 rounded-xl bg-card border border-border shadow-xs grid grid-cols-3 gap-0.5">
          <button
            type="button"
            onClick={() => setViewMode('canvas')}
            className={`h-8 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'canvas'
                ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`h-8 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'chart'
                ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Sxema</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`h-8 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Ro‘yxat</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {departments.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-card border border-border max-w-md mx-auto space-y-4 shadow-sm my-auto">
          <img src="/stickers/s6.png" alt="Bo‘limlar mavjud emas" className="w-24 h-24 mx-auto drop-shadow-md" />
          <h3 className="font-bold text-base text-foreground">Birinchi bo‘limni qo‘shing</h3>
          <p className="text-xs text-muted-foreground">
            Tashkiliy iyerarxiyani shakllantirish uchun bo‘lim yaratib, xodimlarni biriktiring.
          </p>
          {canEdit && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setIsDeptModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#C6A15B] text-[#14201F] font-bold text-xs shadow-md hover:bg-[#d6b36e] transition cursor-pointer"
              >
                Bo‘lim qo‘shish
              </button>
            </div>
          )}
        </div>
      ) : viewMode === 'canvas' ? (
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
          <OrgCanvasBuilder
            departments={departments}
            employees={employees}
            userRole={userRole}
            onUpdateDepartments={handleUpdateDeptsList}
            onDeleteDepartment={handleDeleteDept}
            onSelectEmployee={(emp) => {
              if (onOpenEmployeeCard) {
                onOpenEmployeeCard(emp.id);
              } else {
                setSelectedEmployee(emp);
              }
            }}
            onAddDepartment={handleDirectAddDept}
          />
        </div>
      ) : viewMode === 'chart' ? (
        <OrgChartView
          tree={tree}
          departments={departments}
          employees={employees}
          userRole={userRole}
          onUpdateDepartments={handleUpdateDeptsList}
          onSelectEmployee={(emp) => {
            if (onOpenEmployeeCard) {
              onOpenEmployeeCard(emp.id);
            } else {
              setSelectedEmployee(emp);
            }
          }}
        />
      ) : (
        <OrgListView
          departments={departments}
          employees={employees}
          stats={departmentStats}
          userRole={userRole}
          onSelectEmployee={(emp) => {
            if (onOpenEmployeeCard) {
              onOpenEmployeeCard(emp.id);
            } else {
              setSelectedEmployee(emp);
            }
          }}
        />
      )}

      {/* Department Creation Modal */}
      <DepartmentModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSave={handleAddDept}
        employees={employees}
      />

      {/* Employee Detail Sheet */}
      <EmployeeDetailSheet
        isOpen={!!selectedEmployee}
        employee={selectedEmployee}
        departments={departments}
        userRole={userRole}
        onSetHead={handleSetHead}
        onMoveEmployee={handleMoveEmp}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
};
