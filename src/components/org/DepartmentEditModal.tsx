import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Department, Employee } from '../../types';

interface DepartmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dept: Partial<Department>) => void;
  initialDept?: Department | null;
  employees: Employee[];
  parentDeptId?: number | null;
}

export const DepartmentEditModal: React.FC<DepartmentEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDept,
  employees,
  parentDeptId,
}) => {
  const [name, setName] = useState(initialDept?.name || '');
  const [headId, setHeadId] = useState<number | ''>(initialDept?.head_employee_id ?? '');
  const [color, setColor] = useState(initialDept?.color || '#0E4F4F');

  if (!isOpen) return null;

  const colorPresets = ['#0E4F4F', '#C6A15B', '#2563EB', '#7C3AED', '#DB2777', '#059669', '#D97706'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(initialDept || {}),
      name: name.trim(),
      head_employee_id: headId === '' ? null : Number(headId),
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-base text-foreground">
            {initialDept ? 'Bo‘limni tahrirlash' : parentDeptId ? 'Quyi bo‘lim qo‘shish' : 'Yangi bo‘lim'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-muted-foreground block mb-1">Bo‘lim nomi</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Savdo va Marketing"
              className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-foreground"
            />
          </div>

          <div>
            <label className="font-semibold text-muted-foreground block mb-1">Bo‘lim boshlig‘i</label>
            <select
              value={headId}
              onChange={(e) => setHeadId(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-foreground"
            >
              <option value="">Tayinlanmagan</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-muted-foreground block mb-1.5">Rang identifikatori</label>
            <div className="flex items-center gap-2">
              {colorPresets.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-xl transition-transform cursor-pointer ${
                    color === c ? 'scale-110 ring-2 ring-foreground' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-semibold text-foreground cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] text-xs font-bold shadow-md cursor-pointer"
          >
            Saqlash
          </button>
        </div>
      </form>
    </div>
  );
};
