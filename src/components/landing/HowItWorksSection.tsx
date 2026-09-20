import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Clock, UserPlus, Zap } from 'lucide-react';
import { UZ_COPY, StepItem } from '../../copy/uz';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.timeline-step-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 36,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Zap className="w-5 h-5 text-[#C6A15B]" />;
      case 1:
        return <UserPlus className="w-5 h-5 text-[#C6A15B]" />;
      case 2:
        return <Check className="w-5 h-5 text-[#C6A15B]" />;
      default:
        return <Clock className="w-5 h-5 text-[#C6A15B]" />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="qanday-ishlaydi"
      className="py-24 bg-[#0E4F4F] dark:bg-[#091515] text-[#F6F3EC] relative overflow-hidden transition-colors"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[400px] pointer-events-none opacity-20 blur-3xl">
        <div className="w-96 h-96 rounded-full bg-[#C6A15B] mx-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#C6A15B] border border-white/15">
            {UZ_COPY.howItWorks.badge}
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {UZ_COPY.howItWorks.title}
          </h2>
          <p className="text-base text-white/80">
            {UZ_COPY.howItWorks.subtitle}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {UZ_COPY.howItWorks.steps.map((step: StepItem, idx: number) => (
            <div
              key={step.number}
              className="timeline-step-card bg-white/10 dark:bg-black/30 backdrop-blur-md p-8 rounded-3xl border border-white/20 flex flex-col justify-between space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-3xl text-[#C6A15B]">
                    {step.number}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15">
                    <Clock className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>{step.duration}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-white">
                  {step.title}
                </h3>

                <p className="text-sm text-white/80 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-[#C6A15B]">
                {getStepIcon(idx)}
                <span>Qadam {idx + 1} tayyor</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
