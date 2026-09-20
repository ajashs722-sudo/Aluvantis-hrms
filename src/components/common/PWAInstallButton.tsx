import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as standalone app, suppress
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E4F4F] text-[#C6A15B] hover:bg-[#14201F] text-xs font-semibold shadow-sm transition border border-[#C6A15B]/30 ${className}`}
        title="Ilovani o‘rnatish (PWA)"
      >
        <Download className="w-3.5 h-3.5 text-[#C6A15B]" />
        <span>Ilovani o‘rnatish</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#0E4F4F] hover:bg-[#F6F3EC] text-xs font-semibold shadow-sm transition border border-[#0E4F4F]/20 ${className}`}
          title="iOS Safari: Bosh ekranga qo‘shish"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#0E4F4F]" />
          <span>iOS da o‘rnatish</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#C6A15B]/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0E4F4F] flex items-center justify-center text-[#C6A15B] font-display font-bold text-sm">
                    A
                  </div>
                  <h3 className="font-display font-bold text-base text-[#0E4F4F]">
                    Aluvantis HR (iOS)
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Ilovani iPhone yoki iPad qurilmangizga o‘rnatish uchun quyidagi 2 ta oddiy qadamni bajaring:
              </p>

              <div className="space-y-3 text-xs bg-[#F6F3EC] p-3.5 rounded-2xl border border-gray-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0E4F4F] text-[#C6A15B] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-gray-800">Ulashish (Share) tugmasini bosing:</span>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <Share className="w-3.5 h-3.5 text-blue-600" />
                      <span>Safari pastki panelidagi belgi</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0E4F4F] text-[#C6A15B] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-gray-800">Menyudan tanlang:</span>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <PlusSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>«Bosh ekranga qo‘shish» (Add to Home Screen)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Oflayn rejimda, to‘liq ekranda va internet yo‘qligida ham ishlaydi!</span>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#0E4F4F] text-white text-xs font-semibold hover:bg-[#14201F] transition"
              >
                Tushunarli
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default button if not in standalone mode (allows user to trigger info or installation)
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  return (
    <>
      <button
        id="pwa-install-generic-btn"
        onClick={() => setShowGenericGuide(true)}
        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E4F4F]/10 text-[#0E4F4F] hover:bg-[#0E4F4F]/15 text-xs font-semibold transition ${className}`}
        title="Aluvantis HR PWA Oflayn Ilova"
      >
        <Download className="w-3.5 h-3.5 text-[#0E4F4F]" />
        <span>PWA Ilova</span>
      </button>

      {showGenericGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#C6A15B]/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0E4F4F] flex items-center justify-center text-[#C6A15B] font-display font-bold text-sm">
                  A
                </div>
                <h3 className="font-display font-bold text-base text-[#0E4F4F]">
                  Aluvantis HR PWA
                </h3>
              </div>
              <button
                onClick={() => setShowGenericGuide(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Ushbu tizim Progressive Web App (PWA) sifatida to‘liq oflayn ishlaydi. Brauzeringiz orqali uni kompyuter yoki telefoningizga o‘rnatib olishingiz mumkin.
            </p>

            <div className="space-y-2 text-xs bg-[#F6F3EC] p-3 rounded-2xl border border-gray-200">
              <p className="font-semibold text-gray-800">Qanday o‘rnatiladi?</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-600">
                <li>Brauzer URL panelidagi o‘rnatish belgisini (Install) bosing</li>
                <li>Yoki menyudan «Ilovani o‘rnatish» bandini tanlang</li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Ma’lumotlar IndexedDB orqali qurilmangizda saqlanadi.</span>
            </div>

            <button
              onClick={() => setShowGenericGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#0E4F4F] text-white text-xs font-semibold hover:bg-[#14201F] transition"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </>
  );
};
