import React, { useState, useEffect } from 'react';
import {
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Camera,
  Fingerprint,
  RefreshCw,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { AttendanceRecord, Employee, Shift } from '../types';

interface AttendancePageProps {
  attendance: AttendanceRecord[];
  employees: Employee[];
  shifts: Shift[];
  onCheckIn: (employeeId: number, method: 'qr' | 'biometric' | 'gps' | 'manual') => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  attendance,
  employees,
  shifts,
  onCheckIn,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<number>(employees[0]?.id || 1);
  const [qrToken, setQrToken] = useState<string>('ALV-QR-' + Math.random().toString(36).substring(2, 9));
  const [scanSuccessMsg, setScanSuccessMsg] = useState<string | null>(null);
  const [gpsSimulating, setGpsSimulating] = useState(false);

  // Rotate QR code every 15 seconds for dynamic anti-screenshot security
  useEffect(() => {
    const interval = setInterval(() => {
      setQrToken('ALV-QR-' + Math.random().toString(36).substring(2, 9).toUpperCase());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateCheckIn = (method: 'qr' | 'biometric' | 'gps') => {
    const emp = employees.find((e) => e.id === selectedEmpId);
    onCheckIn(selectedEmpId, method);
    setScanSuccessMsg(`${emp?.full_name} muvaffaqiyatli ro‘yxatdan o‘tdi (${method.toUpperCase()})`);
    setTimeout(() => setScanSuccessMsg(null), 4000);
  };

  const handleExportTabel = () => {
    // Generate Tabel T-13 format
    const rows = employees.map((emp) => {
      const rec = attendance.find((a) => a.employee_id === emp.id);
      return `${emp.id},"${emp.full_name}","${emp.position}",8,"${rec ? 'Ya' : 'N'}"`;
    });
    const csv = 'data:text/csv;charset=utf-8,\uFEFF' + ['Tabel_No,F.I.SH,Lavozim,Soat,Belgi', ...rows].join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Tabel_T13_Davomat_2026_09.csv`;
    link.click();
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0E4F4F]">
            Davomat va Kirish-chiqish nazorati
          </h2>
          <p className="text-xs text-gray-500">
            Dinamik QR-kod, GPS geolokatsiya va ofis biometrik tizimi
          </p>
        </div>

        <button
          onClick={handleExportTabel}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#0E4F4F]/20 text-[#0E4F4F] hover:bg-[#F6F3EC] transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>Tabel T-13 hisoboti (Excel)</span>
        </button>
      </div>

      {scanSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{scanSuccessMsg}</span>
        </div>
      )}

      {/* 2-Column Split: QR Station & Live Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Check-In Terminal Simulator */}
        <div className="aluvantis-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
              Tezkor kirish-chiqish
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
              Ofis terminali
            </span>
          </div>

          <div>
            <label className="block text-gray-600 text-xs font-medium mb-1">
              Xodimni tanlang:
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0E4F4F]"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Dynamic QR Code Container */}
          <div className="p-4 bg-[#F6F3EC] rounded-2xl border border-[#0E4F4F]/10 text-center space-y-3">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-gray-100 relative group">
              {/* Dynamic simulated vector QR */}
              <div className="w-40 h-40 mx-auto flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl p-2 font-mono text-[10px]">
                <QrCode className="w-24 h-24 text-[#0E4F4F]" />
                <span className="text-[9px] text-[#C6A15B] font-bold mt-1 tracking-wider">
                  {qrToken}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                <span>Har 15 soniyada yangilanadi</span>
              </p>
            </div>

            <p className="text-[11px] text-gray-600 leading-snug">
              Xodim mobil ilovasi orqali QR kodni skanerlaydi yoki ofis planshetiga PIN kod kiritadi.
            </p>

            {/* Check-In Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleSimulateCheckIn('qr')}
                className="p-2 rounded-xl bg-[#0E4F4F] text-white text-[11px] font-semibold hover:bg-[#093535] flex flex-col items-center gap-1 transition active:scale-95"
              >
                <QrCode className="w-4 h-4 text-[#C6A15B]" />
                <span>QR bilan</span>
              </button>

              <button
                onClick={() => handleSimulateCheckIn('biometric')}
                className="p-2 rounded-xl bg-white border border-[#0E4F4F]/20 text-[#0E4F4F] text-[11px] font-semibold hover:bg-gray-50 flex flex-col items-center gap-1 transition active:scale-95"
              >
                <Fingerprint className="w-4 h-4 text-[#0E4F4F]" />
                <span>Barmoq izi</span>
              </button>

              <button
                onClick={() => handleSimulateCheckIn('gps')}
                className="p-2 rounded-xl bg-white border border-[#0E4F4F]/20 text-[#0E4F4F] text-[11px] font-semibold hover:bg-gray-50 flex flex-col items-center gap-1 transition active:scale-95"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>GPS radius</span>
              </button>
            </div>
          </div>

          {/* Tashkent Geofence Status */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#0E4F4F] font-semibold text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Toshkent Bosh Ofisi Geozonasi</span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono">
              Koordinatalar: 41.311081, 69.240562
            </p>
            <p className="text-[10px] text-emerald-700 font-medium">
              Ruxsat etilgan radius: 150 metr (Ofis hududi ichida)
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Real-Time Live Attendance Feed */}
        <div className="lg:col-span-2 aluvantis-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-sm text-[#0E4F4F]">
                Bugungi davomat jurnali (19-Sentabr 2026)
              </h3>
              <p className="text-xs text-gray-400">Kirish vaqti va identifikatsiya usuli</p>
            </div>
            <span className="text-xs font-semibold text-[#0E4F4F] bg-[#0E4F4F]/10 px-2.5 py-1 rounded-full">
              {attendance.length} ta qayd
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                  <th className="p-3">Xodim</th>
                  <th className="p-3">Kirish vaqti</th>
                  <th className="p-3">Chiqish vaqti</th>
                  <th className="p-3">Usul</th>
                  <th className="p-3">Holati</th>
                  <th className="p-3">Izoh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendance.map((rec) => {
                  const emp = employees.find((e) => e.id === rec.employee_id);
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50/70 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={emp?.avatar_url}
                            alt={emp?.full_name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{emp?.full_name}</p>
                            <p className="text-[10px] text-gray-400">{emp?.department}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-mono font-semibold text-gray-700">
                        {rec.check_in_time.split('T')[1]?.slice(0, 8) || '08:55:00'}
                      </td>

                      <td className="p-3 font-mono text-gray-500">
                        {rec.check_out_time ? rec.check_out_time.split('T')[1]?.slice(0, 8) : '—'}
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-700 uppercase">
                          {rec.check_in_method}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            rec.status === 'ontime'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.status === 'ontime' ? 'O‘z vaqtida' : 'Kechikish'}
                        </span>
                      </td>

                      <td className="p-3 text-[11px] text-gray-500 max-w-xs truncate">
                        {rec.notes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
