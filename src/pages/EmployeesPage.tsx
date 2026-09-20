import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  LayoutGrid,
  List,
  FileSpreadsheet,
  Download,
  Phone,
  Mail,
  Building2,
  CreditCard,
  FileCheck,
  ChevronRight,
  X,
  Check,
  Edit2,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Employee, Shift, LeaveRequest, PayrollRecord, HRDocument } from '../types';
import { formatUZS, generate1CXml } from '../lib/uzbekistanHrmsCalculations';

interface EmployeesPageProps {
  employees: Employee[];
  shifts: Shift[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[];
  documents: HRDocument[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({
  employees,
  shifts,
  leaves,
  payroll,
  documents,
  onAddEmployee,
  onUpdateEmployee,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailTab, setDetailTab] = useState<'profile' | 'shifts' | 'leaves' | 'payroll' | 'documents'>('profile');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Employee Form State
  const [newEmp, setNewEmp] = useState({
    full_name: '',
    position: '',
    department: 'Muhandislik va IT',
    hire_date: new Date().toISOString().split('T')[0],
    base_salary: 18000000,
    inn: '309812456',
    pinfl: '31908954560012',
    passport_series: 'AA',
    passport_number: '1234567',
    bank_name: 'Kapitalbank ATB',
    bank_account: '20208000405123456001',
    phone: '+998901234567',
    address: 'Toshkent sh., Shayxontohur t.',
    gender: 'male' as 'male' | 'female',
    birth_date: '1995-05-15',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.pinfl.includes(searchQuery) ||
      emp.inn.includes(searchQuery);

    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Employee = {
      id: Date.now(),
      company_id: 1,
      full_name: newEmp.full_name,
      position: newEmp.position,
      department: newEmp.department,
      hire_date: newEmp.hire_date,
      base_salary: Number(newEmp.base_salary),
      currency: 'UZS',
      bank_name: newEmp.bank_name,
      bank_account: newEmp.bank_account,
      inn: newEmp.inn,
      pinfl: newEmp.pinfl,
      passport_series: newEmp.passport_series,
      passport_number: newEmp.passport_number,
      birth_date: newEmp.birth_date,
      gender: newEmp.gender,
      address: newEmp.address,
      emergency_contact_name: newEmp.emergency_contact_name || 'Oilasi',
      emergency_contact_phone: newEmp.emergency_contact_phone || '+998901112233',
      status: 'active',
      avatar_url: `https://images.unsplash.com/photo-${newEmp.gender === 'female' ? '1544005313-94ddf0286df2' : '1507003211169-0a1dd7228f2d'}?w=150&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString(),
    };
    onAddEmployee(created);
    setIsAddModalOpen(false);
  };

  const handleExport1C = () => {
    const xml = generate1CXml(
      'Aluvantis Technologies MChJ',
      '308912456',
      9,
      2026,
      payroll,
      employees
    );
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `1C_Aluvantis_Xodimlar_ZUP_2026_09.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'F.I.SH', 'Lavozim', 'Bo‘lim', 'STIR (INN)', 'PINFL', 'Oklad (UZS)', 'Holati'];
    const rows = employees.map((e) => [
      e.id,
      `"${e.full_name}"`,
      `"${e.position}"`,
      `"${e.department}"`,
      e.inn,
      e.pinfl,
      e.base_salary,
      e.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Aluvantis_Xodimlar_Royxati.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0E4F4F]">
            Xodimlar bazasi
          </h2>
          <p className="text-xs text-gray-500">
            O‘zbekiston Mehnat kodeksi va Soliq ma’lumotlari bo‘yicha to‘liq hisob
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExport1C}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#0E4F4F]/20 text-[#0E4F4F] hover:bg-[#F6F3EC] transition"
            title="1C:Enterprise (ЗУП) uchun XML eksport"
          >
            <Download className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>1C Eksport (XML)</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#0E4F4F]/20 text-[#0E4F4F] hover:bg-[#F6F3EC] transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Excel / CSV</span>
          </button>

          <button
            id="btn-add-employee"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0E4F4F] text-white hover:bg-[#093535] shadow-xs active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi xodim</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="aluvantis-card p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="F.I.SH, lavozim, PINFL yoki INN orqali qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0E4F4F] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:border-[#0E4F4F]"
          >
            <option value="all">Barcha bo‘limlar ({employees.length})</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-0.5 border border-gray-200 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white shadow-xs text-[#0E4F4F]' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Jadval ko‘rinishi"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-[#0E4F4F]' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Kartochka ko‘rinishi"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="aluvantis-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0E4F4F]/5 text-[#0E4F4F] font-semibold border-b border-[#0E4F4F]/10">
                  <th className="p-3.5">Xodim</th>
                  <th className="p-3.5">Bo‘lim / Lavozim</th>
                  <th className="p-3.5">PINFL / INN</th>
                  <th className="p-3.5">Oklad (UZS)</th>
                  <th className="p-3.5">Ishga qabul</th>
                  <th className="p-3.5">Holati</th>
                  <th className="p-3.5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-gray-50/80 cursor-pointer transition"
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar_url}
                          alt={emp.full_name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-[#0E4F4F]/10"
                        />
                        <div>
                          <p className="font-semibold text-[#14201F]">{emp.full_name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">{emp.passport_series} {emp.passport_number}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <p className="font-medium text-gray-800">{emp.position}</p>
                      <p className="text-[11px] text-[#C6A15B] font-medium">{emp.department}</p>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-gray-600">
                      <div>{emp.pinfl}</div>
                      <span className="text-[10px] text-gray-400">STIR: {emp.inn}</span>
                    </td>

                    <td className="p-3.5 font-semibold text-[#0E4F4F]">
                      {formatUZS(emp.base_salary)}
                    </td>

                    <td className="p-3.5 text-gray-600 font-mono text-[11px]">
                      {emp.hire_date}
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 capitalize">
                        {emp.status === 'active' ? 'Faol' : emp.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(emp);
                        }}
                        className="p-1 rounded-lg hover:bg-[#0E4F4F]/10 text-[#0E4F4F]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="aluvantis-card p-4 hover:border-[#0E4F4F]/40 cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar_url}
                    alt={emp.full_name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-[#0E4F4F]/20"
                  />
                  <div>
                    <h4 className="font-semibold text-xs text-[#14201F] leading-snug">{emp.full_name}</h4>
                    <p className="text-[11px] text-gray-500">{emp.position}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Faol
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] pt-2 border-t border-gray-100 text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-400">Bo‘lim:</span>
                  <span className="font-medium text-[#0E4F4F]">{emp.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">PINFL:</span>
                  <span className="font-mono">{emp.pinfl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Oklad:</span>
                  <span className="font-bold text-[#0E4F4F]">{formatUZS(emp.base_salary)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100">
                <span>Ishga qabul: {emp.hire_date}</span>
                <span className="text-[#C6A15B] font-semibold flex items-center">
                  Batafsil <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Detail Drawer / Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-[#0E4F4F]/10 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-[#0E4F4F] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.avatar_url}
                  alt={selectedEmployee.full_name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#C6A15B]"
                />
                <div>
                  <h3 className="font-display font-bold text-base text-white">{selectedEmployee.full_name}</h3>
                  <p className="text-xs text-white/70">{selectedEmployee.position} • {selectedEmployee.department}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-gray-200 px-5 text-xs font-semibold bg-gray-50 overflow-x-auto">
              {(['profile', 'shifts', 'leaves', 'payroll', 'documents'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`py-3 px-3 border-b-2 transition whitespace-nowrap capitalize ${
                    detailTab === tab
                      ? 'border-[#0E4F4F] text-[#0E4F4F]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab === 'profile' && 'Profil va Rekvizitlar'}
                  {tab === 'shifts' && 'Smenalar'}
                  {tab === 'leaves' && 'Ta’tillar'}
                  {tab === 'payroll' && 'Ish haqi tarixi'}
                  {tab === 'documents' && 'Hujjatlar & E-IMZO'}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
              {detailTab === 'profile' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-gray-50 space-y-2">
                    <p className="font-semibold text-gray-400 uppercase text-[10px]">Shaxsiy hujjatlar</p>
                    <p><strong>PINFL (JShShIR):</strong> {selectedEmployee.pinfl}</p>
                    <p><strong>STIR (INN):</strong> {selectedEmployee.inn}</p>
                    <p><strong>Pasport:</strong> {selectedEmployee.passport_series} {selectedEmployee.passport_number}</p>
                    <p><strong>Tug‘ilgan sana:</strong> {selectedEmployee.birth_date}</p>
                    <p><strong>Jinsi:</strong> {selectedEmployee.gender === 'female' ? 'Ayol' : 'Erkak'}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gray-50 space-y-2">
                    <p className="font-semibold text-gray-400 uppercase text-[10px]">Bank va to‘lov</p>
                    <p><strong>Bank nomi:</strong> {selectedEmployee.bank_name}</p>
                    <p><strong>Hisob raqam:</strong> <span className="font-mono">{selectedEmployee.bank_account}</span></p>
                    <p><strong>Asosiy oklad:</strong> <span className="font-bold text-[#0E4F4F]">{formatUZS(selectedEmployee.base_salary)}</span></p>
                    <p><strong>Ishga qabul:</strong> {selectedEmployee.hire_date}</p>
                  </div>

                  <div className="sm:col-span-2 p-3.5 rounded-2xl bg-gray-50 space-y-2">
                    <p className="font-semibold text-gray-400 uppercase text-[10px]">Aloqa va Favqulodda shaxs</p>
                    <p><strong>Yashash manzili:</strong> {selectedEmployee.address}</p>
                    <p><strong>Favqulodda aloqa:</strong> {selectedEmployee.emergency_contact_name} ({selectedEmployee.emergency_contact_phone})</p>
                    <p><strong>Telegram:</strong> {selectedEmployee.telegram_username || '@xodim'}</p>
                  </div>
                </div>
              )}

              {detailTab === 'shifts' && (
                <div className="space-y-2">
                  <p className="text-gray-500">Ushbu oy uchun belgilangan smenalar:</p>
                  {shifts
                    .filter((s) => s.employee_id === selectedEmployee.id)
                    .map((s) => (
                      <div key={s.id} className="p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{s.shift_date}</p>
                          <p className="text-gray-400 text-[11px]">{s.start_time} - {s.end_time} ({s.scheduled_hours} soat)</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-semibold capitalize">
                          {s.shift_type}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {detailTab === 'leaves' && (
                <div className="space-y-2">
                  {leaves
                    .filter((l) => l.employee_id === selectedEmployee.id)
                    .map((l) => (
                      <div key={l.id} className="p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">{l.leave_type} ta’tili</p>
                          <p className="text-gray-500 text-[11px]">{l.reason}</p>
                          <p className="text-gray-400 text-[10px] font-mono">{l.start_date} dan {l.end_date} gacha ({l.total_days} kun)</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            l.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {l.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {detailTab === 'payroll' && (
                <div className="space-y-2">
                  {payroll
                    .filter((p) => p.employee_id === selectedEmployee.id)
                    .map((p) => (
                      <div key={p.id} className="p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{p.year}-yil, {p.month}-oy</p>
                          <p className="text-gray-500 text-[11px]">Hisoblangan (Gross): {formatUZS(p.gross_salary)}</p>
                          <p className="text-[#0E4F4F] font-bold text-xs">Qo‘lga tegadigan (Net): {formatUZS(p.net_salary)}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase">
                          {p.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {detailTab === 'documents' && (
                <div className="space-y-2">
                  {documents
                    .filter((d) => d.employee_id === selectedEmployee.id)
                    .map((d) => (
                      <div key={d.id} className="p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-[#0E4F4F]" />
                          <div>
                            <p className="font-semibold text-gray-800">{d.title}</p>
                            <p className="text-emerald-700 text-[10px] font-mono">
                              E-IMZO bilan tasdiqlangan: {d.eimzoSignatureHash?.slice(0, 24)}...
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                          Yuridik kuchga ega
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0E4F4F] text-white"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-[#0E4F4F]/10 overflow-hidden my-6">
            <div className="bg-[#0E4F4F] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base">Yangi xodimni qabul qilish</h3>
                <p className="text-xs text-white/70">O‘zbekiston Mehnat kodeksiga mos ro‘yxatga olish</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-gray-600 font-medium mb-1">To‘liq F.I.SH *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Azizbek Rakhimov"
                    value={newEmp.full_name}
                    onChange={(e) => setNewEmp({ ...newEmp, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Lavozim *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Senior Backend Developer"
                    value={newEmp.position}
                    onChange={(e) => setNewEmp({ ...newEmp, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Bo‘lim *</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                  >
                    <option value="Muhandislik va IT">Muhandislik va IT</option>
                    <option value="Inson resurslari (HR)">Inson resurslari (HR)</option>
                    <option value="Moliya va buxgalteriya">Moliya va buxgalteriya</option>
                    <option value="Dizayn va Mahsulot">Dizayn va Mahsulot</option>
                    <option value="Savdo va Marketing">Savdo va Marketing</option>
                    <option value="Logistika va Ombor">Logistika va Ombor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">PINFL (JShShIR - 14 raqam) *</label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    placeholder="32007964560045"
                    value={newEmp.pinfl}
                    onChange={(e) => setNewEmp({ ...newEmp, pinfl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">STIR (INN - 9 raqam) *</label>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    placeholder="318723901"
                    value={newEmp.inn}
                    onChange={(e) => setNewEmp({ ...newEmp, inn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Pasport seriya va raqami *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={newEmp.passport_series}
                      onChange={(e) => setNewEmp({ ...newEmp, passport_series: e.target.value.toUpperCase() })}
                      className="w-16 px-3 py-2 rounded-xl border border-gray-200 uppercase font-mono"
                    />
                    <input
                      type="text"
                      maxLength={7}
                      value={newEmp.passport_number}
                      onChange={(e) => setNewEmp({ ...newEmp, passport_number: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Oylik oklad (UZS) *</label>
                  <input
                    type="number"
                    step="500000"
                    required
                    value={newEmp.base_salary}
                    onChange={(e) => setNewEmp({ ...newEmp, base_salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F] font-bold text-[#0E4F4F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-600 font-medium mb-1">Bank hisob raqami (20 xonali) *</label>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="20208000205456789004"
                    value={newEmp.bank_account}
                    onChange={(e) => setNewEmp({ ...newEmp, bank_account: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0E4F4F] text-white hover:bg-[#093535]"
                >
                  Xodimni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
