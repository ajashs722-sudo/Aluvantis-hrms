import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Users,
  CalendarDays,
  Clock,
  PlaneTakeoff,
  Banknote,
  Target,
  FileCheck2,
  BarChart3,
  Bot,
  Settings,
  Tv,
  LogOut,
  ChevronDown,
  ChevronRight,
  Network,
  Command,
  X,
  Building,
  Check,
  Plus,
} from 'lucide-react';
import { UserRole } from '../../types';
import { Theme } from '../ui/theme';
import { useLanguage } from '../../lib/i18n';

export type NavTab =
  | 'dashboard'
  | 'employees'
  | 'org'
  | 'shifts'
  | 'attendance'
  | 'kiosk'
  | 'leaves'
  | 'payroll'
  | 'kpi'
  | 'documents'
  | 'reports'
  | 'telegram'
  | 'settings';

export type NavItemData = {
  id: string;
  tabId?: NavTab;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  goldBadge?: boolean;
  shortcut?: string;
  roles?: UserRole[];
  children?: NavItemData[];
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  pendingApprovalsCount: number;
  companyName?: string;
  onLogout?: () => void;
}

function WorkspaceSwitcher({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect?: (ws: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(selected || '«Aluvantis Technologies» MChJ');

  const current = selected || internalSelected;
  const handleSelect = onSelect || setInternalSelected;

  const workspaces = [
    { name: '«Aluvantis Technologies» MChJ', plan: 'Enterprise HR (Bosh ofis)', code: 'HQ' },
    { name: 'Shayxontohur Filiali', plan: 'Filial №1 (Savdo)', code: 'SH' },
    { name: 'Samarqand Markazi', plan: 'Mintaqaviy Hub', code: 'SM' },
    { name: 'Farg‘ona Logistika', plan: 'Taqsimot Markazi', code: 'FG' },
  ];

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-2 mb-1 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-border cursor-pointer transition-all select-none group"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[#0E4F4F] text-[#C6A15B] flex items-center justify-center font-display font-black text-xs shadow-sm shrink-0">
            {current.charAt(1) || current.charAt(0) || 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold leading-tight text-foreground truncate max-w-[145px]">
              {current}
            </span>
            <span className="text-[10px] text-[#C6A15B] font-semibold leading-tight flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Pro Enterprise
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
        />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[52px] left-0 w-full bg-card border border-border rounded-2xl shadow-2xl z-50 p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60">
              Korxona va Filiallar
            </div>
            {workspaces.map((ws) => (
              <div
                key={ws.name}
                onClick={() => {
                  handleSelect(ws.name);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                  current === ws.name
                    ? 'bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/15 text-[#0E4F4F] dark:text-[#C6A15B] font-semibold'
                    : 'text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="truncate font-semibold">{ws.name}</span>
                  <span className="text-[10px] text-muted-foreground">{ws.plan}</span>
                </div>
                {current === ws.name && <Check className="w-3.5 h-3.5 shrink-0 text-[#C6A15B]" />}
              </div>
            ))}
            <div className="h-px bg-border/60 my-0.5 mx-1" />
            <div
              onClick={() => {
                alert('Yangi filial qo‘shish oynasi tez orada!');
                setIsOpen(false);
              }}
              className="px-2.5 py-1.5 text-xs text-[#0E4F4F] dark:text-[#C6A15B] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer flex items-center gap-2 font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi filial qo‘shish</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NavItem({
  item,
  activeTab,
  onSelectTab,
  onOpenSearch,
  level = 0,
}: {
  item: NavItemData;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSearch?: () => void;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  // Check if item itself is active
  const isDirectActive = item.tabId === activeTab;
  // Check if any subchild is active
  const isAnyChildActive = hasChildren && item.children?.some((c) => c.tabId === activeTab);

  // Auto expand if subchild is active
  useEffect(() => {
    if (isAnyChildActive) {
      setIsOpen(true);
    }
  }, [isAnyChildActive]);

  const handleClick = () => {
    if (item.id === 'search' && onOpenSearch) {
      onOpenSearch();
      return;
    }
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (item.tabId) {
      onSelectTab(item.tabId);
    }
  };

  const Icon = item.icon;

  return (
    <div className="flex flex-col">
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
        className={`group relative flex items-center justify-between py-2 pr-2.5 my-0.5 rounded-xl text-xs font-semibold cursor-pointer transition-all select-none ${
          isDirectActive
            ? 'bg-[#0E4F4F] text-[#F6F3EC] dark:bg-[#C6A15B] dark:text-[#14201F] shadow-md font-bold'
            : isAnyChildActive
            ? 'text-[#0E4F4F] dark:text-[#C6A15B] font-bold bg-[#0E4F4F]/5 dark:bg-[#C6A15B]/10'
            : 'text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              isDirectActive
                ? 'text-[#C6A15B] dark:text-[#14201F]'
                : isAnyChildActive
                ? 'text-[#0E4F4F] dark:text-[#C6A15B]'
                : 'text-muted-foreground group-hover:text-foreground'
            }`}
            strokeWidth={isDirectActive || isAnyChildActive ? 2.5 : 2}
          />
          <span className="truncate">{item.title}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {item.shortcut && (
            <kbd className="hidden sm:inline-flex items-center justify-center text-[9px] font-mono px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-muted-foreground">
              {item.shortcut}
            </kbd>
          )}

          {item.badge && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isDirectActive
                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                  : item.goldBadge
                  ? 'bg-[#C6A15B]/20 text-[#C6A15B]'
                  : 'bg-black/10 dark:bg-white/10 text-muted-foreground'
              }`}
            >
              {item.badge}
            </span>
          )}

          {hasChildren && (
            <ChevronRight
              className={`w-3.5 h-3.5 text-muted-foreground/60 transition-transform duration-200 ${
                isOpen ? 'rotate-90 text-[#0E4F4F] dark:text-[#C6A15B]' : ''
              }`}
              strokeWidth={2}
            />
          )}
        </div>
      </div>

      {hasChildren && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100 mt-0.5' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5">
            <div
              className="absolute top-0 bottom-0 border-l border-border/50"
              style={{ left: `${level * 10 + 19}px` }}
            />
            {item.children!.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                activeTab={activeTab}
                onSelectTab={onSelectTab}
                onOpenSearch={onOpenSearch}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isOpen,
  onClose,
  userRole,
  pendingApprovalsCount,
  companyName = '«Aluvantis Technologies» MChJ',
  onLogout,
}) => {
  const { t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut ⌘K or Ctrl+K to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Nav Groups definition with translations
  const navGroups: NavGroupData[] = [
    {
      heading: t.nav_main,
      items: [
        {
          id: 'dashboard',
          tabId: 'dashboard',
          title: t.nav_dashboard,
          icon: LayoutDashboard,
          roles: ['admin', 'hr', 'manager', 'employee', 'cashier', 'storekeeper'],
        },
        {
          id: 'search',
          title: t.nav_search,
          icon: Search,
          shortcut: '⌘K',
          roles: ['admin', 'hr', 'manager', 'employee', 'cashier', 'storekeeper'],
        },
        {
          id: 'reports',
          tabId: 'reports',
          title: t.nav_reports,
          icon: BarChart3,
          roles: ['admin', 'hr', 'manager', 'cashier'],
        },
      ],
    },
    {
      heading: t.nav_employees_attendance,
      items: [
        {
          id: 'employees',
          tabId: 'employees',
          title: t.nav_employees,
          icon: Users,
          badge: '8 ta',
          roles: ['admin', 'hr', 'manager', 'cashier'],
          children: [
            {
              id: 'employees-all',
              tabId: 'employees',
              title: t.nav_all_employees,
              icon: Users,
            },
            {
              id: 'org',
              tabId: 'org',
              title: t.nav_org_structure,
              icon: Network,
            },
          ],
        },
        {
          id: 'shifts',
          tabId: 'shifts',
          title: t.nav_shifts,
          icon: CalendarDays,
          roles: ['admin', 'hr', 'manager', 'employee'],
        },
        {
          id: 'attendance',
          tabId: 'attendance',
          title: t.nav_attendance,
          icon: Clock,
          roles: ['admin', 'hr', 'manager', 'employee'],
        },
        {
          id: 'kiosk',
          tabId: 'kiosk',
          title: t.nav_kiosk,
          icon: Tv,
          badge: 'Terminal',
          goldBadge: true,
          roles: ['admin', 'hr', 'manager', 'cashier'],
        },
        {
          id: 'leaves',
          tabId: 'leaves',
          title: t.nav_leaves,
          icon: PlaneTakeoff,
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} yangi` : undefined,
          roles: ['admin', 'hr', 'manager', 'employee'],
        },
      ],
    },
    {
      heading: t.nav_finance_docs,
      items: [
        {
          id: 'payroll',
          tabId: 'payroll',
          title: t.nav_payroll,
          icon: Banknote,
          badge: 'UZS',
          roles: ['admin', 'hr', 'cashier', 'employee'],
        },
        {
          id: 'kpi',
          tabId: 'kpi',
          title: 'KPI & Samaradorlik',
          icon: Target,
          roles: ['admin', 'hr', 'manager', 'employee', 'cashier', 'storekeeper'],
        },
        {
          id: 'documents',
          tabId: 'documents',
          title: t.nav_documents,
          icon: FileCheck2,
          roles: ['admin', 'hr', 'manager', 'employee'],
        },
      ],
    },
    {
      heading: t.nav_system_bot,
      items: [
        {
          id: 'telegram',
          tabId: 'telegram',
          title: t.nav_telegram,
          icon: Bot,
          badge: 'Live',
          goldBadge: true,
          roles: ['admin', 'hr', 'manager'],
        },
        {
          id: 'settings',
          tabId: 'settings',
          title: t.nav_settings,
          icon: Settings,
          shortcut: '⌘,',
          roles: ['admin', 'hr'],
        },
      ],
    },
  ];

  // Filter items by role
  const filteredGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.roles || item.roles.includes(userRole)),
  })).filter((group) => group.items.length > 0);

  // Quick actions for search modal
  const searchableActions = [
    { title: t.nav_dashboard, desc: 'Asosiy ko‘rsatkichlar va tezkor amallar', tab: 'dashboard' as NavTab },
    { title: t.nav_employees, desc: 'Barcha 8 ta faol xodim va shtat birliklari', tab: 'employees' as NavTab },
    { title: t.nav_org_structure, desc: 'Tashkiliy iyerarxiya va canvas diagramma', tab: 'org' as NavTab },
    { title: t.nav_attendance, desc: 'Kirish/chiqish va kechikishlar', tab: 'attendance' as NavTab },
    { title: t.nav_kiosk, desc: 'Sensorli planshet uchun to‘liq ekranli terminal', tab: 'kiosk' as NavTab },
    { title: t.nav_leaves, desc: 'Yillik mehnat ta’tili arizalari', tab: 'leaves' as NavTab },
    { title: t.nav_payroll, desc: 'JShDS, INPS va Click/Payme to‘lovlari', tab: 'payroll' as NavTab },
    { title: t.nav_documents, desc: 'T-2 kartochkasi, buyruqlar va aktlar', tab: 'documents' as NavTab },
    { title: t.nav_reports, desc: 'Yillik va oylik eksport (Excel / PDF)', tab: 'reports' as NavTab },
    { title: t.nav_telegram, desc: 'Xabarnomalar va davomat boti', tab: 'telegram' as NavTab },
    { title: t.nav_settings, desc: 'Rekvizitlar, ish vaqti va xavfsizlik', tab: 'settings' as NavTab },
  ];

  const filteredSearchActions = searchableActions.filter(
    (action) =>
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[280px] max-w-[85vw] bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-20 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Workspace Switcher Header & Mobile Close */}
        <div className="p-3 border-b border-border/80 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <WorkspaceSwitcher selected={companyName} />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer shrink-0 mb-1"
            aria-label="Menyuni yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grouped Navigation */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filteredGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.heading && (
                <div className="px-3 pt-1 pb-1 flex items-center gap-2">
                  <span className="text-[11px] font-black tracking-wider text-[#0E4F4F] dark:text-[#C6A15B] uppercase select-none">
                    {group.heading}
                  </span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
              )}
              {group.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  activeTab={currentTab}
                  onSelectTab={(tab) => {
                    onTabChange(tab);
                    onClose();
                  }}
                  onOpenSearch={() => setIsSearchOpen(true)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Bar: Theme switcher & Log out */}
        <div className="p-3 border-t border-border flex flex-col gap-2.5 bg-black/[0.03] dark:bg-white/[0.03]">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-foreground">{t.nav_theme_mode}</span>
            <Theme variant="tabs" size="sm" showLabel={false} />
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span>{t.nav_logout}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">ESC</span>
            </button>
          )}
        </div>
      </aside>

      {/* Quick Search Command Modal (⌘K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/60 backdrop-blur-sm px-4">
          <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-10">
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" strokeWidth={2} />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent py-1 outline-none text-sm text-foreground placeholder:text-muted-foreground"
                placeholder={t.header_search_placeholder}
              />
              <kbd
                onClick={() => setIsSearchOpen(false)}
                className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 ml-2 text-[10px] font-mono text-muted-foreground bg-black/5 dark:bg-white/10 rounded cursor-pointer hover:text-foreground transition-colors"
              >
                ESC
              </kbd>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 p-1 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 max-h-[350px] overflow-y-auto divide-y divide-border/40">
              {filteredSearchActions.length > 0 ? (
                filteredSearchActions.map((action, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onTabChange(action.tab);
                      setIsSearchOpen(false);
                      onClose();
                    }}
                    className="p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground group-hover:text-[#0E4F4F] dark:group-hover:text-[#C6A15B]">
                        {action.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#0E4F4F] dark:text-[#C6A15B] opacity-0 group-hover:opacity-100 transition-opacity">
                      O‘tish →
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground text-xs">
                  <Command className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
                  "{searchQuery}" bo‘yicha hech narsa topilmadi
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
