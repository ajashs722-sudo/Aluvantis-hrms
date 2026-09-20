import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  PlaneTakeoff,
  Banknote,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Building,
  QrCode,
  Download,
} from 'lucide-react';
import {
  Employee,
  Shift,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  User,
} from '../types';
import { formatUZS } from '../lib/uzbekistanHrmsCalculations';

interface DashboardPageProps {
  currentUser: User;
  employees: Employee[];
  shifts: Shift[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[];
  onNavigate: (tab: any) => void;
  onQuickCheckIn: () => void;
  onDownloadLatestPayslip: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  employees,
  attendance,
  leaves,
  payroll,
  onNavigate,
  onQuickCheckIn,
  onDownloadLatestPayslip,
}) => {
  const [tashkentTime, setTashkentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTashkentTime(
        now.toLocaleTimeString('uz-UZ', {
          timeZone: 'Asia/Tashkent',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalEmployees = employees.filter((e) => e.status === 'active').length;
  const presentToday = attendance.filter((a) => a.check_in_time.startsWith('2026-09-19')).length;
  const lateToday = attendance.filter((a) => a.status === 'late').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'pending').length;

  const totalPayrollGross = payroll
    .filter((p) => p.month === 9 && p.year === 2026)
    .reduce((sum, p) => sum + p.gross_salary, 0);

  const totalTaxJshds = payroll
    .filter((p) => p.month === 9 && p.year === 2026)
    .reduce((sum, p) => sum + p.tax_jshds, 0);

  // Check if current user is checked in today
  const myEmployee = employees.find((e) => e.user_id === currentUser.id);
  const myAttendanceToday = myEmployee
    ? attendance.find((a) => a.employee_id === myEmployee.id)
    : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Top Banner / Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0E4F4F] via-[#113a3a] to-[#14201F] text-[#F6F3EC] p-5 sm:p-7 md:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#C6A15B]/15 blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C6A15B] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-ping" />
              <span>Toshkent: {tashkentTime || '10:00:00'} (UTC+5)</span>
            </div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight break-words">
              Xush kelibsiz, {currentUser.name}!
            </h1>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              «Aluvantis Technologies» korxonasi HRMS boshqaruv markazi. Barcha mehnat qoidalari,
              davomat va hisob-kitoblar O‘zbekiston Mehnat kodeksiga moslangan.
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-quick-checkin"
              onClick={onQuickCheckIn}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer ${
                myAttendanceToday
                  ? 'bg-[#C6A15B] text-[#0E4F4F]'
                  : 'bg-white text-[#0E4F4F] hover:bg-[#F6F3EC]'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#0E4F4F]" />
              <span>{myAttendanceToday ? '✓ Davomat qilindi' : 'QR bilan kelish'}</span>
            </button>

            <button
              id="btn-quick-leave"
              onClick={() => onNavigate('leaves')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-xs cursor-pointer"
            >
              <PlaneTakeoff className="w-4 h-4 text-[#C6A15B]" />
              <span>Ta’til arizasi</span>
            </button>

            <button
              id="btn-quick-payslip"
              onClick={onDownloadLatestPayslip}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C6A15B]" />
              <span>Hisob-kitob (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Employees */}
        <div
          onClick={() => onNavigate('employees')}
          className="aluvantis-card p-4 cursor-pointer hover:border-[#0E4F4F]/40 dark:hover:border-[#C6A15B]/40 transition"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Xodimlar</span>
            <div className="w-7 h-7 rounded-lg bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/20 text-[#0E4F4F] dark:text-[#C6A15B] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-foreground">
            {totalEmployees}
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>100% faol shtat</span>
          </p>
        </div>

        {/* Present Today */}
        <div
          onClick={() => onNavigate('attendance')}
          className="aluvantis-card p-4 cursor-pointer hover:border-[#0E4F4F]/40 dark:hover:border-[#C6A15B]/40 transition"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Davomat (Bugun)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">
            {presentToday} / {totalEmployees}
          </div>
          <p className="text-[10px] text-muted-foreground font-medium mt-1">
            {Math.round((presentToday / (totalEmployees || 1)) * 100)}% ish joyida
          </p>
        </div>

        {/* Late Today */}
        <div
          onClick={() => onNavigate('attendance')}
          className="aluvantis-card p-4 cursor-pointer hover:border-[#0E4F4F]/40 dark:hover:border-[#C6A15B]/40 transition"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Kechikishlar</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-amber-600 dark:text-amber-400">
            {lateToday}
          </div>
          <p className="text-[10px] text-muted-foreground font-medium mt-1">
            Transport & tirbandlik
          </p>
        </div>

        {/* Pending Leaves */}
        <div
          onClick={() => onNavigate('leaves')}
          className="aluvantis-card p-4 cursor-pointer hover:border-[#0E4F4F]/40 dark:hover:border-[#C6A15B]/40 transition"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Ta’til arizalari</span>
            <div className="w-7 h-7 rounded-lg bg-[#C6A15B]/20 text-[#0E4F4F] dark:text-[#C6A15B] flex items-center justify-center">
              <PlaneTakeoff className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl text-[#0E4F4F] dark:text-[#C6A15B]">
            {pendingLeaves}
          </div>
          <p className="text-[10px] text-[#C6A15B] font-medium mt-1">
            {pendingLeaves > 0 ? 'Tasdiq kutmoqda' : 'Hammasi ko‘rilgan'}
          </p>
        </div>

        {/* Monthly Payroll */}
        <div
          onClick={() => onNavigate('payroll')}
          className="aluvantis-card p-4 cursor-pointer hover:border-[#0E4F4F]/40 dark:hover:border-[#C6A15B]/40 transition col-span-2 sm:col-span-1 xl:col-span-2"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider truncate">
              Sentabr Ish haqi (Gross)
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/20 text-[#0E4F4F] dark:text-[#C6A15B] flex items-center justify-center shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-lg sm:text-xl text-[#0E4F4F] dark:text-[#C6A15B] truncate">
            {formatUZS(totalPayrollGross || 154000000)}
          </div>
          <p className="text-[10px] text-muted-foreground font-medium mt-1 truncate">
            JShDS solig‘i: {formatUZS(totalTaxJshds || 18480000)} (12%)
          </p>
        </div>
      </div>

      {/* Main 2-Column Split: Attendance Monitor & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Attendance Status & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aluvantis-card p-4 sm:p-5">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="font-display font-bold text-base text-foreground">
                  Bugungi kunlik davomat monitoringi
                </h3>
                <p className="text-xs text-muted-foreground">
                  QR kod va ofis biometrik stansiyasi orqali qayd etilgan holatlar
                </p>
              </div>
              <button
                onClick={() => onNavigate('attendance')}
                className="text-xs font-semibold text-[#0E4F4F] dark:text-[#C6A15B] hover:opacity-80 flex items-center gap-1 cursor-pointer"
              >
                <span>Barchasi</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-border mt-2">
              {attendance.slice(0, 5).map((rec) => {
                const emp = employees.find((e) => e.id === rec.employee_id);
                return (
                  <div key={rec.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={emp?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={emp?.full_name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{emp?.full_name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{emp?.position}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            rec.status === 'ontime'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {rec.status === 'ontime' ? 'Vaqtida' : 'Kechikkan'}
                        </span>
                        <span className="text-xs font-mono font-semibold text-foreground">
                          {rec.check_in_time.split('T')[1]?.slice(0, 5) || '09:00'}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground capitalize mt-0.5">
                        Usul: {rec.check_in_method}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Uzbekistan Labor & Tax Code Compliance Widget */}
          <div className="aluvantis-card p-4 sm:p-5 bg-[#C6A15B]/10 border-[#C6A15B]/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0E4F4F] text-[#C6A15B] flex items-center justify-center shrink-0 shadow-xs">
                <Building className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-xs text-foreground">
                  O‘zbekiston Respublikasi Yangi Mehnat Kodeksi talablariga muvofiqlik
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Tizim haftalik 40 soatlik ish me’yorini, asosiy ta’tilning 21 kalendar kunidan kam
                  bo‘lmasligini, qo‘shimcha ish soatlariga 1.5 barobar oshirilgan to‘lovni va JShDS (12%)
                  hamda INPS (0.1%) avtomatik ushlab qolinishini ta’minlaydi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Approvals & Uzbekistan Integrations Quick Status */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          <div className="aluvantis-card p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display font-bold text-sm text-foreground">
                Kutilayotgan tasdiqlar
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#C6A15B]/20 text-[#0E4F4F] dark:text-[#C6A15B] font-bold text-[10px]">
                {pendingLeaves} ta
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {leaves
                .filter((l) => l.status === 'pending')
                .map((leave) => {
                  const emp = employees.find((e) => e.id === leave.employee_id);
                  return (
                    <div
                      key={leave.id}
                      className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-2 hover:border-[#0E4F4F]/30 dark:hover:border-[#C6A15B]/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-foreground">{emp?.full_name}</p>
                        <span className="text-[10px] font-bold text-[#C6A15B] bg-[#C6A15B]/10 px-1.5 py-0.5 rounded">
                          {leave.total_days} kun
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {leave.reason}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {leave.start_date} dan
                        </span>
                        <button
                          onClick={() => onNavigate('leaves')}
                          className="px-2.5 py-1 rounded-lg bg-[#0E4F4F] text-white text-[11px] font-semibold hover:bg-[#093535] cursor-pointer"
                        >
                          Ko‘rib chiqish
                        </button>
                      </div>
                    </div>
                  );
                })}

              {pendingLeaves === 0 && (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  Hozirda yangi arizalar yo‘q
                </div>
              )}
            </div>
          </div>

          {/* Integrations Status Card */}
          <div className="aluvantis-card p-4 sm:p-5 space-y-3">
            <h3 className="font-display font-bold text-sm text-foreground">
              Davlat va To‘lov integratsiyalari
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50">
                <span className="font-medium text-foreground">my.soliq.uz (Hisobot):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Ulangan (1-mehnat)
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50">
                <span className="font-medium text-foreground">E-IMZO Raqamli imzo:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Sertifikat faol
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50">
                <span className="font-medium text-foreground">Click & Payme oklad:</span>
                <span className="text-[#0E4F4F] dark:text-[#C6A15B] font-semibold text-[11px]">
                  Uzcard/Humo reestr
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-border/50">
                <span className="font-medium text-foreground">Telegram Bot:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  @aluvantis_hrms_bot
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
