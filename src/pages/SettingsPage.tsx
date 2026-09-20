import React, { useState } from 'react';
import {
  Building,
  Settings,
  Shield,
  KeyRound,
  Save,
  CheckCircle2,
  Clock,
  Banknote,
  FileCode,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { Company, AuditLog } from '../types';
import { formatUZS } from '../lib/uzbekistanHrmsCalculations';

interface SettingsPageProps {
  company: Company;
  auditLogs: AuditLog[];
  onSaveCompany: (updated: Company) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  company,
  auditLogs,
  onSaveCompany,
}) => {
  const [activeTab, setActiveTab] = useState<'company' | 'payroll' | 'integrations' | 'audit'>('company');
  const [formData, setFormData] = useState({
    name: company.name,
    legal_name: company.legal_name,
    tax_id: company.tax_id,
    address: company.address,
    oked: company.oked,
    bank_name: company.bank_name || 'Kapitalbank ATB Toshkent shahar filiali',
    bank_account: company.bank_account,
    bank_mfo: company.bank_mfo,
    tax_jshds: 12,
    tax_social: 12,
    tax_inps: 0.1,
    grace_period_mins: company.settings.attendance_grace_period_minutes || 15,
    annual_leave_days: company.settings.annual_leave_default_days,
  });
  const [saveNotice, setSaveNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCompany({
      ...company,
      name: formData.name,
      legal_name: formData.legal_name,
      tax_id: formData.tax_id,
      address: formData.address,
      oked: formData.oked,
      bank_name: formData.bank_name,
      bank_account: formData.bank_account,
      bank_mfo: formData.bank_mfo,
      settings: {
        ...company.settings,
        attendance_grace_period_minutes: Number(formData.grace_period_mins),
        annual_leave_default_days: Number(formData.annual_leave_days),
      },
    });
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0E4F4F]">
            Tizim Sozlamalari & Integratsiyalar
          </h2>
          <p className="text-xs text-gray-500">
            Kompaniya rekvizitlari, O‘zbekiston soliq stavkalari va tashqi tizimlar ulanishi
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0E4F4F] text-white hover:bg-[#093535] shadow-xs active:scale-95 transition self-start sm:self-auto"
        >
          <Save className="w-4 h-4 text-[#C6A15B]" />
          <span>O‘zgarishlarni saqlash</span>
        </button>
      </div>

      {saveNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Barcha sozlamalar muvaffaqiyatli yangilandi!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveTab('company')}
          className={`py-2.5 px-3 border-b-2 transition ${
            activeTab === 'company'
              ? 'border-[#0E4F4F] text-[#0E4F4F]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Kompaniya Profili (Rekvizitlar)
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`py-2.5 px-3 border-b-2 transition ${
            activeTab === 'payroll'
              ? 'border-[#0E4F4F] text-[#0E4F4F]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Mehnat & Soliq Qoidalari
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`py-2.5 px-3 border-b-2 transition ${
            activeTab === 'integrations'
              ? 'border-[#0E4F4F] text-[#0E4F4F]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          1C, Soliq.uz, E-IMZO, Click/Payme
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2.5 px-3 border-b-2 transition ${
            activeTab === 'audit'
              ? 'border-[#0E4F4F] text-[#0E4F4F]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Tizim Auditi (Xavfsizlik jurnali)
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'company' && (
        <form onSubmit={handleSave} className="aluvantis-card p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Brend nomi:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">To‘liq yuridik nomi:</label>
              <input
                type="text"
                value={formData.legal_name}
                onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">STIR (INN - 9 raqam):</label>
              <input
                type="text"
                value={formData.tax_id}
                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">IFUT (OKED):</label>
              <input
                type="text"
                value={formData.oked}
                onChange={(e) => setFormData({ ...formData, oked: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Xizmat ko‘rsatuvchi bank:</label>
              <input
                type="text"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">Bank MFO kodi:</label>
              <input
                type="text"
                value={formData.bank_mfo}
                onChange={(e) => setFormData({ ...formData, bank_mfo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-600 font-medium mb-1">Hisob-kitob raqami (20 xonali):</label>
              <input
                type="text"
                value={formData.bank_account}
                onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[#0E4F4F] font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-600 font-medium mb-1">Yuridik manzil:</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>
          </div>
        </form>
      )}

      {activeTab === 'payroll' && (
        <div className="aluvantis-card p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
              <label className="block text-gray-600 font-medium">JShDS (Jismoniy shaxslar daromad solig‘i):</label>
              <p className="font-bold text-lg text-[#0E4F4F]">12%</p>
              <span className="text-[10px] text-gray-400">O‘zR Soliq kodeksi 381-moddasi</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
              <label className="block text-gray-600 font-medium">Ijtimoiy soliq (Korxona stavkasi):</label>
              <p className="font-bold text-lg text-[#0E4F4F]">12%</p>
              <span className="text-[10px] text-gray-400">O‘zR Soliq kodeksi 405-moddasi</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
              <label className="block text-gray-600 font-medium">Shaxsiy INPS badali (Xalq banki):</label>
              <p className="font-bold text-lg text-purple-700">0.1%</p>
              <span className="text-[10px] text-gray-400">JShDS hisobidan chegiriladi</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
              <label className="block text-gray-600 font-medium">Kechikish uchun kechirim vaqti (Grace period):</label>
              <input
                type="number"
                value={formData.grace_period_mins}
                onChange={(e) => setFormData({ ...formData, grace_period_mins: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 mt-1 font-semibold"
              />
              <span className="text-[10px] text-gray-400">Daqiqa (masalan, 15 daqiqagacha kechikish jarimasiz)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="aluvantis-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#0E4F4F]">1C:Enterprise (ЗУП 8.3)</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Sinxron faol
              </span>
            </div>
            <p className="text-gray-500">
              Okladlar, tabel va hisob-kitoblarni 1C ZUP bazasiga avtomatik uzatish.
            </p>
            <div className="p-2.5 bg-gray-50 rounded-xl font-mono text-[11px] text-gray-600">
              URL: https://1c.aluvantis.uz/zup/odata/v4/
            </div>
          </div>

          <div className="aluvantis-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#0E4F4F]">my.soliq.uz (Soliq Qo‘mitasi)</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Sertifikat ulangan
              </span>
            </div>
            <p className="text-gray-500">
              1-mehnat hisobotini avtomatik shakllantirish va soliq portaliga jo‘natish.
            </p>
            <div className="p-2.5 bg-gray-50 rounded-xl font-mono text-[11px] text-gray-600">
              E-IMZO Seriyasi: 78F3B9A1209 • Muddati: 2027-yilgacha
            </div>
          </div>

          <div className="aluvantis-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#0E4F4F]">Click Up & Payme Business</h4>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold">
                MFO 00450
              </span>
            </div>
            <p className="text-gray-500">
              Uzcard va Humo maosh loyihalari bo‘yicha to‘lovlarni bir klikda tasdiqlash.
            </p>
            <div className="p-2.5 bg-gray-50 rounded-xl font-mono text-[11px] text-gray-600">
              Merchant ID: 89104 • Terminal ID: 70912
            </div>
          </div>

          <div className="aluvantis-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#0E4F4F]">Telegram Bot</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Online
              </span>
            </div>
            <p className="text-gray-500">
              Davomat va xodimlar arizalarini tezkor boshqarish boti (@aluvantis_hrms_bot).
            </p>
            <div className="p-2.5 bg-gray-50 rounded-xl font-mono text-[11px] text-gray-600">
              Bot: @aluvantis_hrms_bot
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="aluvantis-card overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
              Xavfsizlik va harakatlar jurnali (Audit Trail)
            </h3>
            <span className="text-xs text-gray-400">{auditLogs.length} ta yozuv</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                  <th className="p-3">Vaqti</th>
                  <th className="p-3">Foydalanuvchi</th>
                  <th className="p-3">Harakat</th>
                  <th className="p-3">Tafsilot</th>
                  <th className="p-3">IP manzil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/70">
                    <td className="p-3 font-mono text-[11px] text-gray-500">
                      {log.created_at.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="p-3 font-semibold text-gray-800">
                      User #{log.user_id}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800 uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {log.details}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-400">
                      {log.ip_address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
