import React, { useState } from 'react';
import {
  Bell,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  CheckCircle,
  Menu,
  ShieldCheck,
  Building2,
  ChevronDown,
  Sparkles,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Check,
  Globe,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { Theme } from '../ui/theme';
import { useLanguage, Language } from '../../lib/i18n';

interface HeaderProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
  deviceType: string;
  isKioskMode: boolean;
  onToggleKiosk: () => void;
  onOpenOnboarding: () => void;
  onNavigateLanding?: () => void;
  onLogout?: () => void;
  currentTabTitle?: string;
  companyName?: string;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  onToggleSidebar,
  sidebarOpen = true,
  deviceType,
  isKioskMode,
  onToggleKiosk,
  onOpenOnboarding,
  onNavigateLanding,
  onLogout,
  currentTabTitle = 'Boshqaruv paneli',
  companyName = '«Aluvantis Technologies» MChJ',
  onOpenSearch,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: 'O‘zbekcha', flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'admin', title: 'Bosh direktor (Admin)', desc: 'To‘liq vakolat, statistika va audit' },
    { role: 'hr', title: 'HR Direktori', desc: 'Xodimlar, ta’tillar, buyruqlar va hujjatlar' },
    { role: 'manager', title: 'Bo‘lim boshlig‘i', desc: 'Smena jadvallari, jamoa davomati, ruxsatlar' },
    { role: 'employee', title: 'Xodim (Developer)', desc: 'Mening smenalarim, hisob-kitob, ta’til arizasi' },
    { role: 'cashier', title: 'Bosh hisobchi', desc: 'Ish haqi hisoblash, JShDS/INPS soliq, Click/Payme' },
  ];

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5 text-[#0E4F4F] dark:text-[#C6A15B]" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5 text-[#0E4F4F] dark:text-[#C6A15B]" />;
      case 'laptop':
        return <Laptop className="w-3.5 h-3.5 text-[#0E4F4F] dark:text-[#C6A15B]" />;
      case 'big_screen':
        return <Tv className="w-3.5 h-3.5 text-[#0E4F4F] dark:text-[#C6A15B]" />;
      default:
        return <Monitor className="w-3.5 h-3.5 text-[#0E4F4F] dark:text-[#C6A15B]" />;
    }
  };

  const closeAllMenus = () => {
    setShowRoleMenu(false);
    setShowNotifications(false);
    setShowLangMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs transition-colors duration-200">
      {/* Click Outside Global Overlay */}
      {(showRoleMenu || showNotifications || showLangMenu) && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
          onClick={closeAllMenus}
        />
      )}

      {/* Left: Sidebar toggle & Breadcrumbs */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <button
          id="btn-sidebar-toggle"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer shrink-0"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 hidden lg:block" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 hidden lg:block" />
          )}
          <Menu className="w-5 h-5 lg:hidden" />
        </button>

        {/* Breadcrumb Hierarchy */}
        <div className="flex items-center gap-1 text-xs sm:text-sm min-w-0">
          <span className="hidden md:inline font-semibold text-muted-foreground truncate max-w-[140px] sm:max-w-[180px]">
            {companyName}
          </span>
          <span className="hidden md:inline text-muted-foreground/40 font-mono">/</span>
          <span className="font-bold text-foreground truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[220px] text-xs sm:text-sm">
            {currentTabTitle}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Quick Search trigger */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-border text-xs text-muted-foreground transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Qidiruv...</span>
            <kbd className="text-[10px] font-mono px-1 rounded bg-black/10 dark:bg-white/10">⌘K</kbd>
          </button>
        )}

        {/* Device Detection Badge */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-border text-xs text-foreground">
          {getDeviceIcon()}
          <span className="capitalize font-medium text-[11px]">{deviceType}</span>
        </div>

        {/* Kiosk Mode Toggle */}
        <button
          id="btn-kiosk-toggle"
          onClick={onToggleKiosk}
          className={`hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            isKioskMode
              ? 'bg-[#0E4F4F] text-[#F6F3EC] ring-2 ring-[#C6A15B]'
              : 'bg-black/5 dark:bg-white/5 text-foreground hover:bg-black/10 dark:hover:bg-white/10 border border-border'
          }`}
          title="Kiosk terminal"
        >
          <Tv className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span className="hidden md:inline">{t.header_kiosk_station}</span>
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            id="btn-language-selector"
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowRoleMenu(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-xl border border-border bg-card hover:bg-black/5 dark:hover:bg-white/5 text-foreground text-xs font-bold transition cursor-pointer shadow-xs"
            title="Tilni o‘zgartirish / Switch language"
          >
            <span className="text-xs sm:text-sm">
              {languages.find((l) => l.code === language)?.flag || '🌐'}
            </span>
            <span className="uppercase text-[10px] sm:text-[11px]">{language}</span>
            <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-card shadow-2xl border border-border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/60 mb-1">
                {t.header_language}
              </div>
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    language === item.code
                      ? 'bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/15 text-[#0E4F4F] dark:text-[#C6A15B]'
                      : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </div>
                  {language === item.code && <Check className="w-3.5 h-3.5 text-[#C6A15B]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <Theme variant="button" size="sm" showLabel={false} />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
              setShowLangMenu(false);
            }}
            className="relative p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 border border-border transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D64545] ring-2 ring-card" />
          </button>

          {showNotifications && (
            <div className="fixed sm:absolute top-14 sm:top-full right-2 sm:right-0 mt-1 w-[calc(100vw-16px)] sm:w-80 max-w-[340px] rounded-2xl bg-card shadow-2xl border border-border p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-border font-semibold text-foreground">
                <span>{t.header_notifications} ({t.header_notifications_unread})</span>
                <span className="text-[10px] text-[#C6A15B] font-bold">Telegram Bot faol</span>
              </div>
              <div className="divide-y divide-border/50 max-h-64 overflow-y-auto mt-1">
                <div className="py-2.5">
                  <p className="font-semibold text-foreground">Ta’til arizasi yuborildi</p>
                  <p className="text-muted-foreground text-[11px]">Azizbek Rakhimov 5 kunlik yillik ta’til so‘radi.</p>
                  <span className="text-[10px] text-[#C6A15B] font-medium">10 daqiqa oldin</span>
                </div>
                <div className="py-2.5">
                  <p className="font-semibold text-foreground">Soliq.uz hisoboti tayyor</p>
                  <p className="text-muted-foreground text-[11px]">Avgust oyi JShDS va Ijtimoiy soliq hisoboti shakllantirildi.</p>
                  <span className="text-[10px] text-[#C6A15B] font-medium">1 soat oldin</span>
                </div>
                <div className="py-2.5">
                  <p className="font-semibold text-foreground">E-IMZO kalit muddati</p>
                  <p className="text-muted-foreground text-[11px]">Korxona E-IMZO sertifikati faol holatda (2027-yilgacha).</p>
                  <span className="text-[10px] text-emerald-500 font-medium">Tasdiqlangan</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher & User Profile */}
        <div className="relative">
          <button
            id="btn-role-switcher"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifications(false);
              setShowLangMenu(false);
            }}
            className="flex items-center gap-1 sm:gap-2 p-1 sm:px-2 sm:py-1.5 rounded-xl border border-border hover:border-[#C6A15B] bg-card hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer shadow-xs"
          >
            <img
              src={currentUser.avatar_url}
              alt={currentUser.name}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover ring-1 ring-[#0E4F4F]/20 dark:ring-[#C6A15B]/40"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-foreground leading-tight line-clamp-1 max-w-[110px]">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-[#C6A15B]" />
                <p className="text-[10px] text-[#0E4F4F] dark:text-[#C6A15B] capitalize font-bold leading-none">
                  {currentUser.role}
                </p>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden xs:block" />
          </button>

          {showRoleMenu && (
            <div className="fixed sm:absolute top-14 sm:top-full right-2 sm:right-0 mt-1 w-[calc(100vw-16px)] sm:w-72 max-w-[320px] rounded-2xl bg-card shadow-2xl border border-border p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 border-b border-border mb-1">
                <p className="text-[10px] font-extrabold text-[#0E4F4F] dark:text-[#C6A15B] uppercase tracking-wider">
                  {t.header_role_switch_title}
                </p>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      onRoleChange(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-start justify-between transition cursor-pointer ${
                      currentUser.role === r.role
                        ? 'bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/15 text-[#0E4F4F] dark:text-[#C6A15B] font-bold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-foreground'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground font-normal">{r.desc}</p>
                    </div>
                    {currentUser.role === r.role && (
                      <Check className="w-4 h-4 text-[#0E4F4F] dark:text-[#C6A15B] shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              {onLogout && (
                <div className="pt-2 mt-2 border-t border-border">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-bold transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.nav_logout}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
