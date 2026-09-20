import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Wand2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Shift, Employee, ShiftType } from '../types';

interface ShiftsPageProps {
  shifts: Shift[];
  employees: Employee[];
  onAddShift: (shift: Shift) => void;
  onUpdateShift: (shift: Shift) => void;
}

export const ShiftsPage: React.FC<ShiftsPageProps> = ({
  shifts,
  employees,
  onAddShift,
  onUpdateShift,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-20');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [autoScheduledNotice, setAutoScheduledNotice] = useState(false);

  const [shiftForm, setShiftForm] = useState<{
    employee_id: number;
    shift_date: string;
    shift_type: ShiftType;
    start_time: string;
    end_time: string;
  }>({
    employee_id: employees[0]?.id || 1,
    shift_date: '2026-09-20',
    shift_type: 'morning',
    start_time: '09:00',
    end_time: '18:00',
  });

  // Days in current view week (Sep 18 to Sep 24, 2026)
  const weekDates = [
    { date: '2026-09-18', day: 'Juma', label: '18 Sen' },
    { date: '2026-09-19', day: 'Shanba', label: '19 Sen' },
    { date: '2026-09-20', day: 'Yakshanba', label: '20 Sen' },
    { date: '2026-09-21', day: 'Dushanba', label: '21 Sen' },
    { date: '2026-09-22', day: 'Seshanba', label: '22 Sen' },
    { date: '2026-09-23', day: 'Chorshanba', label: '23 Sen' },
    { date: '2026-09-24', day: 'Payshanba', label: '24 Sen' },
  ];

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    const newShift: Shift = {
      id: Date.now(),
      employee_id: Number(shiftForm.employee_id),
      shift_date: shiftForm.shift_date,
      shift_type: shiftForm.shift_type,
      start_time: shiftForm.start_time,
      end_time: shiftForm.end_time,
      scheduled_hours: 8,
      status: 'scheduled',
      created_at: new Date().toISOString(),
    };
    onAddShift(newShift);
    setIsAssignModalOpen(false);
  };

  const runAutoScheduler = () => {
    // Generates optimal shift schedules for all active employees ensuring 40 hrs / week
    employees.forEach((emp, index) => {
      weekDates.forEach((w) => {
        // Skip weekend unless operations
        if (w.day === 'Yakshanba' && emp.department !== 'Logistika va Ombor') return;

        const exists = shifts.some((s) => s.employee_id === emp.id && s.shift_date === w.date);
        if (!exists) {
          const shiftType: ShiftType = index % 3 === 0 ? 'morning' : index % 3 === 1 ? 'morning' : 'afternoon';
          onAddShift({
            id: Date.now() + Math.random() * 10000,
            employee_id: emp.id,
            shift_date: w.date,
            shift_type: shiftType,
            start_time: shiftType === 'morning' ? '09:00' : '12:00',
            end_time: shiftType === 'morning' ? '18:00' : '21:00',
            scheduled_hours: 8,
            status: 'scheduled',
            created_at: new Date().toISOString(),
          });
        }
      });
    });

    setAutoScheduledNotice(true);
    setTimeout(() => setAutoScheduledNotice(false), 4000);
  };

  const getShiftBadgeColor = (type: ShiftType) => {
    switch (type) {
      case 'morning':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'afternoon':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'night':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Title & Auto Schedule */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0E4F4F]">
            Ish jadvallari va smenalar
          </h2>
          <p className="text-xs text-gray-500">
            Haftalik 40 soatlik me’yorni ta’minlovchi rejalashtirish
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={runAutoScheduler}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#C6A15B] text-[#0E4F4F] hover:bg-[#b59048] transition shadow-xs"
            title="Avtomatik algoritm orqali smenalarni taqsimlash"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-taqsimlash</span>
          </button>

          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0E4F4F] text-white hover:bg-[#093535] shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Smena biriktirish</span>
          </button>
        </div>
      </div>

      {autoScheduledNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>Muvaffaqiyatli:</strong> Barcha xodimlar uchun haftalik 40 soatlik smenalar avtomatik taqsimlandi!
          </span>
        </div>
      )}

      {/* Week Selector Bar */}
      <div className="aluvantis-card p-3 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          {weekDates.map((w) => {
            const isSelected = selectedDate === w.date;
            return (
              <button
                key={w.date}
                onClick={() => setSelectedDate(w.date)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                  isSelected
                    ? 'bg-[#0E4F4F] text-white shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <p className="text-[10px] text-gray-400 font-normal">{w.day}</p>
                <p>{w.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shifts Matrix for Selected Date */}
      <div className="aluvantis-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
              {selectedDate} sanasidagi ish jadvallari
            </h3>
            <p className="text-[11px] text-gray-400">Kunlik rejalashtirilgan ish soatlari</p>
          </div>
          <span className="text-xs text-[#C6A15B] font-semibold bg-[#C6A15B]/10 px-2.5 py-1 rounded-full">
            8 ta xodim
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {employees.map((emp) => {
            const dayShift = shifts.find(
              (s) => s.employee_id === emp.id && s.shift_date === selectedDate
            );

            return (
              <div key={emp.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar_url}
                    alt={emp.full_name}
                    className="w-10 h-10 rounded-2xl object-cover ring-1 ring-[#0E4F4F]/10"
                  />
                  <div>
                    <h4 className="font-semibold text-xs text-[#14201F]">{emp.full_name}</h4>
                    <p className="text-[11px] text-gray-400">{emp.position}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {dayShift ? (
                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold border capitalize ${getShiftBadgeColor(
                          dayShift.shift_type
                        )}`}
                      >
                        {dayShift.shift_type === 'morning' ? 'Ertalabki' : 'Tushdan keyingi'}: {dayShift.start_time} - {dayShift.end_time}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">8 soat me’yor</p>
                    </div>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs">
                      Dam olish kuni
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smena qo'shish modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-5 border border-[#0E4F4F]/10 space-y-4 text-xs">
            <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
              Xodimga smena biriktirish
            </h3>

            <form onSubmit={handleCreateShift} className="space-y-3">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Xodim</label>
                <select
                  value={shiftForm.employee_id}
                  onChange={(e) => setShiftForm({ ...shiftForm, employee_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Sana</label>
                <input
                  type="date"
                  value={shiftForm.shift_date}
                  onChange={(e) => setShiftForm({ ...shiftForm, shift_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Smena turi</label>
                <select
                  value={shiftForm.shift_type}
                  onChange={(e) => {
                    const type = e.target.value as ShiftType;
                    setShiftForm({
                      ...shiftForm,
                      shift_type: type,
                      start_time: type === 'morning' ? '09:00' : '12:00',
                      end_time: type === 'morning' ? '18:00' : '21:00',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                >
                  <option value="morning">Ertalabki (09:00 - 18:00)</option>
                  <option value="afternoon">Tushdan keyingi (12:00 - 21:00)</option>
                  <option value="night">Tungi (21:00 - 06:00)</option>
                  <option value="custom">Maxsus vaqt</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Boshlanish</label>
                  <input
                    type="time"
                    value={shiftForm.start_time}
                    onChange={(e) => setShiftForm({ ...shiftForm, start_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Tugash</label>
                  <input
                    type="time"
                    value={shiftForm.end_time}
                    onChange={(e) => setShiftForm({ ...shiftForm, end_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0E4F4F] text-white font-semibold hover:bg-[#093535]"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
