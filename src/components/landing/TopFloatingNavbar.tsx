import React from 'react';
import { UZ_COPY } from '../../copy/uz';
import { ArrowRight, Sparkles } from 'lucide-react';

interface TopFloatingNavbarProps {
  onNavigateAuth: () => void;
  onNavigateDemo: () => void;
  isAuthenticated?: boolean;
}

export const TopFloatingNavbar: React.FC<TopFloatingNavbarProps> = ({
  onNavigateAuth,
  onNavigateDemo,
  isAuthenticated = false,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 pointer-events-none mb-2">
      <div className="max-w-6xl mx-auto h-16 rounded-[26px] bg-white/65 dark:bg-[#0E1615]/75 backdrop-blur-2xl backdrop-saturate-200 border border-white/60 dark:border-white/15 shadow-[0_12px_40px_-12px_rgba(14,79,79,0.18)] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.75)] px-4 sm:px-6 flex items-center justify-between gap-4 pointer-events-auto transition-all duration-300 relative overflow-hidden">
        {/* Liquid Glass Highlight Reflective Sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-transparent dark:from-white/15 dark:via-white/5 dark:to-transparent pointer-events-none opacity-70" />

        {/* Brand Logo */}
        <a
          href="#top"
          className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-[#0E4F4F] rounded-xl z-10"
        >
          <img
            src="/favicon-32x32.png"
            alt="Aluvantis HR Logo"
            className="w-8 h-8 rounded-full shadow-xs object-cover border border-[#C6A15B]/40 group-hover:scale-105 transition-transform duration-200"
          />
          <span className="font-display font-extrabold text-base tracking-tight text-[#0E4F4F] dark:text-[#F6F3EC]">
            Aluvantis<span className="text-[#C6A15B]">.</span>HR
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-[#14201F]/80 dark:text-[#F6F3EC]/80 z-10">
          <button
            onClick={() => scrollTo('imkoniyatlar')}
            className="px-3.5 py-2 rounded-2xl hover:bg-[#0E4F4F]/10 dark:hover:bg-white/10 hover:text-[#0E4F4F] dark:hover:text-white transition-all cursor-pointer"
          >
            {UZ_COPY.nav.features}
          </button>
          <button
            onClick={() => scrollTo('qanday-ishlaydi')}
            className="px-3.5 py-2 rounded-2xl hover:bg-[#0E4F4F]/10 dark:hover:bg-white/10 hover:text-[#0E4F4F] dark:hover:text-white transition-all cursor-pointer"
          >
            {UZ_COPY.nav.howItWorks}
          </button>
          <button
            onClick={() => scrollTo('narxlar')}
            className="px-3.5 py-2 rounded-2xl hover:bg-[#0E4F4F]/10 dark:hover:bg-white/10 hover:text-[#0E4F4F] dark:hover:text-white transition-all cursor-pointer"
          >
            {UZ_COPY.nav.pricing}
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="px-3.5 py-2 rounded-2xl hover:bg-[#0E4F4F]/10 dark:hover:bg-white/10 hover:text-[#0E4F4F] dark:hover:text-white transition-all cursor-pointer"
          >
            {UZ_COPY.nav.faq}
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 z-10">
          {isAuthenticated ? (
            <button
              id="nav-dashboard-btn"
              onClick={onNavigateDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0E4F4F] text-[#F6F3EC] text-xs font-semibold font-display shadow-md hover:bg-[#14201F] hover:shadow-lg transition-all border border-[#C6A15B]/40 cursor-pointer active:scale-95"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
            </button>
          ) : (
            <>
              <button
                id="nav-demo-btn"
                onClick={onNavigateDemo}
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-2xl text-xs font-semibold text-[#0E4F4F] dark:text-[#C6A15B] hover:bg-[#0E4F4F]/10 dark:hover:bg-white/10 border border-[#0E4F4F]/20 dark:border-[#C6A15B]/30 transition-all cursor-pointer"
              >
                {UZ_COPY.nav.demo}
              </button>

              <button
                id="nav-auth-btn"
                onClick={onNavigateAuth}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#0E4F4F] dark:bg-[#C6A15B] text-[#F6F3EC] dark:text-[#0E1615] text-xs font-bold font-display shadow-md hover:bg-[#14201F] dark:hover:bg-[#d4b06a] hover:shadow-lg transition-all border border-[#C6A15B]/30 cursor-pointer active:scale-95"
              >
                <span>{UZ_COPY.nav.login}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B] dark:text-[#0E1615]" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
