import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles, Building2, Cloud, ArrowRight } from 'lucide-react';
import { UZ_COPY, PricingPlan } from '../../copy/uz';

gsap.registerPlugin(ScrollTrigger);

interface PricingSectionProps {
  onNavigateAuth: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigateAuth }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.pricing-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
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

  return (
    <section
      ref={sectionRef}
      id="narxlar"
      className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0E4F4F]/8 dark:bg-white/10 text-xs font-semibold text-[#0E4F4F] dark:text-[#C6A15B] border border-[#0E4F4F]/10 dark:border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>{UZ_COPY.pricing.badge}</span>
        </span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0E4F4F] dark:text-[#F6F3EC] tracking-tight">
          {UZ_COPY.pricing.title}
        </h2>
        <p className="text-base text-[#4A5D5B] dark:text-[#A3B8B6]">
          {UZ_COPY.pricing.subtitle}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        {UZ_COPY.pricing.plans.map((plan: PricingPlan) => (
          <div
            key={plan.id}
            className={`pricing-card rounded-[32px] p-8 sm:p-10 flex flex-col justify-between space-y-8 relative transition-all duration-300 ${
              plan.popular
                ? 'bg-white dark:bg-[#14201F] border-2 border-[#C6A15B] shadow-2xl ring-4 ring-[#C6A15B]/10'
                : 'bg-white dark:bg-[#14201F] border border-[#E6E1D6] dark:border-[#233634] shadow-lg hover:shadow-xl'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-[#0E4F4F] text-[#C6A15B] text-xs font-bold font-display border border-[#C6A15B]/40 shadow-md">
                {plan.badge}
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/15 flex items-center justify-center text-[#0E4F4F] dark:text-[#C6A15B]">
                  {plan.id === 'saas' ? (
                    <Cloud className="w-6 h-6" />
                  ) : (
                    <Building2 className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-[#0E4F4F] dark:text-[#F6F3EC]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#5B6E6D] dark:text-[#8FA6A4] mt-0.5">{plan.description}</p>
                </div>
              </div>

              {/* Price Display */}
              <div className="pt-2 pb-4 border-b border-[#0E4F4F]/10 dark:border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#0E4F4F] dark:text-[#F6F3EC]">
                    {plan.price}
                  </span>
                </div>
                <span className="text-xs text-[#5B6E6D] dark:text-[#8FA6A4] font-medium block mt-1">
                  {plan.period}
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0E4F4F] dark:text-[#C6A15B]">
                  Tarif tarkibi:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs text-[#1C2B2A] dark:text-[#E2EAE9] font-medium">
                      <div className="w-5 h-5 rounded-full bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/20 text-[#0E4F4F] dark:text-[#C6A15B] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={onNavigateAuth}
                className={`w-full min-h-[52px] rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md cursor-pointer ${
                  plan.popular
                    ? 'bg-[#C6A15B] text-[#14201F] hover:bg-[#d6b36e] hover:shadow-lg'
                    : 'bg-[#0E4F4F] dark:bg-white/10 text-white hover:bg-[#14201F] dark:hover:bg-white/20'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
