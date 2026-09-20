import React from 'react';
import { UZ_COPY } from '../../copy/uz';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14201F] text-white py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Lockup */}
          <div className="flex items-center gap-3">
            <img
              src="/brand-logo-transparent.png"
              alt="Aluvantis HR Logo"
              className="h-9 w-auto object-contain brightness-200"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight text-white">
                Aluvantis<span className="text-[#C6A15B]">.</span>HR
              </span>
              <span className="text-xs text-white/60">
                {UZ_COPY.brand.tagline}
              </span>
            </div>
          </div>

          {/* Family Brand Links */}
          <div className="text-xs font-semibold text-[#C6A15B]">
            Aluvantis oilasi: Sayt • HR • Tez orada ERP.
          </div>

          {/* Social Handle & Telegram */}
          <div className="flex items-center gap-6 text-xs font-semibold text-white/80">
            <a
              href="https://t.me/aluvantis"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C6A15B] transition flex items-center gap-1.5"
            >
              <span>Telegram:</span>
              <span className="font-mono text-[#C6A15B]">{UZ_COPY.brand.handle}</span>
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 text-center sm:text-left">
          <p>{UZ_COPY.brand.copyright}</p>
          <p>Toshkent, O‘zbekiston • Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};
