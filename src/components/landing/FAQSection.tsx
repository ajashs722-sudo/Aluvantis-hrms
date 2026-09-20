import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { UZ_COPY, FAQItem } from '../../copy/uz';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('offline');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0E4F4F]/8 dark:bg-white/10 text-xs font-semibold text-[#0E4F4F] dark:text-[#C6A15B] border border-[#0E4F4F]/10 dark:border-white/10">
          <HelpCircle className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>Ko‘p beriladigan savollar</span>
        </span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0E4F4F] dark:text-[#F6F3EC] tracking-tight">
          Savollaringiz bormi?
        </h2>
        <p className="text-sm sm:text-base text-[#4A5D5B] dark:text-[#A3B8B6]">
          Oflayn ishlash, soliqlar va ma’lumotlar xavfsizligi bo‘yicha to‘liq javoblar.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {UZ_COPY.faq.map((item: FAQItem) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-[#14201F] rounded-3xl border border-[#E6E1D6] dark:border-[#233634] shadow-xs overflow-hidden transition-all duration-200"
            >
              <button
                id={`faq-btn-${item.id}`}
                onClick={() => toggle(item.id)}
                className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-[#0E4F4F] cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-display font-bold text-base sm:text-lg text-[#0E4F4F] dark:text-[#F6F3EC]">
                  {item.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full bg-[#0E4F4F]/8 dark:bg-white/10 flex items-center justify-center text-[#0E4F4F] dark:text-[#C6A15B] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#0E4F4F] dark:bg-[#C6A15B] text-[#C6A15B] dark:text-[#0E1615]' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm text-[#3B4D4B] dark:text-[#CBDCDA] leading-relaxed border-t border-[#0E4F4F]/10 dark:border-white/10 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
