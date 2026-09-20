import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Building,
  TrendingUp,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Employee, AttendanceRecord, PayrollRecord, Company } from '../types';
import { formatUZS, generateSoliqUzXml } from '../lib/uzbekistanHrmsCalculations';

interface ReportsPageProps {
  company: Company;
  employees: Employee[];
  attendance: AttendanceRecord[];
  payroll: PayrollRecord[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  company,
  employees,
  attendance,
  payroll,
}) => {
  const [selectedReport, setSelectedReport] = useState<'turnover' | 'soliq' | 'attendance'>('turnover');

  const totalPayroll = payroll.reduce((acc, p) => acc + p.gross_salary, 0);
  const totalTaxJshds = payroll.reduce((acc, p) => acc + p.tax_jshds, 0);
  const totalSocial = payroll.reduce((acc, p) => acc + (p.tax_social || p.social_tax || 0), 0);

  const handleExportSoliqXml = () => {
    const xml = generateSoliqUzXml(company.tax_id, 9, 2026, payroll, employees);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SoliqUz_1_Mehnat_Hisoboti_${company.tax_id}_2026_09.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0E4F4F]">
            Tahliliy Hisobotlar & Davlat Organlari
          </h2>
          <p className="text-xs text-gray-500">
            my.soliq.uz (1-mehnat hisoboti), Davlat Statistika qo‘mitasi va ichki audit ko‘rsatkichlari
          </p>
        </div>

        <button
          onClick={handleExportSoliqXml}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0E4F4F] text-white hover:bg-[#093535] shadow-xs active:scale-95 transition self-start sm:self-auto"
          title="my.soliq.uz elektron hisobot portali uchun XML"
        >
          <Download className="w-4 h-4 text-[#C6A15B]" />
          <span>my.soliq.uz Hisoboti (XML)</span>
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="aluvantis-card p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Davomat intizomi (Punctuality)</span>
            <Clock className="w-4 h-4 text-[#0E4F4F]" />
          </div>
          <p className="font-display font-bold text-2xl text-emerald-700">92.4%</p>
          <span className="text-[10px] text-gray-400">O‘rtacha kechikish: 8 daqiqa</span>
        </div>

        <div className="aluvantis-card p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Kadrlar qo‘nimsizligi (Turnover)</span>
            <Users className="w-4 h-4 text-[#0E4F4F]" />
          </div>
          <p className="font-display font-bold text-2xl text-[#0E4F4F]">2.1%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">IT sohasida past ko‘rsatkich</span>
        </div>

        <div className="aluvantis-card p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Byudjetga soliq to‘lovlari (Jami)</span>
            <Building className="w-4 h-4 text-[#C6A15B]" />
          </div>
          <p className="font-display font-bold text-xl sm:text-2xl text-gray-900 truncate">
            {formatUZS(totalTaxJshds + totalSocial)}
          </p>
          <span className="text-[10px] text-gray-400">JShDS (12%) + Ijtimoiy soliq (12%)</span>
        </div>
      </div>

      {/* Soliq and 1-Mehnat Official Section */}
      <div className="aluvantis-card p-6 space-y-4 border-[#0E4F4F]/20 bg-[#F6F3EC]/40">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#0E4F4F] font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
              <span>O‘zbekiston Respublikasi Soliq Qo‘mitasi (my.soliq.uz) Integratsiyasi</span>
            </div>
            <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
              «1-mehnat shakli: Mehnat hisoboti va ish haqi fondi» shakli bo‘yicha avtomatik shakllantirilgan
              XML fayl. Bosh buxgalter ushbu faylni yuklab olib, my.soliq.uz kabinetiga to‘g‘ridan-to‘g‘ri yuklashi mumkin.
            </p>
          </div>

          <button
            onClick={handleExportSoliqXml}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#0E4F4F]/20 text-[#0E4F4F] hover:bg-white transition"
          >
            <Download className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>XML yuklab olish</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <span className="text-gray-400 text-[11px]">Korxona STIR (INN):</span>
            <p className="font-mono font-bold text-gray-800">{company.tax_id}</p>
          </div>
          <div>
            <span className="text-gray-400 text-[11px]">Hisobot davri:</span>
            <p className="font-semibold text-gray-800">2026-yil, 3-chorak (Sentabr)</p>
          </div>
          <div>
            <span className="text-gray-400 text-[11px]">Jami mehnatga haq to‘lash fondi:</span>
            <p className="font-bold text-[#0E4F4F]">{formatUZS(totalPayroll)}</p>
          </div>
          <div>
            <span className="text-gray-400 text-[11px]">Hisoblangan JShDS:</span>
            <p className="font-bold text-red-600">{formatUZS(totalTaxJshds)}</p>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="aluvantis-card p-5 space-y-4">
        <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
          Bo‘limlar kesimida shtat va ish haqi tahlili
        </h3>

        <div className="divide-y divide-gray-100 text-xs">
          {Array.from(new Set(employees.map((e) => e.department))).map((dept) => {
            const deptEmps = employees.filter((e) => e.department === dept);
            const deptPayroll = deptEmps.reduce((acc, e) => acc + e.base_salary, 0);

            return (
              <div key={dept} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{dept}</h4>
                  <p className="text-[11px] text-gray-400">{deptEmps.length} nafar xodim</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#0E4F4F] font-mono">{formatUZS(deptPayroll)}</p>
                  <p className="text-[10px] text-gray-400">Oylik fond</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
