import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Department } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  department: Department | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  department,
}) => {
  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-red-500">
          <div className="p-2.5 rounded-2xl bg-red-500/10">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Bo‘limni o‘chirish</h3>
            <p className="text-xs text-muted-foreground">Ushbu amalni ortga qaytarib bo‘lmaydi</p>
          </div>
        </div>

        <p className="text-xs text-foreground/80 leading-relaxed">
          «<strong className="text-foreground">{department.name}</strong>» bo‘limini tuzilmadan o‘chirishni tasdiqlaysizmi?
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-semibold text-foreground cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 cursor-pointer"
          >
            Ha, o‘chirilsin
          </button>
        </div>
      </div>
    </div>
  );
};
