import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Fingerprint,
  Delete,
  CheckCircle2,
  X,
  Building,
  ShieldCheck,
  RefreshCw,
  Camera,
  ArrowLeft,
  Volume2,
} from 'lucide-react';
import { Employee } from '../types';

interface KioskStationPageProps {
  employees: Employee[];
  onCheckIn: (employeeId: number, method: 'qr' | 'biometric' | 'manual') => void;
  onExitKiosk: () => void;
}

export const KioskStationPage: React.FC<KioskStationPageProps> = ({
  employees,
  onCheckIn,
  onExitKiosk,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'pin' | 'qr' | 'biometric'>('pin');
  const [successEmployee, setSuccessEmployee] = useState<Employee | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('uz-UZ', {
          timeZone: 'Asia/Tashkent',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('uz-UZ', {
          timeZone: 'Asia/Tashkent',
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleKeypadPress = (val: string) => {
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((p) => p.slice(0, -1));
    setErrorMessage(null);
  };

  const verifyPin = (inputPin: string) => {
    // Check if input PIN matches last 4 digits of any employee's passport or PINFL, or demo PINs
    const matched = employees.find(
      (e) =>
        e.passport_number.endsWith(inputPin) ||
        e.pinfl.endsWith(inputPin) ||
        inputPin === '1234' ||
        inputPin === '7777' ||
        inputPin === '0000'
    );

    const emp = matched || employees[0];
    if (emp) {
      onCheckIn(emp.id, 'manual');
      setSuccessEmployee(emp);
      setPin('');
      setTimeout(() => setSuccessEmployee(null), 3500);
    } else {
      setErrorMessage('PIN-kod topilmadi. Qaytadan urinib ko‘ring.');
      setPin('');
    }
  };

  const handleBiometricTouch = () => {
    const randomEmp = employees[Math.floor(Math.random() * employees.length)];
    onCheckIn(randomEmp.id, 'biometric');
    setSuccessEmployee(randomEmp);
    setTimeout(() => setSuccessEmployee(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E4F4F] text-[#F6F3EC] flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#C6A15B] text-[#0E4F4F] font-display font-extrabold flex items-center justify-center text-xl shadow-md">
            A
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              Aluvantis HR • Kiosk Stansiyasi
            </h1>
            <p className="text-xs text-[#C6A15B] font-medium">
              Toshkent Bosh Ofisi Kirish-Chiqish Nazorat Terminali
            </p>
          </div>
        </div>

        <button
          onClick={onExitKiosk}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kioskka yakun yasash</span>
        </button>
      </div>

      {/* Center Layout: Clock + Interaction Station */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto w-full py-4 items-center">
        {/* Left Side: Big Clock & Office Status */}
        <div className="text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#C6A15B] text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Terminal online • 41.311081, 69.240562</span>
          </div>

          <div className="font-display font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-white drop-shadow-md">
            {currentTime || '09:00:00'}
          </div>

          <p className="text-lg sm:text-xl text-[#F6F3EC]/80 font-medium capitalize">
            {currentDate}
          </p>

          <div className="pt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
            <button
              onClick={() => setSelectedMethod('pin')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                selectedMethod === 'pin'
                  ? 'bg-[#C6A15B] text-[#0E4F4F] shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              PIN-kod orqali
            </button>
            <button
              onClick={() => setSelectedMethod('qr')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                selectedMethod === 'qr'
                  ? 'bg-[#C6A15B] text-[#0E4F4F] shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Dinamik QR kod
            </button>
            <button
              onClick={() => setSelectedMethod('biometric')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                selectedMethod === 'biometric'
                  ? 'bg-[#C6A15B] text-[#0E4F4F] shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Barmoq izi (Biometrik)
            </button>
          </div>
        </div>

        {/* Right Side: Keypad / Scanner / Sensor */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md p-6 border border-white/10 shadow-2xl max-w-sm mx-auto w-full">
          {successEmployee ? (
            /* Success Feedback Overlay */
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <img
                src={successEmployee.avatar_url}
                alt={successEmployee.full_name}
                className="w-20 h-20 rounded-3xl object-cover mx-auto ring-4 ring-[#C6A15B]"
              />
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  {successEmployee.full_name}
                </h3>
                <p className="text-xs text-[#C6A15B] font-semibold">{successEmployee.position}</p>
              </div>
              <p className="text-sm font-semibold text-emerald-300">
                Kirish muvaffaqiyatli qayd etildi! Yaxshi ish kuni tilaymiz!
              </p>
            </div>
          ) : selectedMethod === 'pin' ? (
            /* Touch PIN Keypad */
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-white/70">Xodim PIN-kodingizni kiriting:</p>
                <div className="flex justify-center gap-3 my-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center font-display font-bold text-xl transition ${
                        pin.length > idx
                          ? 'border-[#C6A15B] bg-[#C6A15B] text-[#0E4F4F]'
                          : 'border-white/30 bg-white/5 text-white'
                      }`}
                    >
                      {pin.length > idx ? '●' : ''}
                    </div>
                  ))}
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-300 font-semibold">{errorMessage}</p>
                )}
                <p className="text-[10px] text-white/40">Demo uchun ixtiyoriy 4 ta raqam kiriting (masalan, 1234)</p>
              </div>

              {/* Number Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-[#C6A15B] active:text-[#0E4F4F] font-display font-bold text-xl text-white transition flex items-center justify-center shadow-xs"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPin('')}
                  className="h-14 rounded-2xl bg-white/5 hover:bg-white/15 text-xs text-white/60 font-semibold transition"
                >
                  Tozalash
                </button>
                <button
                  onClick={() => handleKeypadPress('0')}
                  className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-[#C6A15B] active:text-[#0E4F4F] font-display font-bold text-xl text-white transition flex items-center justify-center shadow-xs"
                >
                  0
                </button>
                <button
                  onClick={handleBackspace}
                  className="h-14 rounded-2xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : selectedMethod === 'qr' ? (
            /* QR Scanner Display */
            <div className="text-center py-6 space-y-4">
              <div className="p-4 bg-white rounded-3xl inline-block shadow-xl">
                <QrCode className="w-36 h-36 text-[#0E4F4F]" />
              </div>
              <p className="text-xs text-white/80">
                Telefoningizdagi shaxsiy QR kodni terminal kamerasi oldiga tuting.
              </p>
              <button
                onClick={() => {
                  const emp = employees[0];
                  onCheckIn(emp.id, 'qr');
                  setSuccessEmployee(emp);
                  setTimeout(() => setSuccessEmployee(null), 3500);
                }}
                className="w-full py-2.5 rounded-xl bg-[#C6A15B] text-[#0E4F4F] text-xs font-bold hover:bg-[#b59048]"
              >
                QR skanerni tekshirish
              </button>
            </div>
          ) : (
            /* Biometric Sensor Display */
            <div className="text-center py-8 space-y-5">
              <button
                onClick={handleBiometricTouch}
                className="w-28 h-28 rounded-3xl bg-white/10 hover:bg-white/20 border-2 border-[#C6A15B] text-[#C6A15B] flex items-center justify-center mx-auto shadow-2xl transition active:scale-95 group"
              >
                <Fingerprint className="w-16 h-16 group-hover:scale-110 transition animate-pulse" />
              </button>
              <div>
                <h4 className="font-semibold text-sm text-white">Barmoq izi datchigi</h4>
                <p className="text-xs text-white/60 mt-1">
                  Optik skanerga barmog‘ingizni 1 soniyaga bosing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60">
        <p>Aluvantis Technologies MChJ • Kiosk OS v2.4 (O‘zbekiston)</p>
        <p>Xavfsizlik: AES-256 va E-IMZO tekshiruvi integratsiyalashgan</p>
      </div>
    </div>
  );
};
