import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Company,
  User,
  Employee,
  Shift,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  PayrollRecord,
  HRDocument,
  AuditLog,
  UserRole,
} from './types';
import {
  INITIAL_COMPANY,
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_SHIFTS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_LEAVE_BALANCES,
  INITIAL_PAYROLL,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
} from './lib/mockData';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { OnboardingModal } from './components/common/OnboardingModal';

import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { OrgStructurePage } from './pages/OrgStructurePage';
import { ShiftsPage } from './pages/ShiftsPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeavesPage } from './pages/LeavesPage';
import { PayrollPage } from './pages/PayrollPage';
import { KPIPage } from './pages/KPIPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { TelegramBotPage } from './pages/TelegramBotPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { GoogleAuthPage } from './pages/GoogleAuthPage';
import { KioskStationPage } from './pages/KioskStationPage';
import { useLanguage } from './lib/i18n';

export default function App() {
  const { t } = useLanguage();

  // App View Mode: 'landing' | 'auth' | 'app'
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'app'>('app');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('aluvantis_is_authenticated');
    return saved !== null ? saved === 'true' : true;
  });

  // Navigation Tab inside App
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // App Main State with localStorage persistence
  const [company, setCompany] = useState<Company>(() => {
    const saved = localStorage.getItem('aluvantis_company');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('aluvantis_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('aluvantis_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('aluvantis_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('aluvantis_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('aluvantis_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(() => {
    const saved = localStorage.getItem('aluvantis_leave_balances');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_BALANCES;
  });

  const [payroll, setPayroll] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('aluvantis_payroll');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [documents, setDocuments] = useState<HRDocument[]>(() => {
    const saved = localStorage.getItem('aluvantis_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('aluvantis_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Responsive device type tracker
  const [deviceType, setDeviceType] = useState<string>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('aluvantis_company', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem('aluvantis_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aluvantis_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('aluvantis_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('aluvantis_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('aluvantis_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('aluvantis_leave_balances', JSON.stringify(leaveBalances));
  }, [leaveBalances]);

  useEffect(() => {
    localStorage.setItem('aluvantis_payroll', JSON.stringify(payroll));
  }, [payroll]);

  useEffect(() => {
    localStorage.setItem('aluvantis_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('aluvantis_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Helper for adding Audit Log
  const logAudit = (action: string, entity_type: string, entity_id?: number, details?: string) => {
    const newLog: AuditLog = {
      id: Date.now(),
      company_id: company.id,
      user_id: currentUser.id,
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Switch role handler
  const handleRoleChange = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    showToast(`Rol o‘zgartirildi: ${role.toUpperCase()}`, 'info');
    logAudit('ROLE_CHANGED', 'user', currentUser.id, `Role changed to ${role}`);
  };

  // Sign Out Handler: Clears auth state and forces Google Auth on re-entry
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('aluvantis_is_authenticated', 'false');
    setCurrentView('landing');
    showToast('Tizimdan muvaffaqiyatli chiqdingiz. Tizimga kirish uchun Google orqali avtorizatsiya qiling.', 'info');
  };

  // Employee CRUD handlers
  const handleAddEmployee = (newEmp: Employee) => {
    const created: Employee = {
      ...newEmp,
      id: Date.now(),
      company_id: company.id,
      created_at: new Date().toISOString(),
    };
    setEmployees((prev) => [created, ...prev]);
    showToast(`${created.full_name} muvaffaqiyatli qo‘shildi`);
    logAudit('EMPLOYEE_CREATED', 'employee', created.id, `Created employee ${created.full_name}`);
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e))
    );
    showToast(`Xodim ma’lumotlari yangilandi`);
    logAudit('EMPLOYEE_UPDATED', 'employee', updatedEmp.id, `Updated employee ${updatedEmp.full_name}`);
  };

  // Shifts CRUD handlers
  const handleAddShift = (newShift: Shift) => {
    const created: Shift = {
      ...newShift,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setShifts((prev) => [...prev, created]);
    showToast(`Yangi smena jadvali kiritildi`);
    logAudit('SHIFT_CREATED', 'shift', created.id, `Created shift for employee #${created.employee_id}`);
  };

  const handleUpdateShift = (updatedShift: Shift) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === updatedShift.id ? updatedShift : s))
    );
    showToast(`Smena muvaffaqiyatli yangilandi`);
    logAudit('SHIFT_UPDATED', 'shift', updatedShift.id, `Updated shift #${updatedShift.id}`);
  };

  // Attendance Check-in handler
  const handleCheckIn = (
    employeeId: number,
    method: 'qr' | 'biometric' | 'gps' | 'manual'
  ) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    const nowIso = new Date().toISOString();
    const todayYmd = nowIso.split('T')[0];

    const existingIdx = attendance.findIndex(
      (a) => a.employee_id === employeeId && a.check_in_time.startsWith(todayYmd)
    );

    if (existingIdx >= 0) {
      const existing = attendance[existingIdx];
      if (!existing.check_out_time) {
        const updatedRecord: AttendanceRecord = {
          ...existing,
          check_out_time: nowIso,
          check_out_method: method,
        };
        const nextList = [...attendance];
        nextList[existingIdx] = updatedRecord;
        setAttendance(nextList);
        showToast(`${emp.full_name} ishni yakunladi`);
        logAudit('ATTENDANCE_CHECK_OUT', 'attendance', existing.id, `${emp.full_name} checked out`);
      } else {
        showToast(`${emp.full_name} bugun allaqachon qayd etilgan`, 'info');
      }
    } else {
      const newRecord: AttendanceRecord = {
        id: Date.now(),
        employee_id: employeeId,
        company_id: company.id,
        check_in_time: nowIso,
        check_in_method: method,
        status: 'ontime',
        notes: 'Aluvantis HR tizimi orqali qayd etildi',
        created_at: nowIso,
      };
      setAttendance((prev) => [newRecord, ...prev]);
      showToast(`✓ ${emp.full_name} davomati qayd etildi`);
      logAudit('ATTENDANCE_CHECK_IN', 'attendance', newRecord.id, `${emp.full_name} checked in via ${method}`);
    }
  };

  // Leave Handlers
  const handleRequestLeave = (req: LeaveRequest) => {
    const created: LeaveRequest = {
      ...req,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setLeaves((prev) => [created, ...prev]);
    showToast(`Ta’til so‘rovi yuborildi`);
    logAudit('LEAVE_REQUESTED', 'leave_request', created.id, `Leave requested by employee #${created.employee_id}`);
  };

  const handleApproveLeave = (leaveId: number) => {
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: 'approved',
              approved_by: currentUser.id,
              approved_at: new Date().toISOString(),
            }
          : l
      )
    );
    showToast(`Ta’til so‘rovi tasdiqlandi`);
    logAudit('LEAVE_APPROVED', 'leave_request', leaveId, `Approved leave #${leaveId}`);
  };

  const handleRejectLeave = (leaveId: number, reason: string) => {
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: 'rejected',
              rejection_reason: reason,
              approved_by: currentUser.id,
              approved_at: new Date().toISOString(),
            }
          : l
      )
    );
    showToast(`Ta’til so‘rovi rad etildi`, 'error');
    logAudit('LEAVE_REJECTED', 'leave_request', leaveId, `Rejected leave #${leaveId}: ${reason}`);
  };

  // Payroll Handlers
  const handleApprovePayroll = (id: number) => {
    setPayroll((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'approved',
              approved_by: currentUser.id,
              approved_at: new Date().toISOString(),
            }
          : p
      )
    );
    showToast(`Ish haqi qaydnomasi tasdiqlandi`);
    logAudit('PAYROLL_APPROVED', 'payroll', id, `Approved payroll #${id}`);
  };

  const handlePayPayroll = (id: number) => {
    setPayroll((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'paid',
              paid_at: new Date().toISOString(),
            }
          : p
      )
    );
    showToast(`Ish haqi muvaffaqiyatli to‘landi`);
    logAudit('PAYROLL_PAID', 'payroll', id, `Paid payroll #${id}`);
  };

  const handleRunBatchCalculation = (month: number, year: number) => {
    showToast(`${year}-yil ${month}-oy uchun barcha xodimlarning ish haqi qayta hisoblandi`);
    logAudit('PAYROLL_BATCH_CALCULATED', 'payroll', undefined, `Batch calculation for ${year}-${month}`);
  };

  // Documents Handlers
  const handleAddDocument = (doc: HRDocument) => {
    const created: HRDocument = {
      ...doc,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setDocuments((prev) => [created, ...prev]);
    showToast(`Hujjat yaratildi va imzolashga tayyorlandi`);
    logAudit('DOCUMENT_CREATED', 'hr_document', created.id, `Created doc ${created.title}`);
  };

  const handleSignDocument = (docId: number, signatureHash: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: 'signed',
              signedWithEimzo: true,
              eimzoSignatureHash: signatureHash,
              eimzoSignerInn: company.tax_id,
              eimzoSignerName: currentUser.name,
              eimzoSignedAt: new Date().toISOString(),
            }
          : d
      )
    );
    showToast(`Hujjat E-IMZO orqali tasdiqlandi`);
    logAudit('DOCUMENT_SIGNED', 'hr_document', docId, `Signed doc #${docId} with hash ${signatureHash}`);
  };

  // Quick payslip download helper
  const handleDownloadLatestPayslip = () => {
    showToast(`Oylik hisob-kitob varaqasi PDF shaklida yuklab olinmoqda...`, 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Pending Approvals count for badges
  const pendingApprovalsCount = leaves.filter((l) => l.status === 'pending').length;

  // Tab Titles mapping
  const tabTitles: Record<string, string> = {
    dashboard: t.nav_dashboard || 'Boshqaruv paneli',
    employees: t.nav_employees || 'Xodimlar',
    org: 'Tashkiliy tuzilma',
    shifts: t.nav_shifts || 'Smenalar & Jadval',
    attendance: t.nav_attendance || 'Davomat & Check-in',
    kiosk: 'Kiosk Stansiyasi',
    leaves: t.nav_leaves || 'Ta’tillar & Ruxsatlar',
    payroll: t.nav_payroll || 'Ish haqi & Oylik',
    kpi: 'KPI & Baholash',
    documents: t.nav_documents || 'Hujjatlar & E-IMZO',
    reports: t.nav_reports || 'Hisobotlar & Soliq',
    telegram: t.nav_telegram || 'Telegram Bot',
    settings: t.nav_settings || 'Sozlamalar',
  };

  // Full Screen Kiosk Station
  if (isKioskMode || currentTab === 'kiosk') {
    return (
      <KioskStationPage
        employees={employees}
        onCheckIn={(empId, method) => handleCheckIn(empId, method as any)}
        onExitKiosk={() => {
          setIsKioskMode(false);
          if (currentTab === 'kiosk') setCurrentTab('attendance');
        }}
      />
    );
  }

  // Promo / Landing View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onNavigateAuth={() => setCurrentView('auth')}
        onNavigateDemo={() => {
          if (!isAuthenticated) {
            showToast('Tizimdan chiqqansiz. Davom etish uchun Google orqali kiring.', 'info');
            setCurrentView('auth');
          } else {
            setCurrentView('app');
          }
        }}
        onSelectFeature={(feat) => {
          if (feat === 'kiosk') setCurrentTab('kiosk');
          else if (feat === 'payroll') setCurrentTab('payroll');
          else if (feat === 'org') setCurrentTab('org');
          else if (feat === 'kpi') setCurrentTab('kpi');
          else setCurrentTab('dashboard');

          if (!isAuthenticated) {
            showToast('Tizimdan chiqqansiz. Davom etish uchun Google orqali kiring.', 'info');
            setCurrentView('auth');
          } else {
            setCurrentView('app');
          }
        }}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  // Google OAuth Auth Page
  if (currentView === 'auth') {
    return (
      <GoogleAuthPage
        onBackToLanding={() => setCurrentView('landing')}
        onAuthSuccess={(userData) => {
          setIsAuthenticated(true);
          localStorage.setItem('aluvantis_is_authenticated', 'true');
          setCurrentUser((prev) => ({
            ...prev,
            name: userData.name,
            email: userData.email,
            avatar_url: userData.picture || prev.avatar_url,
          }));
          if (userData.companyName) {
            setCompany((prev) => ({ ...prev, name: userData.companyName! }));
          }
          setCurrentView('app');
          showToast(`Xush kelibsiz, ${userData.name}!`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC] dark:bg-[#14201F] text-foreground font-sans flex flex-col antialiased selection:bg-[#C6A15B] selection:text-[#14201F]">
      <OfflineBanner />

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center gap-3 backdrop-blur-md ${
              toastMessage.type === 'error'
                ? 'bg-red-500/95 text-white border-red-400'
                : toastMessage.type === 'info'
                ? 'bg-[#0E4F4F]/95 text-[#F6F3EC] border-[#C6A15B]'
                : 'bg-[#C6A15B]/95 text-[#14201F] border-[#14201F]/20'
            }`}
          >
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Responsive Desktop & Drawer Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userRole={currentUser.role}
          pendingApprovalsCount={pendingApprovalsCount}
          companyName={company.legal_name || company.name}
          onLogout={handleLogout}
        />

        {/* Content Viewport with global smooth scroll */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden h-full">
          {/* Top Header */}
          <Header
            currentUser={currentUser}
            onRoleChange={handleRoleChange}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            sidebarOpen={sidebarOpen}
            deviceType={deviceType}
            isKioskMode={isKioskMode}
            onToggleKiosk={() => setIsKioskMode(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onNavigateLanding={() => setCurrentView('landing')}
            onLogout={handleLogout}
            currentTabTitle={tabTitles[currentTab] || 'Boshqaruv paneli'}
            companyName={company.name}
            onOpenSearch={() => {
              const searchNav = document.getElementById('nav-search');
              if (searchNav) searchNav.click();
            }}
          />

          {/* Animated Tab Views - roomy bottom padding (pb-32 lg:pb-12) to never cut off above bottom dock */}
          <main
            className={`flex-1 w-full transition-all flex flex-col ${
              currentTab === 'org'
                ? 'p-0 m-0 max-w-none pb-28 lg:pb-8'
                : 'p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden pb-32 lg:pb-12'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={currentTab === 'org' ? 'w-full flex-1 flex flex-col' : 'w-full'}
              >
                {currentTab === 'dashboard' && (
                  <DashboardPage
                    currentUser={currentUser}
                    employees={employees}
                    shifts={shifts}
                    attendance={attendance}
                    leaves={leaves}
                    payroll={payroll}
                    onNavigate={(tab) => setCurrentTab(tab as NavTab)}
                    onQuickCheckIn={() => handleCheckIn(employees[0]?.id || 1, 'qr')}
                    onDownloadLatestPayslip={handleDownloadLatestPayslip}
                  />
                )}

                {currentTab === 'employees' && (
                  <EmployeesPage
                    employees={employees}
                    shifts={shifts}
                    leaves={leaves}
                    payroll={payroll}
                    documents={documents}
                    onAddEmployee={handleAddEmployee}
                    onUpdateEmployee={handleUpdateEmployee}
                  />
                )}

                {currentTab === 'org' && (
                  <OrgStructurePage
                    company={company}
                    userRole={currentUser.role}
                    onOpenEmployeeCard={() => {
                      setCurrentTab('employees');
                    }}
                  />
                )}

                {currentTab === 'shifts' && (
                  <ShiftsPage
                    shifts={shifts}
                    employees={employees}
                    onAddShift={handleAddShift}
                    onUpdateShift={handleUpdateShift}
                  />
                )}

                {currentTab === 'attendance' && (
                  <AttendancePage
                    attendance={attendance}
                    employees={employees}
                    shifts={shifts}
                    onCheckIn={handleCheckIn}
                  />
                )}

                {currentTab === 'leaves' && (
                  <LeavesPage
                    leaves={leaves}
                    leaveBalances={leaveBalances}
                    employees={employees}
                    onRequestLeave={handleRequestLeave}
                    onApproveLeave={handleApproveLeave}
                    onRejectLeave={handleRejectLeave}
                  />
                )}

                {currentTab === 'payroll' && (
                  <PayrollPage
                    company={company}
                    payroll={payroll}
                    employees={employees}
                    onApprovePayroll={handleApprovePayroll}
                    onPayPayroll={handlePayPayroll}
                    onRunBatchCalculation={handleRunBatchCalculation}
                  />
                )}

                {currentTab === 'kpi' && (
                  <KPIPage
                    employees={employees}
                    shifts={shifts}
                    currentUserRole={currentUser.role}
                    currentEmployeeId={currentUser.id}
                    payrollRecords={payroll}
                    onUpdatePayroll={(updated) => setPayroll(updated)}
                  />
                )}

                {currentTab === 'documents' && (
                  <DocumentsPage
                    company={company}
                    documents={documents}
                    employees={employees}
                    onAddDocument={handleAddDocument}
                    onSignDocument={handleSignDocument}
                  />
                )}

                {currentTab === 'reports' && (
                  <ReportsPage
                    company={company}
                    employees={employees}
                    attendance={attendance}
                    payroll={payroll}
                  />
                )}

                {currentTab === 'telegram' && (
                  <TelegramBotPage company={company} employees={employees} />
                )}

                {currentTab === 'settings' && (
                  <SettingsPage
                    company={company}
                    auditLogs={auditLogs}
                    onSaveCompany={(c) => setCompany(c)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      {/* First-time Setup Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        company={company}
        onSaveCompany={(c) => setCompany(c)}
      />
    </div>
  );
}
