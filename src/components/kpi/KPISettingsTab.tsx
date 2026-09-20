import React, { useState } from 'react';
import { Plus, Trash2, Check, AlertCircle, Sliders, ShieldAlert } from 'lucide-react';
import { KPIMetric, KPISource, KPIDirection, KPIPeriodType } from '../../types';
import { validateMetricWeights } from '../../lib/kpi';

interface KPISettingsTabProps {
  metrics: KPIMetric[];
  onSaveMetric: (metric: KPIMetric) => boolean;
  onDeleteMetric: (id: number) => boolean;
  onShowToast: (msg: string) => void;
}

export const KPISettingsTab: React.FC<KPISettingsTabProps> = ({
  metrics,
  onSaveMetric,
  onDeleteMetric,
  onShowToast,
}) => {
  const [editingMetric, setEditingMetric] = useState<Partial<KPIMetric> | null>(null);

  const { sum, valid } = validateMetricWeights(metrics);

  const handleStartAdd = () => {
    setEditingMetric({
      id: Date.now(),
      company_id: 1,
      name: '',
      source: 'tasks',
      target: 100,
      direction: 'up',
      weight: 10,
      period: 'month',
      active: true,
    });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMetric || !editingMetric.name) {
      onShowToast('Ko‘rsatkich nomini kiriting');
      return;
    }

    const fullMetric: KPIMetric = {
      id: editingMetric.id || Date.now(),
      company_id: 1,
      name: editingMetric.name,
      source: (editingMetric.source as KPISource) || 'tasks',
      target: Number(editingMetric.target || 100),
      direction: (editingMetric.direction as KPIDirection) || 'up',
      weight: Number(editingMetric.weight || 0),
      period: (editingMetric.period as KPIPeriodType) || 'month',
      active: editingMetric.active !== false,
      created_at: editingMetric.created_at || new Date().toISOString(),
    };

    const success = onSaveMetric(fullMetric);
    if (success) {
      setEditingMetric(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Validation Status */}
      <div className="p-4 rounded-3xl bg-card/80 backdrop-blur-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Live Progress Ring */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 rotate-[-90deg]">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                className="text-black/10 dark:text-white/10"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke={valid ? '#C6A15B' : '#E11D48'}
                strokeWidth="4"
                strokeDasharray={113}
                strokeDashoffset={113 - (Math.min(100, sum) / 100) * 113}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[11px] font-black">{sum}%</span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C6A15B]" />
              <span>KPI Ko‘rsatkichlar me’yori</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Faol ko‘rsatkichlar og‘irligi: <strong className={valid ? 'text-[#C6A15B]' : 'text-[#E11D48]'}>{sum}%</strong> (kerak: 100%)
            </p>
          </div>
        </div>

        <button
          onClick={handleStartAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi ko‘rsatkich</span>
        </button>
      </div>

      {/* Metrics List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border space-y-3 relative group shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-foreground">{m.name}</h4>
                <span className="text-[11px] text-muted-foreground capitalize">
                  Manba: <strong>{m.source}</strong> • Yo‘nalish: <strong>{m.direction === 'up' ? 'Yuqori (↑)' : 'Quyi (↓)'}</strong>
                </span>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-[#C6A15B]/15 text-[#C6A15B] font-extrabold text-xs border border-[#C6A15B]/30">
                {m.weight}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
              <span className="text-muted-foreground">
                Reja nishoni: <strong className="text-foreground">{m.target} {m.source === 'rating' ? 'ball' : '%'}</strong>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingMetric(m)}
                  className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-semibold text-foreground transition cursor-pointer"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => onDeleteMetric(m.id)}
                  className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal Sheet */}
      {editingMetric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveModal}
            className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-base text-foreground">
              {editingMetric.name ? 'Ko‘rsatkichni tahrirlash' : 'Yangi KPI ko‘rsatkichi'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Ko‘rsatkich nomi (O‘zbekcha)</label>
                <input
                  type="text"
                  required
                  value={editingMetric.name || ''}
                  onChange={(e) => setEditingMetric({ ...editingMetric, name: e.target.value })}
                  placeholder="Masalan: Davomat intizomi"
                  className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Manba (Source)</label>
                  <select
                    value={editingMetric.source || 'tasks'}
                    onChange={(e) => setEditingMetric({ ...editingMetric, source: e.target.value as KPISource })}
                    className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-foreground"
                  >
                    <option value="attendance">Davomat (attendance)</option>
                    <option value="sales">Savdo (sales)</option>
                    <option value="tasks">Vazifalar (tasks)</option>
                    <option value="rating">Mijoz bahosi (rating)</option>
                    <option value="manual">Qo‘lda kiritish (manual)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Og‘irlik vazni (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={editingMetric.weight ?? 10}
                    onChange={(e) => setEditingMetric({ ...editingMetric, weight: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Reja (Target)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingMetric.target ?? 100}
                    onChange={(e) => setEditingMetric({ ...editingMetric, target: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Yo‘nalish (Direction)</label>
                  <select
                    value={editingMetric.direction || 'up'}
                    onChange={(e) => setEditingMetric({ ...editingMetric, direction: e.target.value as KPIDirection })}
                    className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-foreground"
                  >
                    <option value="up">Yuqori yaxshi (Up ↑)</option>
                    <option value="down">Quyi yaxshi (Down ↓)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingMetric(null)}
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
      )}
    </div>
  );
};
