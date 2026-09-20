import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, ArrowRightLeft, UserCheck, Phone, Mail, Building2, ExternalLink } from 'lucide-react';
import { Employee, Department, UserRole } from '../../types';
import { SweepButton } from '../ui/SweepButton';
import { canEditOrg, canViewSalaries } from '../../lib/orgService';

interface EmployeeDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  departments: Department[];
  userRole: UserRole;
  onSetHead: (deptId: number, empId: number) => void;
  onMoveEmployee: (empId: number, deptId: number) => void;
  onOpenCard?: (empId: number) => void;
}

export const EmployeeDetailSheet: React.FC<EmployeeDetailSheetProps> = ({
  isOpen,
  onClose,
  employee,
  departments,
  userRole,
  onSetHead,
  onMoveEmployee,
  onOpenCard,
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<number>(0);
  const [isMoving, setIsMoving] = useState(false);

  if (!isOpen || !employee) return null;

  const currentDept = departments.find((d) => d.id === employee.department_id || d.name === employee.department);
  const isHead = currentDept?.head_employee_id === employee.id;
  const showSalary = canViewSalaries(userRole);
  const canEdit = canEditOrg(userRole);

  const handleMakeHead = () => {
    if (currentDept) {
      onSetHead(currentDept.id, employee.id);
      onClose();
    }
  };

  const handleConfirmMove = () => {
    if (selectedDeptId > 0) {
      onMoveEmployee(employee.id, selectedDeptId);
      setIsMoving(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-card text-foreground backdrop-blur-2xl border-l border-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs font-semibold text-[#0E4F4F] dark:text-[#C6A15B] tracking-wider uppercase">
                Xodim Ma’lumotlari
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar and Name */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
              {employee.avatar_url ? (
                <img
                  src={employee.avatar_url}
                  alt={employee.full_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#C6A15B]"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#C6A15B] text-[#14201F] font-bold text-xl flex items-center justify-center">
                  {employee.full_name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-foreground truncate">{employee.full_name}</h3>
                  {isHead && (
                    <span className="px-2 py-0.5 rounded-full bg-[#C6A15B]/20 text-[#C6A15B] text-[10px] font-bold flex items-center gap-1 border border-[#C6A15B]/30">
                      <Crown className="w-3 h-3" /> Boshliq
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{employee.position}</p>
                {currentDept && (
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-white shadow-xs"
                    style={{ backgroundColor: currentDept.color || '#C6A15B' }}
                  >
                    {currentDept.name}
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-xs text-foreground">
              {showSalary && employee.base_salary && (
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex justify-between items-center">
                  <span className="text-muted-foreground">Oylik maoshi:</span>
                  <span className="font-bold text-[#0E4F4F] dark:text-[#C6A15B] text-sm">
                    {employee.base_salary.toLocaleString()} UZS
                  </span>
                </div>
              )}

              <div className="space-y-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                <div className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-4 h-4 text-[#0E4F4F] dark:text-[#C6A15B]" />
                  <span>Bo‘lim: {currentDept?.name || 'Tayinlanmagan'}</span>
                </div>
                {employee.telegram_username && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-[#0E4F4F] dark:text-[#C6A15B]" />
                    <span>Telegram: {employee.telegram_username}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Move department selector */}
            {isMoving && (
              <div className="space-y-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[#C6A15B]/40">
                <label className="text-xs font-semibold text-[#0E4F4F] dark:text-[#C6A15B]">
                  Yangi bo‘limni tanlang:
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-background text-foreground border border-border text-xs focus:outline-none focus:border-[#C6A15B]"
                >
                  <option value={0}>Bo‘limni tanlang...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id} className="bg-card text-foreground">
                      {d.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleConfirmMove}
                    className="flex-1 py-1.5 rounded-lg bg-[#C6A15B] text-[#14201F] font-bold text-xs hover:opacity-90 transition cursor-pointer"
                  >
                    Saqlash
                  </button>
                  <button
                    onClick={() => setIsMoving(false)}
                    className="px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 text-foreground text-xs hover:opacity-80 transition cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-6 border-t border-border">
            {canEdit && !isHead && currentDept && (
              <SweepButton solid gold className="w-full justify-center min-h-[44px]" onClick={handleMakeHead}>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>Boshliq qilish</span>
                </div>
              </SweepButton>
            )}

            {canEdit && !isMoving && (
              <button
                onClick={() => setIsMoving(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-foreground font-medium text-xs flex items-center justify-center gap-2 border border-border transition cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4 text-[#0E4F4F] dark:text-[#C6A15B]" />
                <span>Ko‘chirish</span>
              </button>
            )}

            {onOpenCard && (
              <button
                onClick={() => {
                  onOpenCard(employee.id);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-background hover:bg-black/5 dark:hover:bg-white/5 text-foreground text-xs flex items-center justify-center gap-2 border border-border transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Kartasini ochish</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
