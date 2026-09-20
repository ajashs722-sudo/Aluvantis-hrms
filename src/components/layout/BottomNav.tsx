import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  Banknote,
  Target,
  Menu,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useLanguage } from '../../lib/i18n';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSidebar: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenSidebar,
}) => {
  const { language } = useLanguage();

  const labels = {
    uz: {
      dashboard: 'Asosiy',
      employees: 'Xodimlar',
      attendance: 'Davomat',
      payroll: 'Oylik',
      kpi: 'KPI',
      menu: 'Menyu',
    },
    ru: {
      dashboard: 'Главная',
      employees: 'Штат',
      attendance: 'Табель',
      payroll: 'Зарплата',
      kpi: 'KPI',
      menu: 'Меню',
    },
    en: {
      dashboard: 'Home',
      employees: 'Staff',
      attendance: 'Time',
      payroll: 'Payroll',
      kpi: 'KPI',
      menu: 'Menu',
    },
  }[language] || {
    dashboard: 'Asosiy',
    employees: 'Xodimlar',
    attendance: 'Davomat',
    payroll: 'Oylik',
    kpi: 'KPI',
    menu: 'Menyu',
  };

  const items = [
    { id: 'dashboard' as NavTab, label: labels.dashboard, icon: LayoutDashboard },
    { id: 'employees' as NavTab, label: labels.employees, icon: Users },
    { id: 'attendance' as NavTab, label: labels.attendance, icon: Clock },
    { id: 'payroll' as NavTab, label: labels.payroll, icon: Banknote },
    { id: 'kpi' as NavTab, label: labels.kpi, icon: Target },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border px-1 py-1 sm:py-1.5 shadow-2xl transition-colors duration-200">
      <div className="grid grid-cols-6 w-full max-w-md mx-auto items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 min-w-0 transition-all duration-150 active:scale-90 cursor-pointer relative ${
                isActive
                  ? 'text-[#0E4F4F] dark:text-[#C6A15B] font-bold'
                  : 'text-muted-foreground hover:text-foreground font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/15' : ''
                }`}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'
                  }`}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] truncate max-w-full text-center leading-tight mt-0.5">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#0E4F4F] dark:bg-[#C6A15B] mt-0.5" />
              )}
            </button>
          );
        })}

        <button
          id="bottom-nav-menu"
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center py-1 px-0.5 min-w-0 text-muted-foreground hover:text-foreground font-medium transition-all duration-150 active:scale-90 cursor-pointer"
        >
          <div className="p-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
          </div>
          <span className="text-[9px] sm:text-[10px] truncate max-w-full text-center leading-tight mt-0.5">
            {labels.menu}
          </span>
        </button>
      </div>
    </nav>
  );
};
