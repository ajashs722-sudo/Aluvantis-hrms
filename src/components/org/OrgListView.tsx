import React from 'react';
import { Department, Employee, UserRole } from '../../types';
import { DepartmentStats, canViewSalaries } from '../../lib/orgService';
import { Users, Crown, ArrowRight, Wallet, Building2 } from 'lucide-react';

interface OrgListViewProps {
  departments: Department[];
  employees: Employee[];
  stats: DepartmentStats[];
  userRole: UserRole;
  onSelectEmployee: (emp: Employee) => void;
}

export const OrgListView: React.FC<OrgListViewProps> = ({
  departments,
  employees,
  stats,
  userRole,
  onSelectEmployee,
}) => {
  const showSalary = canViewSalaries(userRole);

  return (
    <div className="space-y-6">
      {departments.map((dept) => {
        const deptStat = stats.find((s) => s.id === dept.id);
        const deptEmps = employees.filter(
          (e) => e.department_id === dept.id || e.department === dept.name
        );
        const headEmp = employees.find((e) => e.id === dept.head_employee_id);

        return (
          <div
            key={dept.id}
            className="aluvantis-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Department Header Row */}
            <div
              className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-border"
              style={{
                background: `linear-gradient(90deg, ${dept.color || '#C6A15B'}18 0%, transparent 100%)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-10 rounded-full"
                  style={{ backgroundColor: dept.color || '#C6A15B' }}
                />
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Building2 className="w-5 h-5" style={{ color: dept.color || '#C6A15B' }} />
                    <span>{dept.name}</span>
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Crown className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Boshliq: {headEmp ? headEmp.full_name : 'Tayinlanmagan'}</span>
                  </div>
                </div>
              </div>

              {/* Department Meta */}
              <div className="flex items-center gap-4 text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-border">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{deptStat?.headcount || deptEmps.length} ta xodim</span>
                </div>
                {showSalary && deptStat && (
                  <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-border text-[#0E4F4F] dark:text-[#C6A15B]">
                    <Wallet className="w-4 h-4" />
                    <span>{(deptStat.total_payroll / 1_000_000).toFixed(1)} mln so'm</span>
                  </div>
                )}
              </div>
            </div>

            {/* Employees in Department */}
            <div className="p-4 sm:p-5">
              {deptEmps.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">
                  Ushbu bo‘limda hozircha xodimlar mavjud emas.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {deptEmps.map((emp) => {
                    const isHead = emp.id === dept.head_employee_id;

                    return (
                      <div
                        key={emp.id}
                        onClick={() => onSelectEmployee(emp)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isHead
                            ? 'bg-[#C6A15B]/10 border-[#C6A15B]/30 hover:border-[#C6A15B]'
                            : 'bg-card border-border hover:bg-black/[0.02] dark:hover:bg-white/[0.03] hover:border-border/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={
                              emp.avatar_url ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                            }
                            alt={emp.full_name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-border shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="font-semibold text-xs text-foreground truncate group-hover:text-[#0E4F4F] dark:group-hover:text-[#C6A15B]">
                                {emp.full_name}
                              </p>
                              {isHead && <Crown className="w-3 h-3 text-[#C6A15B] shrink-0" />}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">{emp.position}</p>
                            {showSalary && emp.base_salary && (
                              <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-mono">
                                {(emp.base_salary / 1_000_000).toFixed(1)}M UZS
                              </p>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
