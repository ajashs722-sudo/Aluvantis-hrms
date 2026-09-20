import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Crown, Palette } from 'lucide-react';
import { Department, Employee } from '../../types';
import { SweepButton } from '../ui/SweepButton';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string, headEmployeeId?: number | null) => void;
  employees: Employee[];
  initialData?: Department | null;
}

const PRESET_COLORS = [
  '#C6A15B', // Gold
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employees,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [color, setColor] = useState(initialData?.color || '#C6A15B');
  const [headEmployeeId, setHeadEmployeeId] = useState<number | ''>(
    initialData?.head_employee_id || ''
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), color, headEmployeeId ? Number(headEmployeeId) : null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-card text-foreground border border-border p-6 rounded-3xl shadow-2xl space-y-5"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
              <Building2 className="w-5 h-5 text-[#0E4F4F] dark:text-[#C6A15B]" />
              <span>{initialData ? 'Bo‘limni tahrirlash' : 'Yangi bo‘lim qo‘shish'}</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Bo‘lim nomi</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="masalan: Logistika va ombor"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#C6A15B]" />
                Bo‘lim boshlig‘i
              </label>
              <select
                value={headEmployeeId}
                onChange={(e) => setHeadEmployeeId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="">Boshliq tayinlanmagan</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id} className="bg-card text-foreground">
                    {emp.full_name} ({emp.position})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#C6A15B]" />
                Rang belgilash
              </label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                      color === c ? 'border-foreground scale-110 shadow-md ring-2 ring-primary/30' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-3">
              <SweepButton solid gold type="submit" className="w-full justify-center min-h-[46px]">
                <span>{initialData ? 'Saqlash' : 'Bo‘lim yaratish'}</span>
              </SweepButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
