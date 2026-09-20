import React, { useState } from 'react';
import {
  PlaneTakeoff,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  Check,
  X,
  User,
} from 'lucide-react';
import { LeaveRequest, LeaveBalance, Employee, LeaveType } from '../types';

interface LeavesPageProps {
  leaves: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  employees: Employee[];
  onRequestLeave: (req: LeaveRequest) => void;
  onApproveLeave: (leaveId: number) => void;
  onRejectLeave: (leaveId: number, reason: string) => void;
}

export const LeavesPage: React.FC<LeavesPageProps> = ({
  leaves,
  leaveBalances,
  employees,
  onRequestLeave,
  onApproveLeave,
  onRejectLeave,
}) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [rejectingLeaveId, setRejectingLeaveId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [form, setForm] = useState<{
    employee_id: number;
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    reason: string;
  }>({
    employee_id: employees[0]?.id || 1,
    leave_type: 'annual',
    start_date: '2026-09-25',
    end_date: '2026-09-29',
    reason: 'Yillik mehnat ta’tili',
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const newReq: LeaveRequest = {
      id: Date.now(),
      employee_id: Number(form.employee_id),
      leave_type: form.leave_type,
      start_date: form.start_date,
      end_date: form.end_date,
      total_days: diffDays,
      reason: form.reason,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    onRequestLeave(newReq);
    setIsRequestModalOpen(false);
  };

  const handleConfirmReject = () => {
    if (rejectingLeaveId) {
      onRejectLeave(rejectingLeaveId, rejectReason || 'Ish zaruriyati tufayli qoldirildi');
      setRejectingLeaveId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0E4F4F]">
            Ta’tillar va Ruxsatnomalar
          </h2>
          <p className="text-xs text-gray-500">
            O‘zbekiston Mehnat kodeksi 217-moddasi bo‘yicha yillik asosiy va ijtimoiy ta’tillar
          </p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0E4F4F] text-white hover:bg-[#093535] shadow-xs active:scale-95 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ta’til so‘rash</span>
        </button>
      </div>

      {/* Leave Balance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {employees.slice(0, 4).map((emp) => {
          const bal = leaveBalances.find((b) => b.employee_id === emp.id) || {
            total_days: 21,
            used_days: 4,
          };
          const remaining = bal.total_days - bal.used_days;
          const pct = Math.round((bal.used_days / bal.total_days) * 100);

          return (
            <div key={emp.id} className="aluvantis-card p-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={emp.avatar_url}
                  alt={emp.full_name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#0E4F4F]/10"
                />
                <div className="truncate">
                  <h4 className="font-semibold text-xs text-gray-900 truncate">{emp.full_name}</h4>
                  <p className="text-[10px] text-gray-400">{emp.position}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Qolgan kunlar:</span>
                  <span className="font-bold text-[#0E4F4F]">{remaining} / {bal.total_days} kun</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C6A15B] h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending & Historical Leave Requests */}
      <div className="aluvantis-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
            Ta’til arizalari ro‘yxati
          </h3>
          <span className="text-xs text-gray-400">{leaves.length} ta ariza</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <th className="p-3">Xodim</th>
                <th className="p-3">Ta’til turi</th>
                <th className="p-3">Muddati</th>
                <th className="p-3">Kunlar</th>
                <th className="p-3">Sabab</th>
                <th className="p-3">Holati</th>
                <th className="p-3 text-right">Tasdiqlash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map((l) => {
                const emp = employees.find((e) => e.id === l.employee_id);
                return (
                  <tr key={l.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-3 font-semibold text-gray-900">
                      {emp?.full_name}
                    </td>

                    <td className="p-3 capitalize font-medium text-gray-700">
                      {l.leave_type === 'annual' && 'Yillik mehnat'}
                      {l.leave_type === 'sick' && 'Kasallik varaqasi'}
                      {l.leave_type === 'study' && 'O‘qish sessiyasi'}
                      {l.leave_type === 'unpaid' && 'Haq to‘lanmaydigan'}
                    </td>

                    <td className="p-3 font-mono text-gray-600 text-[11px]">
                      {l.start_date} — {l.end_date}
                    </td>

                    <td className="p-3 font-bold text-[#0E4F4F]">
                      {l.total_days} kun
                    </td>

                    <td className="p-3 text-gray-500 max-w-xs truncate">
                      {l.reason}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          l.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status === 'approved' ? 'Tasdiqlangan' : l.status === 'rejected' ? 'Rad etilgan' : 'Kutilmoqda'}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      {l.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onApproveLeave(l.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            title="Tasdiqlash"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setRejectingLeaveId(l.id)}
                            className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                            title="Rad etish"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium">Bajarildi</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-5 border border-[#0E4F4F]/10 space-y-4 text-xs">
            <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
              Ta’til arizasini berish
            </h3>

            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Xodim</label>
                <select
                  value={form.employee_id}
                  onChange={(e) => setForm({ ...form, employee_id: Number(e.target.value) })}
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
                <label className="block text-gray-600 font-medium mb-1">Ta’til turi</label>
                <select
                  value={form.leave_type}
                  onChange={(e) => setForm({ ...form, leave_type: e.target.value as LeaveType })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                >
                  <option value="annual">Yillik mehnat ta’tili (Asosiy)</option>
                  <option value="sick">Kasallik ta’tili (Shifoxona varaqasi)</option>
                  <option value="study">O‘quv ta’tili (Sessiya)</option>
                  <option value="unpaid">Ish haqi saqlanmaydigan ta’til</option>
                  <option value="maternity">Homiladorlik va tug‘ruq ta’tili</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Boshlanish sanasi</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Tugash sanasi</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Sababi / Asosi</label>
                <textarea
                  rows={2}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Ariza sababi..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0E4F4F] text-white font-semibold hover:bg-[#093535]"
                >
                  Ariza yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl p-5 border border-red-200 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-red-700">Ta’tilni rad etish sababi</h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Sababni kiriting..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingLeaveId(null)}
                className="px-3 py-1.5 rounded-xl text-gray-600"
              >
                Bekor
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-semibold"
              >
                Rad etish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
