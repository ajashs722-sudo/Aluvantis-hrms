import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Building,
  UserCheck,
  Calendar,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Company } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  onSaveCompany: (c: Company) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  company,
  onSaveCompany,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: company.name,
    legal_name: company.legal_name,
    tax_id: company.tax_id,
    address: company.address,
    oked: company.oked,
    bank_mfo: company.bank_mfo,
    bank_account: company.bank_account,
    shift_hours: 8,
    tax_jshds: 12,
    tax_social: 12,
    annual_leave: 21,
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      // Celebrate
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0E4F4F', '#C6A15B', '#F6F3EC'],
      });
      onSaveCompany({
        ...company,
        name: formData.name,
        legal_name: formData.legal_name,
        tax_id: formData.tax_id,
        address: formData.address,
        oked: formData.oked,
        bank_mfo: formData.bank_mfo,
        bank_account: formData.bank_account,
        settings: {
          ...company.settings,
          annual_leave_default_days: formData.annual_leave,
        },
      });
      setTimeout(() => {
        onClose();
        setStep(1);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-[#0E4F4F]/10 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-[#0E4F4F] text-[#F6F3EC] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-full bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-[#C6A15B] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Aluvantis HRMS O‘rnatish Ustasi</span>
          </div>
          <h2 className="font-display font-bold text-xl text-white">
            O‘zbekiston qonunchiligiga mos HR tizimini sozlash
          </h2>
          <p className="text-xs text-white/70 mt-1">
            Qadam {step} / 5: {step === 1 && 'Kompaniya rekvizitlari'}
            {step === 2 && 'Boshqaruv va mas’ul shaxslar'}
            {step === 3 && 'Ish tartibi va smenalar'}
            {step === 4 && 'Soliq va ish haqi qoidalari (2026)'}
            {step === 5 && 'Tayyor! Ishni boshlash'}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-[#C6A15B] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#0E4F4F] font-semibold text-sm">
                <Building className="w-4 h-4 text-[#C6A15B]" />
                <span>Kompaniya yuridik ma’lumotlari (Yagona Darcha / Soliq)</span>
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Kompaniya nomi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">STIR (INN - 9 raqam)</label>
                  <input
                    type="text"
                    value={formData.tax_id}
                    onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">IFUT (OKED)</label>
                  <input
                    type="text"
                    value={formData.oked}
                    onChange={(e) => setFormData({ ...formData, oked: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Yuridik manzil</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#0E4F4F] font-semibold text-sm">
                <UserCheck className="w-4 h-4 text-[#C6A15B]" />
                <span>Bosh hisobchi va E-IMZO ma’muri</span>
              </div>
              <p className="text-gray-500">
                O‘zbekiston elektron soliq hisobotlari (my.soliq.uz) va mehnat daftarchalarini yuritish
                uchun mas’ul xodimlarni biriktiring.
              </p>
              <div className="p-3 bg-[#F6F3EC] rounded-2xl space-y-2 border border-[#0E4F4F]/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0E4F4F]">Bosh direktor:</span>
                  <span className="text-gray-700">Maftuna Muzrobova</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0E4F4F]">HR Direktori:</span>
                  <span className="text-gray-700">Dilnoza Karimova</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0E4F4F]">Bosh hisobchi:</span>
                  <span className="text-gray-700">Nilufar Yusupova</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#0E4F4F] font-semibold text-sm">
                <Calendar className="w-4 h-4 text-[#C6A15B]" />
                <span>Ish haftasi va smenalar tartibi</span>
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Standart ish kuni (soat) — Mehnat kodeksi 181-moddasi
                </label>
                <select
                  value={formData.shift_hours}
                  onChange={(e) => setFormData({ ...formData, shift_hours: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                >
                  <option value={8}>8 soatlik ish kuni (40 soat / haftada)</option>
                  <option value={7}>7 soatlik ish kuni (35 soat / haftada)</option>
                  <option value={6}>6 soatlik ish kuni (Qisqartirilgan)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Yillik asosiy ta’til muddati (Mehnat kodeksi 217-moddasi)
                </label>
                <input
                  type="number"
                  value={formData.annual_leave}
                  onChange={(e) => setFormData({ ...formData, annual_leave: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0E4F4F]"
                />
                <span className="text-[11px] text-gray-400">Kamida 21 kalendar kuni bo‘lishi shart.</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#0E4F4F] font-semibold text-sm">
                <Banknote className="w-4 h-4 text-[#C6A15B]" />
                <span>O‘zbekiston Soliq stavkalari (2026)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-gray-200 rounded-xl">
                  <p className="text-gray-500 font-medium">JShDS (Daromad solig‘i)</p>
                  <p className="text-lg font-bold text-[#0E4F4F] mt-0.5">12% (Yagona)</p>
                  <span className="text-[10px] text-gray-400">Solig‘ Kodeksi 381-modda</span>
                </div>
                <div className="p-3 bg-white border border-gray-200 rounded-xl">
                  <p className="text-gray-500 font-medium">Ijtimoiy soliq (Korxona)</p>
                  <p className="text-lg font-bold text-[#0E4F4F] mt-0.5">12% (Yuridik shaxs)</p>
                  <span className="text-[10px] text-gray-400">Solig‘ Kodeksi 405-modda</span>
                </div>
              </div>
              <div className="p-3 bg-[#C6A15B]/10 rounded-xl border border-[#C6A15B]/30 text-[#0E4F4F]">
                <p className="font-semibold text-xs">Shaxsiy INPS pensiya badali:</p>
                <p className="text-[11px] text-gray-700 mt-0.5">
                  0.1% miqdorida Xalq Banki jamg‘arib boriladigan pensiya hisobiga o‘tkaziladi (JShDS
                  hisobidan chegiriladi).
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-4 space-y-3 animate-fadeIn">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0E4F4F]">
                Barcha qoidalar muvaffaqiyatli saqlandi!
              </h3>
              <p className="text-gray-600 text-xs max-w-md mx-auto leading-relaxed">
                Kompaniyangiz endi davomatni QR kod, GPS va Biometrik terminal orqali nazorat qilishga,
                Mehnat kodeksiga mos hisob-kitob varaqalarini chiqarishga va my.soliq.uz ga hisobot
                yuborishga to‘liq tayyor.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orqaga</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0E4F4F] text-white hover:bg-[#093535] shadow-xs active:scale-95"
          >
            <span>{step === 5 ? 'Tizimga kirish' : 'Davom etish'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
