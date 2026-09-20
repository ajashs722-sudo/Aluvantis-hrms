import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UZ_COPY } from '../../copy/uz';

gsap.registerPlugin(ScrollTrigger);

export const StatsBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: barRef.current,
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
      });
    }, barRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 -mt-8 max-w-6xl mx-auto px-4 sm:px-6">
      <div
        ref={barRef}
        id="stats-bar"
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#14201F] border border-[#E6E1D6] dark:border-[#233634] shadow-xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#0E4F4F]/10 dark:divide-white/10 text-center">
          {UZ_COPY.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`stat-item flex flex-col items-center justify-center ${
                i > 0 ? 'pt-4 md:pt-0' : ''
              }`}
            >
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0E4F4F] dark:text-[#F6F3EC]">
                  {stat.value}
                </span>
                <span className="font-display font-bold text-sm sm:text-base text-[#C6A15B]">
                  {stat.unit}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#5B6E6D] dark:text-[#8FA6A4] mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
