import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { UZ_COPY } from '../../copy/uz';

interface CtaBandProps {
  onNavigateAuth: () => void;
}

export const CtaBand: React.FC<CtaBandProps> = ({ onNavigateAuth }) => {
  return (
    <section className="py-24 bg-[#0E1615] relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          id="cta-band"
          className="bg-white/5 backdrop-blur-2xl p-10 sm:p-16 rounded-[40px] border border-white/15 shadow-2xl relative overflow-hidden text-center space-y-8"
        >
          {/* Ambient gold glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C6A15B]/15 blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#0E4F4F]/40 blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#C6A15B] border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Bir oqshomda tartib</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              {UZ_COPY.ctaBand.title}
            </h2>

            <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              {UZ_COPY.ctaBand.subtitle}
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateAuth}
              className="min-h-[54px] px-8 rounded-2xl bg-[#C6A15B] text-[#14201F] hover:bg-[#d6b36e] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{UZ_COPY.ctaBand.buttonText}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
