import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CalendarDays,
  QrCode,
  Calculator,
  Palmtree,
  FileSpreadsheet,
  Send,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { UZ_COPY, FeatureItem } from '../../copy/uz';

gsap.registerPlugin(ScrollTrigger);

interface FeaturesSectionProps {
  onSelectFeature?: (featureId: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeature }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.feature-glass-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 32,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getFeatureIcon = (id: string) => {
    const iconClass = "w-6 h-6 text-[#0E4F4F] dark:text-[#C6A15B] group-hover:text-[#F6F3EC] dark:group-hover:text-[#0E1615] transition-colors";
    switch (id) {
      case 'shifts':
        return <CalendarDays className={iconClass} />;
      case 'attendance':
        return <QrCode className={iconClass} />;
      case 'payroll':
        return <Calculator className={iconClass} />;
      case 'leaves':
        return <Palmtree className={iconClass} />;
      case 'payslip':
        return <FileSpreadsheet className={iconClass} />;
      case 'telegram':
        return <Send className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="imkoniyatlar"
      className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E4F4F]/8 dark:bg-white/10 text-xs font-semibold text-[#0E4F4F] dark:text-[#C6A15B] border border-[#0E4F4F]/10 dark:border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>{UZ_COPY.nav.features}</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0E4F4F] dark:text-[#F6F3EC] tracking-tight">
          Har bir vazifa uchun bitta mukammal yechim
        </h2>
        <p className="text-base text-[#4A5D5B] dark:text-[#A3B8B6] leading-relaxed">
          Ortiqcha jadvallar va Excel fayllardan qutuling. Barcha modullar O‘zbekiston Mehnat kodeksi asosida o‘zaro uzviy bog‘langan.
        </p>
      </div>

      {/* 6 High Contrast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {UZ_COPY.features.map((feature: FeatureItem) => (
          <div
            key={feature.id}
            onClick={() => onSelectFeature && onSelectFeature(feature.id)}
            className="feature-glass-card bg-white dark:bg-[#14201F] rounded-3xl p-7 sm:p-8 flex flex-col justify-between group cursor-pointer border border-[#E6E1D6] dark:border-[#233634] shadow-xs hover:shadow-xl hover:border-[#C6A15B]/70 dark:hover:border-[#C6A15B]/70 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#0E4F4F]/8 dark:bg-[#C6A15B]/15 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0E4F4F] dark:group-hover:bg-[#C6A15B]">
                  {getFeatureIcon(feature.id)}
                </div>
                <span className="text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-[#C6A15B]/15 text-[#0E4F4F] dark:text-[#C6A15B] border border-[#C6A15B]/30">
                  {feature.badge}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-[#0E4F4F] dark:text-[#F6F3EC] group-hover:text-[#C6A15B] dark:group-hover:text-[#C6A15B] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs font-semibold text-[#0E4F4F]/70 dark:text-[#C6A15B]/80 mt-1">
                  {feature.category}
                </p>
              </div>

              <p className="text-sm text-[#4A5D5B] dark:text-[#CBDCDA] leading-relaxed">
                {feature.description}
              </p>
            </div>

            <div className="pt-5 mt-6 border-t border-[#0E4F4F]/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#0E4F4F] dark:text-[#C6A15B]">
              <span className="text-[#5B6E6D] dark:text-[#8FA6A4] font-normal text-xs">
                {feature.highlight}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#0E4F4F]/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-[#0E4F4F] dark:group-hover:bg-[#C6A15B] group-hover:text-[#C6A15B] dark:group-hover:text-[#0E1615] transition-colors shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
