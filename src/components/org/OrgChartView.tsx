import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Building2,
  Users,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from 'lucide-react';
import { Department, Employee, UserRole } from '../../types';
import { OrgNode, canViewSalaries } from '../../lib/orgService';
import { useLanguage } from '../../lib/i18n';

interface OrgChartViewProps {
  tree: OrgNode;
  departments: Department[];
  employees: Employee[];
  userRole: UserRole;
  onUpdateDepartments?: (depts: Department[]) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const OrgChartView: React.FC<OrgChartViewProps> = ({
  tree,
  departments,
  employees,
  userRole,
  onUpdateDepartments,
  onSelectEmployee,
}) => {
  const { t } = useLanguage();
  const [scale, setScale] = useState<number>(1);
  const [collapsedDepts, setCollapsedDepts] = useState<Record<number, boolean>>({});

  const toggleDept = (deptId: number) => {
    setCollapsedDepts((prev) => ({ ...prev, [deptId]: !prev[deptId] }));
  };

  const handleZoomIn = () => setScale((s) => Math.min(1.8, s + 0.15));
  const handleZoomOut = () => setScale((s) => Math.max(0.4, s - 0.15));
  const handleResetZoom = () => setScale(1);

  // Reorder department left/right or up/down
  const moveDepartment = (deptId: number, direction: 'prev' | 'next') => {
    if (!onUpdateDepartments) return;
    const index = departments.findIndex((d) => d.id === deptId);
    if (index === -1) return;

    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= departments.length) return;

    const newDepts = [...departments];
    const temp = newDepts[index];
    newDepts[index] = newDepts[targetIndex];
    newDepts[targetIndex] = temp;
    onUpdateDepartments(newDepts);
  };

  const showSalary = canViewSalaries(userRole);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-card border border-border p-3 sm:p-6 shadow-xl min-h-[580px] flex flex-col justify-between select-none">
      {/* Zoom & Action Controls (Desktop interactive view only) */}
      <div className="hidden md:flex absolute top-4 right-4 z-20 items-center gap-1.5 p-1.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border text-foreground text-xs shadow-md">
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition cursor-pointer"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="px-1.5 font-mono font-bold text-[11px] text-[#0E4F4F] dark:text-[#C6A15B]">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition cursor-pointer border-l border-border"
          title="Reset zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Canvas / Interactive View */}
      <div className="hidden md:block w-full overflow-auto py-8">
        <motion.div
          drag
          dragConstraints={{ left: -800, right: 800, top: -600, bottom: 600 }}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          className="flex flex-col items-center min-w-max space-y-8 cursor-grab active:cursor-grabbing"
        >
          {/* Company Root */}
          <div className="px-6 py-3.5 rounded-2xl bg-[#0E4F4F] dark:bg-[#14201F] border-2 border-[#C6A15B] text-white shadow-2xl flex items-center gap-3">
            <Building2 className="w-6 h-6 text-[#C6A15B]" />
            <div>
              <h2 className="font-bold text-base text-[#C6A15B] tracking-tight">{tree.name}</h2>
              <p className="text-[11px] text-white/80">Tashkiliy ierarxiya va bo‘limlar sxemasi</p>
            </div>
          </div>

          {/* Departments Level */}
          <div className="flex gap-6 relative items-start">
            {departments.map((dept, dIdx) => {
              const isCollapsed = collapsedDepts[dept.id];
              const deptEmps = employees.filter(
                (e) => e.department_id === dept.id || e.department === dept.name
              );
              const deptHead = employees.find((e) => e.id === dept.head_employee_id);

              return (
                <div key={dept.id} className="flex flex-col items-center relative">
                  {/* Connecting Line from Header */}
                  <div
                    className="w-0.5 h-6 opacity-60 mb-1"
                    style={{ backgroundColor: dept.color || '#0E4F4F' }}
                  />

                  {/* Department Node Header */}
                  <div
                    className="px-3.5 py-2.5 rounded-2xl bg-card border border-border shadow-lg flex items-center gap-2 transition hover:shadow-xl"
                    style={{ borderTop: `4px solid ${dept.color || '#0E4F4F'}` }}
                  >
                    {/* Reorder Left */}
                    {onUpdateDepartments && dIdx > 0 && (
                      <button
                        onClick={() => moveDepartment(dept.id, 'prev')}
                        className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
                        title="Chapga surish"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div
                      onClick={() => toggleDept(dept.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: dept.color || '#0E4F4F' }}
                      />
                      <span className="font-bold text-xs text-foreground">{dept.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-muted-foreground font-semibold">
                        {deptEmps.length}
                      </span>
                      {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Reorder Right */}
                    {onUpdateDepartments && dIdx < departments.length - 1 && (
                      <button
                        onClick={() => moveDepartment(dept.id, 'next')}
                        className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
                        title="O‘ngga surish"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Employee Children Cards */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col items-center gap-2.5 mt-4"
                      >
                        {deptEmps.map((emp) => {
                          const isHead = emp.id === dept.head_employee_id;
                          return (
                            <div
                              key={emp.id}
                              onClick={() => onSelectEmployee(emp)}
                              className={`w-56 p-2.5 rounded-2xl border transition cursor-pointer hover:shadow-md ${
                                isHead
                                  ? 'bg-[#C6A15B]/10 border-[#C6A15B]/40 hover:border-[#C6A15B]'
                                  : 'bg-card border-border hover:border-foreground/40'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                {emp.avatar_url ? (
                                  <img
                                    src={emp.avatar_url}
                                    alt={emp.full_name}
                                    className="w-8 h-8 rounded-full object-cover ring-1 ring-border"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-[#0E4F4F] text-[#C6A15B] font-bold text-xs flex items-center justify-center">
                                    {emp.full_name.charAt(0)}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1">
                                    <h4 className="font-bold text-xs text-foreground truncate">
                                      {emp.full_name}
                                    </h4>
                                    {isHead && <Crown className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground truncate leading-tight">
                                    {emp.position}
                                  </p>
                                  {showSalary && emp.base_salary && (
                                    <p className="text-[10px] font-semibold text-[#0E4F4F] dark:text-[#C6A15B] mt-0.5">
                                      {emp.base_salary.toLocaleString()} UZS
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Mobile Hierarchy Accordion (<768px) with Reordering */}
      <div className="md:hidden space-y-3 py-2">
        <div className="p-3.5 rounded-2xl bg-[#0E4F4F] dark:bg-[#14201F] border border-[#C6A15B] text-white flex items-center gap-2.5 mb-3 shadow-md">
          <Building2 className="w-5 h-5 text-[#C6A15B]" />
          <div>
            <span className="font-bold text-xs text-[#C6A15B]">{tree.name}</span>
            <p className="text-[10px] text-white/70">Tashkiliy ierarxiya sxemasi</p>
          </div>
        </div>

        {departments.map((dept, dIdx) => {
          const isCollapsed = collapsedDepts[dept.id];
          const deptEmps = employees.filter(
            (e) => e.department_id === dept.id || e.department === dept.name
          );

          return (
            <div
              key={dept.id}
              className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden"
            >
              <div
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold"
                style={{ borderLeft: `4px solid ${dept.color || '#0E4F4F'}` }}
              >
                <div
                  onClick={() => toggleDept(dept.id)}
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                >
                  <span className="text-foreground">{dept.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-muted-foreground">
                    {deptEmps.length} ta
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Reorder Up / Down */}
                  {onUpdateDepartments && (
                    <div className="flex items-center gap-0.5 mr-1 border-r border-border pr-1">
                      <button
                        disabled={dIdx === 0}
                        onClick={() => moveDepartment(dept.id, 'prev')}
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Tepaga"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={dIdx === departments.length - 1}
                        onClick={() => moveDepartment(dept.id, 'next')}
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Pastga"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => toggleDept(dept.id)}
                    className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="p-2 space-y-2 border-t border-border/60 bg-black/[0.02] dark:bg-white/[0.02]">
                  {deptEmps.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp)}
                      className="p-2.5 rounded-xl bg-card hover:bg-black/5 dark:hover:bg-white/5 border border-border flex items-center justify-between text-xs cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {emp.avatar_url ? (
                          <img
                            src={emp.avatar_url}
                            alt={emp.full_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#0E4F4F] text-[#C6A15B] font-bold text-xs flex items-center justify-center">
                            {emp.full_name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-foreground flex items-center gap-1">
                            <span className="truncate">{emp.full_name}</span>
                            {dept.head_employee_id === emp.id && (
                              <Crown className="w-3 h-3 text-[#C6A15B] shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground truncate block">
                            {emp.position}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
