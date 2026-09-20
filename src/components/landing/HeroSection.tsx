import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { SweepButton } from '../ui/SweepButton';

interface HeroSectionProps {
  onNavigateAuth: () => void;
  onNavigateDemo: () => void;
  isAuthenticated?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateAuth,
  onNavigateDemo,
  isAuthenticated = false,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.hero-animate', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      });

      if (phoneRef.current) {
        gsap.to(phoneRef.current, {
          y: -10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.easeInOut',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-[#0E4F4F]/10 via-[#F6F3EC] to-[#F6F3EC] dark:from-[#0E4F4F]/20 dark:via-[#0E1615] dark:to-[#0E1615] transition-colors"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none opacity-40 blur-3xl -z-10">
        <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-[#0E4F4F]/20 dark:bg-[#0E4F4F]/30" />
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full bg-[#C6A15B]/20 dark:bg-[#C6A15B]/15" />
      </div>

      {/* Floating Sticker s2 ("Excel yo'q!") near hero top left */}
      <motion.div
        initial={prefersReduced ? {} : { scale: 0, opacity: 0, rotate: 5 }}
        animate={prefersReduced ? {} : { scale: 1, opacity: 1, rotate: 5, y: [-4, 6, -4] }}
        transition={{
          scale: { type: 'spring', stiffness: 260, damping: 20 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-20 left-[5%] hidden xl:block z-20 pointer-events-none select-none drop-shadow-xl"
      >
        <img src="/stickers/s2.svg" alt="Excel yo'q!" className="w-40 h-auto" />
      </motion.div>

      {/* Floating Sticker s1 ("1 oqshomda!") near top right */}
      <motion.div
        initial={prefersReduced ? {} : { scale: 0, opacity: 0, rotate: -6 }}
        animate={prefersReduced ? {} : { scale: 1, opacity: 1, rotate: -6, y: [-6, 4, -6] }}
        transition={{
          scale: { type: 'spring', stiffness: 260, damping: 20, delay: 0.1 },
          y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-16 right-[6%] hidden lg:block z-20 pointer-events-none select-none drop-shadow-xl"
      >
        <img src="/stickers/s1.svg" alt="1 oqshomda!" className="w-44 h-auto" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="hero-animate inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#14201F]/90 backdrop-blur-xl border border-[#E6E1D6] dark:border-[#233634] shadow-xs text-xs font-semibold text-[#0E4F4F] dark:text-[#C6A15B]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A15B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A15B]"></span>
              </span>
              <span className="font-display font-bold tracking-wide">Aluvantis HR Platformasi</span>
            </div>

            <h1 className="hero-animate font-display font-extrabold text-[clamp(2.4rem,5.5vw,4.2rem)] tracking-tight text-[#0E4F4F] dark:text-[#F6F3EC] leading-[1.1]">
              Jamoangiz — bir oqshomda tartibda.
            </h1>

            <p className="hero-animate text-base sm:text-lg text-[#3B4D4B] dark:text-[#CBDCDA] max-w-2xl leading-relaxed">
              Smenalar, davomat, oylik va ta'tillar — bitta ilovada. Excel yo'q, daftar yo'q, bosh og'rig'i yo'q.
            </p>

            <div className="hero-animate pt-3 flex flex-wrap items-center gap-3.5">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={onNavigateDemo}
                    className="min-h-[50px] px-6 rounded-2xl bg-[#0E4F4F] dark:bg-[#C6A15B] text-white dark:text-[#0E1615] font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Dashboard’ga kirish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onNavigateDemo}
                    className="min-h-[50px] px-6 rounded-2xl bg-white dark:bg-white/10 border border-[#E6E1D6] dark:border-white/15 text-[#0E4F4F] dark:text-white font-display font-bold text-xs sm:text-sm hover:bg-black/5 dark:hover:bg-white/15 transition cursor-pointer"
                  >
                    <span>Boshqaruv markazi</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onNavigateAuth}
                    className="min-h-[50px] px-6 rounded-2xl bg-[#0E4F4F] dark:bg-[#C6A15B] text-white dark:text-[#0E1615] font-display font-bold text-xs sm:text-sm flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
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
                    <span>Google bilan kirish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onNavigateDemo}
                    className="min-h-[50px] px-6 rounded-2xl bg-white dark:bg-white/10 border border-[#E6E1D6] dark:border-white/15 text-[#0E4F4F] dark:text-[#F6F3EC] font-display font-bold text-xs sm:text-sm hover:bg-black/5 dark:hover:bg-white/15 transition cursor-pointer"
                  >
                    <span>Demo ko'rish</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Hero Phone Image & Floating Stickers */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Sticker s4 ("0 server!") */}
            <motion.div
              initial={prefersReduced ? {} : { scale: 0, opacity: 0, rotate: -8 }}
              animate={prefersReduced ? {} : { scale: 1, opacity: 1, rotate: -8, y: [-5, 5, -5] }}
              transition={{
                scale: { type: 'spring', stiffness: 260, damping: 20, delay: 0.2 },
                y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute -bottom-6 -left-4 z-20 pointer-events-none select-none drop-shadow-2xl"
            >
              <img src="/stickers/s4.svg" alt="0 server!" className="w-36 sm:w-40 h-auto" />
            </motion.div>

            {/* Sticker s5 ("12% avto!") */}
            <motion.div
              initial={prefersReduced ? {} : { scale: 0, opacity: 0, rotate: 6 }}
              animate={prefersReduced ? {} : { scale: 1, opacity: 1, rotate: 6, y: [5, -5, 5] }}
              transition={{
                scale: { type: 'spring', stiffness: 260, damping: 20, delay: 0.3 },
                y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute -top-4 -right-2 z-20 pointer-events-none select-none drop-shadow-2xl"
            >
              <img src="/stickers/s5.svg" alt="12% avto!" className="w-32 sm:w-36 h-auto" />
            </motion.div>

            {/* Main Phone Image Mockup */}
            <div
              ref={phoneRef}
              className="relative -rotate-3 transition-transform duration-300 transform hover:rotate-0"
            >
              <img
                src="/hero-phone.svg"
                alt="Aluvantis HR Mobile App"
                className="w-[280px] sm:w-[340px] h-auto rounded-[36px] drop-shadow-[0_20px_35px_rgba(14,79,79,0.2)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
