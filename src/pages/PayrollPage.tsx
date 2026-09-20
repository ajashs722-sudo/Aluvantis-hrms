import React, { useState } from 'react';
import {
  Banknote,
  Download,
  FileCheck2,
  Send,
  Calculator,
  Building,
  CheckCircle2,
  CreditCard,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PayrollRecord, Employee, Company } from '../types';
import {
  formatUZS,
  calculateUzbekistanPayroll,
  generate1CXml,
  generateClickPaymentLink,
  generatePaymePaymentLink,
} from '../lib/uzbekistanHrmsCalculations';
import { generatePayslipPdf } from '../lib/pdfGenerator';

interface PayrollPageProps {
  company: Company;
  payroll: PayrollRecord[];
  employees: Employee[];
  onApprovePayroll: (id: number) => void;
  onPayPayroll: (id: number) => void;
  onRunBatchCalculation: (month: number, year: number) => void;
}

export const PayrollPage: React.FC<PayrollPageProps> = ({
  company,
  payroll,
  employees,
  onApprovePayroll,
  onPayPayroll,
  onRunBatchCalculation,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeTab, setActiveTab] = useState<'runs' | 'calculator' | 'bank_registry'>('runs');

  // Interactive Live Calculator state
  const [calcSalary, setCalcSalary] = useState<number>(18000000);
  const [calcOvertimeHours, setCalcOvertimeHours] = useState<number>(4);
  const [calcBonus, setCalcBonus] = useState<number>(2000000);
  const [calcDeductions, setCalcDeductions] = useState<number>(0);

  const liveCalculation = calculateUzbekistanPayroll(
    calcSalary,
    calcOvertimeHours,
    calcBonus,
    calcDeductions
  );

  const filteredPayroll = payroll.filter(
    (p) => p.month === selectedMonth && p.year === selectedYear
  );

  const totalGross = filteredPayroll.reduce((acc, p) => acc + p.gross_salary, 0);
  const totalNet = filteredPayroll.reduce((acc, p) => acc + p.net_salary, 0);
  const totalJshds = filteredPayroll.reduce((acc, p) => acc + p.tax_jshds, 0);
  const totalInps = filteredPayroll.reduce((acc, p) => acc + (p.tax_pension_employee || p.inps_contribution || 0), 0);
  const totalSocial = filteredPayroll.reduce((acc, p) => acc + (p.tax_social || p.social_tax || 0), 0);

  const handleDownloadPayslip = (rec: PayrollRecord) => {
    const emp = employees.find((e) => e.id === rec.employee_id);
    if (emp) {
      generatePayslipPdf(rec, emp, company);
    }
  };

  const handleExport1CXml = () => {
    const xml = generate1CXml(
      company.name,
      company.tax_id,
      selectedMonth,
      selectedYear,
      filteredPayroll,
      employees
    );
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `1C_ZUP_Ish_Haqi_${selectedYear}_${selectedMonth}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportBankRegistry = () => {
    // Uzcard & Humo Bank Payroll Registry CSV
    const rows = filteredPayroll.map((p) => {
      const emp = employees.find((e) => e.id === p.employee_id);
      return `"${emp?.pinfl}","${emp?.bank_account}","${emp?.full_name}",${p.net_salary},"UZS","Oylik maosh ${selectedMonth}/${selectedYear}"`;
    });
    const header = 'PINFL,Hisob_Raqam,F.I.SH,Summa,Valyuta,Tolov_Maqsadi';
    const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [header, ...rows].join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Bank_Uzcard_Humo_Reestr_${selectedYear}_${selectedMonth}.csv`;
    link.click();
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0E4F4F]">
            Ish haqi, Soliq va Buxgalteriya
          </h2>
          <p className="text-xs text-gray-500">
            JShDS (12%), INPS (0.1%), Ijtimoiy soliq (12%) va Uzcard/Humo reestri
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport1CXml}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#0E4F4F]/20 text-[#0E4F4F] hover:bg-[#F6F3EC] transition"
            title="1C:ZUP XML fayli"
          >
            <Download className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>1C XML</span>
          </button>

          <button
            onClick={handleExportBankRegistry}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#0E4F4F]/20 text-[#0E4F4F] hover:bg-[#F6F3EC] transition"
            title="Uzcard / Humo Bank Reestri"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Bank Reestri (CSV)</span>
          </button>

          <button
            onClick={() => onRunBatchCalculation(selectedMonth, selectedYear)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0E4F4F] text-white hover:bg-[#093535] shadow-xs active:scale-95"
          >
            <Calculator className="w-4 h-4" />
            <span>Qayta hisoblash</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveTab('runs')}
          className={`py-2.5 px-3 border-b-2 transition ${
            activeTab === 'runs'
              ? 'border-[#0E4F4F] text-[#0E4F4F]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Oylik Ish haqi varaqalari
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`py-2.5 px-3 border-b-2 transition ${
            activeTab === 'calculator'
              ? 'border-[#0E4F4F] text-[#0E4F4F]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Interaktiv Soliq Kalkulyatori (2026)
        </button>
        <button
          onClick={() => setActiveTab('bank_registry')}
          className={`py-2.5 px-3 border-b-2 transition ${
            activeTab === 'bank_registry'
              ? 'border-[#0E4F4F] text-[#0E4F4F]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Click & Payme to‘lov havolalari
        </button>
      </div>

      {activeTab === 'runs' && (
        <div className="space-y-5">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="aluvantis-card p-4">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Gross (Jami hisob)</span>
              <p className="text-base sm:text-lg font-bold text-[#0E4F4F] mt-1 truncate">
                {formatUZS(totalGross)}
              </p>
              <span className="text-[10px] text-gray-500">{filteredPayroll.length} nafar xodim</span>
            </div>

            <div className="aluvantis-card p-4">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Net (Xodimlarga to‘lov)</span>
              <p className="text-base sm:text-lg font-bold text-emerald-700 mt-1 truncate">
                {formatUZS(totalNet)}
              </p>
              <span className="text-[10px] text-emerald-600">Kartalarga o‘tkaziladi</span>
            </div>

            <div className="aluvantis-card p-4">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">JShDS solig‘i (12%)</span>
              <p className="text-base sm:text-lg font-bold text-gray-800 mt-1 truncate">
                {formatUZS(totalJshds)}
              </p>
              <span className="text-[10px] text-gray-500">INPS badali: {formatUZS(totalInps)}</span>
            </div>

            <div className="aluvantis-card p-4">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Ijtimoiy soliq (12%)</span>
              <p className="text-base sm:text-lg font-bold text-amber-700 mt-1 truncate">
                {formatUZS(totalSocial)}
              </p>
              <span className="text-[10px] text-gray-500">Korxona hisobidan byudjetga</span>
            </div>
          </div>

          {/* Payroll Table */}
          <div className="aluvantis-card overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
                Sentabr 2026 — Ish haqi hisob-kitob qaydnomasi
              </h3>
              <span className="text-xs text-[#C6A15B] font-semibold">
                O‘zbekiston Respublikasi Mehnat kodeksiga muvofiq
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                    <th className="p-3">Xodim</th>
                    <th className="p-3">Oklad</th>
                    <th className="p-3">Qo‘shimcha ish</th>
                    <th className="p-3">Mukofot</th>
                    <th className="p-3">Gross (Jami)</th>
                    <th className="p-3">JShDS (12%)</th>
                    <th className="p-3">INPS (0.1%)</th>
                    <th className="p-3 font-bold text-[#0E4F4F]">Net (Qo‘lga)</th>
                    <th className="p-3">Holati</th>
                    <th className="p-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayroll.map((p) => {
                    const emp = employees.find((e) => e.id === p.employee_id);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/70 transition">
                        <td className="p-3">
                          <div className="font-semibold text-gray-900">{emp?.full_name}</div>
                          <div className="text-[10px] text-gray-400">{emp?.position}</div>
                        </td>

                        <td className="p-3 font-mono text-gray-700">
                          {formatUZS(p.base_salary)}
                        </td>

                        <td className="p-3 font-mono text-gray-700">
                          {p.overtime_pay > 0 ? (
                            <span className="text-blue-600 font-semibold">
                              +{formatUZS(p.overtime_pay)}
                            </span>
                          ) : (
                            '0'
                          )}
                        </td>

                        <td className="p-3 font-mono text-gray-700">
                          {(p.bonuses || p.bonus_pay || 0) > 0 ? (
                            <span className="text-emerald-600 font-semibold">
                              +{formatUZS(p.bonuses || p.bonus_pay || 0)}
                            </span>
                          ) : (
                            '0'
                          )}
                        </td>

                        <td className="p-3 font-mono font-bold text-gray-900">
                          {formatUZS(p.gross_salary)}
                        </td>

                        <td className="p-3 font-mono text-red-600">
                          -{formatUZS(p.tax_jshds)}
                        </td>

                        <td className="p-3 font-mono text-purple-700 text-[11px]">
                          {formatUZS(p.tax_pension_employee || p.inps_contribution || 0)}
                        </td>

                        <td className="p-3 font-mono font-bold text-emerald-700 text-xs">
                          {formatUZS(p.net_salary)}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              p.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDownloadPayslip(p)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#0E4F4F] hover:text-white transition text-gray-600"
                              title="Hisob-kitob varaqasi (PDF)"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            {(p.status === 'draft' || p.status === 'calculated') && (
                              <button
                                onClick={() => onApprovePayroll(p.id)}
                                className="px-2 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700"
                              >
                                Tasdiqlash
                              </button>
                            )}

                            {p.status === 'approved' && (
                              <button
                                onClick={() => onPayPayroll(p.id)}
                                className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-700"
                              >
                                To‘lash
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Interactive UZ Tax Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="aluvantis-card p-5 space-y-4">
            <h3 className="font-display font-bold text-sm text-[#0E4F4F] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#C6A15B]" />
              <span>Oylik ish haqi va Soliq parametrlari</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Asosiy oklad (UZS):
                </label>
                <input
                  type="number"
                  step="500000"
                  value={calcSalary}
                  onChange={(e) => setCalcSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-[#0E4F4F]"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Ish vaqtidan tashqari ishlangan soatlar (1.5x stavka):
                </label>
                <input
                  type="number"
                  value={calcOvertimeHours}
                  onChange={(e) => setCalcOvertimeHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Mukofot puli (Bonus):
                </label>
                <input
                  type="number"
                  step="200000"
                  value={calcBonus}
                  onChange={(e) => setCalcBonus(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Ushlanmalar (Aliment, jarima va b.):
                </label>
                <input
                  type="number"
                  value={calcDeductions}
                  onChange={(e) => setCalcDeductions(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Results Breakdown */}
          <div className="aluvantis-card p-5 space-y-4 bg-gradient-to-br from-white to-[#F6F3EC]">
            <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
              O‘zbekiston qonunchiligi bo‘yicha hisob-kitob
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="text-gray-600">Asosiy oklad:</span>
                <span className="font-mono font-semibold text-gray-800">{formatUZS(calcSalary)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="text-gray-600">Sverxurochniy ({calcOvertimeHours} soat @ 1.5x):</span>
                <span className="font-mono font-semibold text-blue-600">+{formatUZS(liveCalculation.overtime_pay)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="text-gray-600">Mukofot va ustamalar:</span>
                <span className="font-mono font-semibold text-emerald-600">+{formatUZS(calcBonus)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200 font-bold bg-[#0E4F4F]/5 px-2 rounded-lg">
                <span className="text-[#0E4F4F]">Hisoblangan jami (Gross):</span>
                <span className="font-mono text-[#0E4F4F]">{formatUZS(liveCalculation.gross_salary)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-200 text-red-600">
                <span>JShDS (Daromad solig‘i - 12%):</span>
                <span className="font-mono font-semibold">-{formatUZS(liveCalculation.tax_jshds)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200 text-purple-700">
                <span>Shundan INPS (0.1% Xalq Bankiga):</span>
                <span className="font-mono font-semibold">{formatUZS(liveCalculation.tax_pension_employee)}</span>
              </div>

              <div className="flex justify-between py-2 border-b-2 border-[#0E4F4F] font-bold text-sm bg-emerald-50 px-2 rounded-lg text-emerald-800">
                <span>Xodim qo‘liga tegadigan (Net):</span>
                <span className="font-mono">{formatUZS(liveCalculation.net_salary)}</span>
              </div>

              <div className="pt-2 text-[11px] text-gray-500">
                <p>
                  <strong>Korxona xarajati (Ijtimoiy soliq 12%):</strong> {formatUZS(liveCalculation.tax_social)}
                </p>
                <p className="mt-1">
                  <strong>Korxona uchun jami xarajat:</strong> {formatUZS(liveCalculation.gross_salary + liveCalculation.tax_social)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click / Payme links */}
      {activeTab === 'bank_registry' && (
        <div className="aluvantis-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
                Click Up & Payme Business orqali oklad tarqatish
              </h3>
              <p className="text-xs text-gray-500">
                Uzcard va Humo kartalariga to‘g‘ridan-to‘g‘ri maosh o‘tkazish
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPayroll.slice(0, 4).map((p) => {
              const emp = employees.find((e) => e.id === p.employee_id);
              const clickUrl = generateClickPaymentLink(
                company.bank_account,
                p.net_salary,
                `Oylik_${p.month}_${emp?.full_name}`
              );
              const paymeUrl = generatePaymePaymentLink(
                company.tax_id,
                p.net_salary,
                `Oylik_${p.month}_${emp?.full_name}`
              );

              return (
                <div key={p.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{emp?.full_name}</p>
                      <p className="text-[11px] text-gray-500">{emp?.position}</p>
                    </div>
                    <span className="font-mono font-bold text-[#0E4F4F] text-sm">
                      {formatUZS(p.net_salary)}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400 font-mono">
                    H/R: {emp?.bank_account} • {emp?.bank_name}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={clickUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-center font-semibold text-[11px] hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <span>Click orqali to‘lash</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={paymeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 rounded-xl bg-teal-600 text-white text-center font-semibold text-[11px] hover:bg-teal-700 flex items-center justify-center gap-1"
                    >
                      <span>Payme to‘lov</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
