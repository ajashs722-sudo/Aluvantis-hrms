import React from 'react';
import { motion } from 'motion/react';
import { Calculator, Play, Sparkles, TrendingUp, User, Award } from 'lucide-react';
import { Employee, KPIResult, UserRole } from '../../types';
import { KPIScoreRing } from './KPIScoreRing';

interface KPICalculationTabProps {
  employees: Employee[];
  selectedEmployeeId: number;
  onSelectEmployee: (id: number) => void;
  selectedPeriod: string;
  onSelectPeriod: (p: string) => void;
  currentResult: KPIResult | null;
  historyData: { period: string; periodKey: string; score: number; bonus: number }[];
  userRole: UserRole;
  isComputing: boolean;
  onRunCompute: () => void;
}

export const KPICalculationTab: React.FC<KPICalculationTabProps> = ({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  selectedPeriod,
  onSelectPeriod,
  currentResult,
  historyData,
  userRole,
  isComputing,
  onRunCompute,
}) => {
  const currentEmp = employees.find((e) => e.id === selectedEmployeeId);
  const canCompute = userRole === 'admin' || userRole === 'hr';

  const periods = [
    { key: '2026-09', label: '2026 Sentabr (Joriy)' },
    { key: '2026-08', label: '2026 Avgust' },
    { key: '2026-07', label: '2026 Iyul' },
    { key: '2026-Q3', label: '2026 III Chorak' },
    { key: '2026-Q2', label: '2026 II Chorak' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Controls: Period Picker & Compute Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card/70 backdrop-blur-xl border border-border shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">Davr:</span>
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => onSelectPeriod(p.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedPeriod === p.key
                  ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-sm'
                  : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {canCompute && (
          <button
            onClick={onRunCompute}
            disabled={isComputing}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0E4F4F] to-[#166E6E] dark:from-[#C6A15B] dark:to-[#E0BC75] text-[#F6F3EC] dark:text-[#14201F] text-xs font-extrabold shadow-md hover:opacity-90 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {isComputing ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isComputing ? 'Hisoblanmoqda...' : 'Hozir hisobla'}</span>
          </button>
        )}
      </div>

      {/* Employee Selector Chips */}
      {employees.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {employees.map((emp) => {
            const isSelected = emp.id === selectedEmployeeId;
            return (
              <button
                key={emp.id}
                onClick={() => onSelectEmployee(emp.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/15 border-[#0E4F4F] dark:border-[#C6A15B] text-foreground shadow-xs'
                    : 'bg-card/40 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#C6A15B]/30 text-[#0E4F4F] dark:text-[#C6A15B] font-bold text-[10px] flex items-center justify-center">
                  {emp.full_name.charAt(0)}
                </div>
                <span className="truncate max-w-[130px]">{emp.full_name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Score & Metrics Breakdown */}
      {currentResult && currentEmp && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Score Ring & Bonus Summary */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-card/80 backdrop-blur-xl border border-border flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <div className="w-full flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2 text-left">
                <User className="w-4 h-4 text-[#C6A15B]" />
                <div>
                  <h3 className="font-bold text-xs text-foreground truncate max-w-[160px]">
                    {currentEmp.full_name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">{currentEmp.position}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/5 dark:bg-white/5 text-muted-foreground">
                {selectedPeriod}
              </span>
            </div>

            <KPIScoreRing
              score={currentResult.total}
              bonusPercent={currentResult.bonus_percent}
              size={150}
            />

            {/* Bonus Pill */}
            <div className="w-full p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-[#C6A15B]" /> Oylik ustama:
              </span>
              <span className="font-extrabold text-[#0E4F4F] dark:text-[#C6A15B]">
                +{currentResult.bonus_percent}% (
                {(currentResult.bonus_amount || 0).toLocaleString()} UZS)
              </span>
            </div>
          </div>

          {/* Right: Per-Metric Bars */}
          <div className="lg:col-span-8 p-5 rounded-3xl bg-card/80 backdrop-blur-xl border border-border space-y-3.5 shadow-sm">
            <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C6A15B]" />
              <span>Ko‘rsatkichlar tahlili va bajarilish darajasi</span>
            </h4>

            <div className="space-y-3 pt-1">
              {currentResult.breakdown.map((m) => {
                let barColor = 'bg-[#E11D48]'; // Red < 80
                let textColor = 'text-[#E11D48]';
                if (m.score >= 100) {
                  barColor = 'bg-[#10B981]'; // Green ≥ 100
                  textColor = 'text-[#10B981]';
                } else if (m.score >= 80) {
                  barColor = 'bg-[#C6A15B]'; // Gold 80-99
                  textColor = 'text-[#C6A15B]';
                }

                const progressWidth = `${Math.min(100, (m.score / 120) * 100)}%`;

                return (
                  <div
                    key={m.metric_id}
                    className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{m.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-muted-foreground">
                          Vazni: {m.weight}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-[11px]">
                          Haqiqiy: <strong>{m.actual_value}</strong> / Reja: {m.target}
                        </span>
                        <span className={`font-black text-xs ${textColor}`}>
                          {m.score} ball
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${barColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: progressWidth }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bonus Map Glass Strip */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0E4F4F]/10 via-[#C6A15B]/10 to-transparent backdrop-blur-md border border-[#C6A15B]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-foreground flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#C6A15B]" /> Mukofot jadvali:
        </span>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-border">
            100–109 ball → <strong>+5%</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-border">
            110–119 ball → <strong>+10%</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-[#C6A15B] font-bold">
            120 ball → <strong>+15%</strong>
          </span>
        </div>
      </div>

      {/* 6-Month History Chart */}
      <div className="p-5 rounded-3xl bg-card/80 backdrop-blur-xl border border-border space-y-3 shadow-sm">
        <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#C6A15B]" />
          <span>Oxirgi 6 oylik KPI dinamikasi</span>
        </h4>

        <div className="grid grid-cols-6 gap-2 pt-2">
          {historyData.map((item, idx) => {
            const heightPercent = Math.min(100, Math.max(20, (item.score / 120) * 100));
            const isLatest = idx === historyData.length - 1;
            return (
              <div key={item.periodKey} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-foreground">{item.score}</span>
                <div className="w-full max-w-[36px] h-28 rounded-2xl bg-black/5 dark:bg-white/5 p-1 flex flex-col justify-end border border-border">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.7, delay: idx * 0.1 }}
                    className={`w-full rounded-xl transition-all ${
                      item.score >= 100
                        ? 'bg-[#10B981]'
                        : item.score >= 80
                        ? 'bg-[#C6A15B]'
                        : 'bg-[#E11D48]'
                    } ${isLatest ? 'ring-2 ring-[#0E4F4F] dark:ring-[#C6A15B]' : ''}`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground truncate font-medium">
                  {item.period}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
