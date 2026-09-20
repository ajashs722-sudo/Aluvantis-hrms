import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'uz' | 'ru' | 'en';

export interface Translations {
  // Sidebar Headings
  nav_main: string;
  nav_employees_attendance: string;
  nav_finance_docs: string;
  nav_system_bot: string;

  // Nav Items
  nav_dashboard: string;
  nav_search: string;
  nav_reports: string;
  nav_employees: string;
  nav_all_employees: string;
  nav_org_structure: string;
  nav_shifts: string;
  nav_attendance: string;
  nav_kiosk: string;
  nav_leaves: string;
  nav_payroll: string;
  nav_documents: string;
  nav_telegram: string;
  nav_settings: string;
  nav_logout: string;
  nav_theme_mode: string;

  // Header & General
  header_search_placeholder: string;
  header_notifications: string;
  header_notifications_unread: string;
  header_role_switch_title: string;
  header_kiosk_station: string;
  header_guide: string;
  header_home: string;
  header_language: string;

  // Org Structure
  org_title: string;
  org_subtitle: string;
  org_view_chart: string;
  org_view_canvas: string;
  org_view_list: string;
  org_add_dept: string;
  org_export_png: string;
  org_auto_layout: string;
  org_zoom_in: string;
  org_zoom_out: string;
  org_reset_view: string;
  org_drag_hint: string;
  org_total_employees: string;
  org_monthly_budget: string;
  org_head_manager: string;
  org_subdepartments: string;
  org_no_employees: string;

  // Themes
  theme_light: string;
  theme_dark: string;
  theme_system: string;
}

export const translations: Record<Language, Translations> = {
  uz: {
    nav_main: 'ASOSIY',
    nav_employees_attendance: 'XODIMLAR & DAVOMAT',
    nav_finance_docs: 'MOLIYA & HUJJATLAR',
    nav_system_bot: 'TIZIM & BOT',

    nav_dashboard: 'Boshqaruv paneli',
    nav_search: 'Tezkor Qidiruv',
    nav_reports: 'Tahlillar & Hisobotlar',
    nav_employees: 'Xodimlar',
    nav_all_employees: 'Barcha xodimlar',
    nav_org_structure: 'Tashkiliy tuzilma',
    nav_shifts: 'Ish jadvallari',
    nav_attendance: 'Davomat nazorati',
    nav_kiosk: 'Kiosk stansiyasi',
    nav_leaves: 'Ta’tillar & Ruxsatlar',
    nav_payroll: 'Ish haqi & Soliq',
    nav_documents: 'Hujjatlar & E-IMZO',
    nav_telegram: 'Telegram Bot',
    nav_settings: 'Tizim sozlamalari',
    nav_logout: 'Tizimdan chiqish',
    nav_theme_mode: 'Mavzu rejimi',

    header_search_placeholder: 'Xodimlar, jadvallar, hisobotlar yoki amallarni qidirish...',
    header_notifications: 'Bildirishnomalar',
    header_notifications_unread: '3 ta yangi',
    header_role_switch_title: 'TEST QILISH UCHUN ROLNI ALMASHTIRISH:',
    header_kiosk_station: 'Kiosk stansiyasi',
    header_guide: 'Yo‘riqnoma',
    header_home: 'Bosh sahifa',
    header_language: 'Til',

    org_title: 'Tashkiliy tuzilma',
    org_subtitle: 'Korxona bo‘limlari, rahbarlar va xodimlarning bo‘ysunish iyerarxiyasi',
    org_view_chart: 'Daraxt sxema',
    org_view_canvas: 'Canvas Konstruktor',
    org_view_list: 'Ro‘yxat',
    org_add_dept: 'Bo‘lim qo‘shish',
    org_export_png: 'Eksport PNG',
    org_auto_layout: 'Avto-tekislash',
    org_zoom_in: 'Yaqinlashtirish',
    org_zoom_out: 'Uzoqlashtirish',
    org_reset_view: 'Asliga qaytarish',
    org_drag_hint: 'Bloklarni erkin siljitish va tahrirlash mumkin',
    org_total_employees: 'xodim',
    org_monthly_budget: 'oylik fond',
    org_head_manager: 'Boshliq',
    org_subdepartments: 'Quyi bo‘limlar',
    org_no_employees: 'Ushbu bo‘limda hozircha xodimlar mavjud emas',

    theme_light: 'Yorug‘',
    theme_dark: 'To‘q',
    theme_system: 'Tizim',
  },
  ru: {
    nav_main: 'ГЛАВНОЕ',
    nav_employees_attendance: 'СОТРУДНИКИ И ПОСЕЩАЕМОСТЬ',
    nav_finance_docs: 'ФИНАНСЫ И ДОКУМЕНТЫ',
    nav_system_bot: 'СИСТЕМА И БОТ',

    nav_dashboard: 'Панель управления',
    nav_search: 'Быстрый поиск',
    nav_reports: 'Аналитика и отчеты',
    nav_employees: 'Сотрудники',
    nav_all_employees: 'Все сотрудники',
    nav_org_structure: 'Оргструктура',
    nav_shifts: 'Графики смен',
    nav_attendance: 'Учет посещаемости',
    nav_kiosk: 'Киоск терминал',
    nav_leaves: 'Отпуска и отгулы',
    nav_payroll: 'Зарплата и налоги',
    nav_documents: 'Документы и ЭЦП',
    nav_telegram: 'Telegram Бот',
    nav_settings: 'Настройки системы',
    nav_logout: 'Выйти из системы',
    nav_theme_mode: 'Тема оформления',

    header_search_placeholder: 'Поиск сотрудников, смен, отчетов или команд...',
    header_notifications: 'Уведомления',
    header_notifications_unread: '3 новых',
    header_role_switch_title: 'ПЕРЕКЛЮЧЕНИЕ РОЛИ ДЛЯ ТЕСТИРОВАНИЯ:',
    header_kiosk_station: 'Киоск терминал',
    header_guide: 'Инструкция',
    header_home: 'Главная',
    header_language: 'Язык',

    org_title: 'Организационная структура',
    org_subtitle: 'Иерархия отделов, руководителей и подчинения сотрудников компании',
    org_view_chart: 'Древовидная схема',
    org_view_canvas: 'Canvas Конструктор',
    org_view_list: 'Список',
    org_add_dept: 'Добавить отдел',
    org_export_png: 'Экспорт PNG',
    org_auto_layout: 'Авто-выравнивание',
    org_zoom_in: 'Приблизить',
    org_zoom_out: 'Отдалить',
    org_reset_view: 'Сбросить масштаб',
    org_drag_hint: 'Блоки можно свободно перемещать и настраивать',
    org_total_employees: 'сотр.',
    org_monthly_budget: 'фонд з/п',
    org_head_manager: 'Руководитель',
    org_subdepartments: 'Подотделы',
    org_no_employees: 'В данном отделе пока нет сотрудников',

    theme_light: 'Светлая',
    theme_dark: 'Темная',
    theme_system: 'Системная',
  },
  en: {
    nav_main: 'MAIN',
    nav_employees_attendance: 'EMPLOYEES & ATTENDANCE',
    nav_finance_docs: 'FINANCE & DOCUMENTS',
    nav_system_bot: 'SYSTEM & BOT',

    nav_dashboard: 'Dashboard',
    nav_search: 'Quick Search',
    nav_reports: 'Analytics & Reports',
    nav_employees: 'Employees',
    nav_all_employees: 'All Employees',
    nav_org_structure: 'Org Structure',
    nav_shifts: 'Shift Schedules',
    nav_attendance: 'Attendance Control',
    nav_kiosk: 'Kiosk Terminal',
    nav_leaves: 'Leaves & Absences',
    nav_payroll: 'Payroll & Taxes',
    nav_documents: 'Documents & E-Sign',
    nav_telegram: 'Telegram Bot',
    nav_settings: 'System Settings',
    nav_logout: 'Log Out',
    nav_theme_mode: 'Theme Mode',

    header_search_placeholder: 'Search employees, shifts, reports or actions...',
    header_notifications: 'Notifications',
    header_notifications_unread: '3 new',
    header_role_switch_title: 'SWITCH ROLE FOR TESTING:',
    header_kiosk_station: 'Kiosk Station',
    header_guide: 'Guidebook',
    header_home: 'Home',
    header_language: 'Language',

    org_title: 'Organizational Structure',
    org_subtitle: 'Enterprise department hierarchy, managers, and reporting structure',
    org_view_chart: 'Tree Chart',
    org_view_canvas: 'Canvas Builder',
    org_view_list: 'List View',
    org_add_dept: 'Add Department',
    org_export_png: 'Export PNG',
    org_auto_layout: 'Auto Layout',
    org_zoom_in: 'Zoom In',
    org_zoom_out: 'Zoom Out',
    org_reset_view: 'Reset View',
    org_drag_hint: 'Blocks can be freely dragged and customized on canvas',
    org_total_employees: 'staff',
    org_monthly_budget: 'payroll budget',
    org_head_manager: 'Head Manager',
    org_subdepartments: 'Sub-units',
    org_no_employees: 'No employees in this department yet',

    theme_light: 'Light',
    theme_dark: 'Dark',
    theme_system: 'System',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'uz',
  setLanguage: () => {},
  t: translations.uz,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aluvantis_lang') as Language;
      if (saved && ['uz', 'ru', 'en'].includes(saved)) return saved;
    }
    return 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aluvantis_lang', lang);
    }
  };

  const t = translations[language] || translations.uz;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
