import React from 'react';
import { BookOpen, Clock, TrendingUp, CheckCircle, Star, PenTool, Award } from 'lucide-react';

export const KPIRulesTab: React.FC = () => {
  const rules = [
    {
      icon: Clock,
      title: 'Davomat intizomi',
      source: 'Smenalar va GPS/Biometriya',
      desc: 'Kelgan smenalar sonini rejadagi smenalar soniga bo‘lib yuzga ko‘paytirish orqali hisoblanadi. Kechikishlar va sababsiz kelmasliklar ballni pasaytiradi.',
    },
    {
      icon: TrendingUp,
      title: 'Savdo rejasi',
      source: 'Savdo va moliyaviy tushum',
      desc: 'Amalda sotilgan mahsulot yoki xizmatlar summasini oylik rejalashtirilgan savdo maqsadiga bo‘lib yuzga ko‘paytirish orqali aniqlanadi.',
    },
    {
      icon: CheckCircle,
      title: 'Vazifalar ijrosi',
      source: 'Topshiriqlar va loyihalar',
      desc: 'Belgilangan muddatda muvaffaqiyatli yakunlangan vazifalar sonini jami yuklatilgan topshiriqlar soniga bo‘lib yuzga ko‘paytirish orqali o‘lchanadi.',
    },
    {
      icon: Star,
      title: 'Mijoz bahosi',
      source: 'Mijozlar fikri va audit',
      desc: 'Mijozlar tomonidan qo‘yilgan o‘rtacha qoniqish ballini kompaniyaning nishon ko‘rsatkichiga nisbati orqali baholanadi.',
    },
    {
      icon: PenTool,
      title: 'Qo‘lda kiritish (Manual)',
      source: 'Bo‘lim rahbari xulosasi',
      desc: 'Avtomatlashtirilmagan maxsus loyihalar yoki sifat auditlari bo‘yicha vakolatli rahbar tomonidan har oy yakunida kiritiladi.',
    },
    {
      icon: Award,
      title: 'Oylik mukofot hisoblash tartibi',
      source: 'Yig‘ma KPI balli',
      desc: 'Har bir ko‘rsatkichning og‘irligi bo‘yicha umumiy yig‘ma ball aniqlanadi. Ball yuzdan oshganda besh foizdan o‘n besh foizgacha qo‘shimcha rag‘batlantirish ustamasi beriladi.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-3xl bg-card/80 backdrop-blur-xl border border-border flex items-center gap-3 shadow-sm">
        <div className="p-2.5 rounded-2xl bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/15 text-[#0E4F4F] dark:text-[#C6A15B]">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-foreground">KPI Hisoblash Qoidalari va Metodologiyasi</h3>
          <p className="text-xs text-muted-foreground">
            Barcha ko‘rsatkichlar shaffof va insoniy tushunarli mezonlar asosida hisoblanadi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {rules.map((r, idx) => {
          const Icon = r.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border space-y-2.5 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-[#C6A15B]">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{r.title}</h4>
                  <span className="text-[10px] text-muted-foreground">{r.source}</span>
                </div>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{r.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
