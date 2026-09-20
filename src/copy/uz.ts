// Uzbek Copy Source of Truth for Aluvantis HR
// Tone: Simple, warm, confident Uzbek, "siz" form, one-word labels, real numbers, zero jargon.

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  highlight: string;
}

export interface StepItem {
  number: string;
  duration: string;
  title: string;
  description: string;
}

export const UZ_COPY = {
  brand: {
    name: 'Aluvantis HR',
    tagline: 'Jamoangiz — bir oqshomda tartibda.',
    subtagline: 'O‘zbekiston korxonalari uchun kadrlar, smena va oylik boshqaruvi.',
    copyright: '© 2026 Aluvantis Technologies. Barcha huquqlar himoyalangan.',
    handle: '@aluvantis',
  },
  nav: {
    features: 'Imkoniyatlar',
    howItWorks: 'Qanday ishlaydi',
    pricing: 'Narxlar',
    faq: 'FAQ',
    login: 'Kirish',
    demo: 'Demo',
    telegram: 'Telegram',
    getStarted: 'Boshlash',
  },
  hero: {
    title: 'Jamoangiz — bir oqshomda tartibda.',
    subtitle:
      'Smena jadvali, QR va geolokatsiyali davomat, O‘zbekiston soliqlari bo‘yicha avtomatik oylik va bir bosishda ta’til arizalari. Ortiqcha qog‘ozbozliksiz.',
    ctaPrimary: 'Google bilan kirish',
    ctaSecondary: 'Demo ko‘rish',
    trustNote: '0 ta server • 100% O‘zbekiston Mehnat kodeksi • Oflayn rejim',
  },
  stats: [
    { value: '1', unit: 'oqshom', label: 'to‘liq sozlash' },
    { value: '0', unit: 'server', label: 'infratuzilma xarajati' },
    { value: '12%', unit: 'JShDS', label: 'avtomatik hisob' },
    { value: '15', unit: 'kun', label: 'ta’til balansi avto' },
  ],
  features: [
    {
      id: 'shifts',
      title: 'Smena kalendari',
      category: 'Rejalashtirish',
      description: 'Kunduzgi, tungi va 24/48 smenalarni 1 bosishda taqsimlang. Xodimlar almashtirishni o‘zlari so‘raydi.',
      badge: 'Moslashuvchan',
      highlight: 'Smena to‘qnashuvlarini avtomatik tekshiradi',
    },
    {
      id: 'attendance',
      title: 'QR davomat',
      category: 'Nazorat',
      description: 'Haqiqiy geolokatsiya tekshiruvi (GPS radius) va dinamik yangilanuvchi QR kod. Soxta belgilashlarga yo‘l qo‘yilmaydi.',
      badge: 'Haqiqiy vaqt',
      highlight: '15 daqiqalik kechikish grace-period',
    },
    {
      id: 'payroll',
      title: 'Oylik (UZ soliq)',
      category: 'Hisob-kitob',
      description: '12% JShDS, 0.1% INPS (Xalq banki) va 12% Ijtimoiy soliq bir soniyada hisoblanadi. 1C va Soliq.uz XML eksport.',
      badge: '100% Qonuniy',
      highlight: 'Sverxurochniy va ustamalar avto',
    },
    {
      id: 'leaves',
      title: 'Ta’til arizalari',
      category: 'Arizalar',
      description: 'Mehnat ta’tili, o‘z hisobidan yoki kasallik varaqasi arizasini topshirish va rahbarga 1 soniyada tasdiqlatish.',
      badge: 'Qog‘ozsiz',
      highlight: 'Qoldiq kunlar avtomatik yuritiladi',
    },
    {
      id: 'payslip',
      title: 'Payslip cho‘ntakda',
      category: 'Shaffoflik',
      description: 'Har bir xodim o‘z oylik hisob-kitob varaqasini (payslip) PDF formatda telefoniga yuklab oladi yoki chop etadi.',
      badge: 'Shaxsiy kabinet',
      highlight: 'Daromad va ushlanmalar batafsil',
    },
    {
      id: 'telegram',
      title: 'Telegram bot',
      category: 'Integratsiya',
      description: 'Davomatni qayd etish, arizalarni tasdiqlash va oylik bildirishnomalar to‘g‘ridan-to‘g‘ri korporativ bot orqali.',
      badge: 'Tezkor',
      highlight: 'Telegram Mini App (TMA) tayyor',
    },
  ] as FeatureItem[],
  howItWorks: {
    badge: '3 Qadam',
    title: 'Qanday ishlaydi?',
    subtitle: 'Murakkab o‘rnatishlarsiz. Bugun boshlang, ertaga butun korxonangiz tizimda.',
    steps: [
      {
        number: '01',
        duration: '5 daqiqa',
        title: 'Ro‘yxatdan o‘tish',
        description: 'Google hisobingiz orqali 1 bosishda kiring va korxona nomini kiriting.',
      },
      {
        number: '02',
        duration: '1 soat',
        title: 'Xodimlarni kiritish',
        description: 'Xodimlarni ro‘yxatini yuklang yoki taklif havolasini yuboring. Lavozim va oyliklarni belgilang.',
      },
      {
        number: '03',
        duration: 'Oqshomgacha',
        title: 'Ishlaydi',
        description: 'QR kodni devorga iling yoki planshetga o‘rnating. Davomat va oyliklar o‘z-o‘zidan yuradi.',
      },
    ] as StepItem[],
  },
  pricing: {
    badge: 'Shaffof Tariflar',
    title: 'Moslashuvchan narxlar',
    subtitle: 'Yashirin to‘lovlarsiz. O‘zingizga mos tarifni tanlang.',
    plans: [
      {
        id: 'saas',
        name: 'SaaS Bulut',
        badge: 'Eng Ommabop',
        description: 'Kichik va o‘rta korxonalar uchun. 0 ta server xarajati, 14 kun bepul sinov.',
        price: '15 000 UZS',
        period: 'oyiga / har bir xodim uchun',
        features: [
          'Barcha 6 ta modul (Smena, QR, Oylik, Ta’tillar, Payslip, Bot)',
          'Cheksiz QR check-in nuqtalari',
          'Avtomatik 12% JShDS va INPS hisobi',
          'Soliq.uz va 1C eksportlari',
          'PWA oflayn rejimda ishlash',
          '24/7 Telegram texnik qo‘llab-quvvatlash',
        ],
        cta: 'Bulutda boshlash',
        popular: true,
      },
      {
        id: 'onpremise',
        name: 'On-Premise Litsenziya',
        badge: 'Yirik Korxonalar',
        description: 'O‘z serveringiz yoki maxsus Cloudflare infrastrukturangizda to‘liq nazorat.',
        price: 'Kelishuv asosida',
        period: 'bir martalik litsenziya + yillik support',
        features: [
          'To‘liq manba kodi va SQL migratsiyalari',
          'O‘z serveringizga yoki Cloudflare hisobingizga o‘rnatish',
          'Cheksiz xodimlar va filiallar soni',
          'Korporativ AD / LDAP integratsiyasi',
          'Shaxsiy E-IMZO integratsiya moduli',
          'Kafolatlangan SLA va 1 yillik shaxsiy muhandis',
        ],
        cta: 'Litsenziya olish',
        popular: false,
      },
    ] as PricingPlan[],
  },
  faq: [
    {
      id: 'offline',
      question: 'Internet uzilib qolsa, davomat ishlaydimi?',
      answer:
        'Ha! Aluvantis HR to‘liq Progressive Web App (PWA) arxitekturasida qurilgan bo‘lib, mahalliy IndexedDB xotirasidan foydalanadi. Internet yo‘qligida xodimlar QR orqali check-in qilaveradi, tarmoq ulanganda barcha yozuvlar avtomatik sinxronlashadi.',
    },
    {
      id: 'soliq',
      question: 'O‘zbekiston soliq stavkalari (JShDS, INPS, Ijtimoiy soliq) to‘g‘ri hisoblanadimi?',
      answer:
        'Ha, O‘zbekiston Respublikasi Soliq kodeksiga to‘liq mos keladi: 12% JShDS daromad solig‘i, 0.1% INPS (Xalq banki jamg‘arib boriladigan pensiya fondi) va ish beruvchi tomonidan to‘lanadigan 12% Ijtimoiy soliq avtomatik tarzda hisoblanadi.',
    },
    {
      id: 'google-auth',
      question: 'Nega faqat Google hisob orqali kiriladi?',
      answer:
        'Xavfsizlik eng yuqori darajada ta’minlanishi uchun parollardan butunlay voz kechildi. Google hisobingiz bilan bir bosishda kiring. Parol eslab qolish yo‘q.',
    },
    {
      id: 'data-storage',
      question: 'Ma’lumotlarimiz qayerda va qanday saqlanadi?',
      answer:
        'Hech narsa yo‘qolmaydi. Hech kim ko‘rmaydi. O‘rnatish yo‘q. Server yo‘q. Faqat telefon.',
    },
  ] as FAQItem[],
  ctaBand: {
    title: 'Bugun ro‘yxatdan o‘ting — ertaga jamoangiz tartibda.',
    subtitle: 'Oylik, smena va davomatni bir kechada avtomatlashtiring.',
    buttonText: 'Google bilan boshlash',
  },
  footer: {
    links: [
      { label: 'Maxfiylik siyosati', href: '#privacy' },
      { label: 'Foydalanish shartlari', href: '#terms' },
      { label: 'Xavfsizlik', href: '#security' },
      { label: 'Qo‘llab-quvvatlash', href: 'https://t.me/aluvantis' },
    ],
  },
};
