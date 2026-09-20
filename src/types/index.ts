export type UserRole = 'admin' | 'hr' | 'manager' | 'employee' | 'cashier' | 'storekeeper';

export interface Company {
  id: number;
  name: string;
  legal_name: string;
  address: string;
  phone: string;
  email: string;
  tax_id: string; // INN in Uzbekistan (9 digits)
  oked: string; // Business classification code
  bank_name?: string;
  bank_mfo: string; // Bank MFO (5 digits)
  bank_account: string; // 20 digits account
  owner_id?: number;
  settings: {
    currency: string;
    tax_jshds_rate: number; // 12% in UZ
    tax_social_rate: number; // 12% in UZ
    tax_pension_rate: number; // 0.1% in UZ
    standard_work_hours_per_week: number;
    annual_leave_default_days: number;
    attendance_grace_period_minutes?: number;
    gps_checkin_latitude: number;
    gps_checkin_longitude: number;
    gps_checkin_radius_meters: number;
  };
  created_at: string;
}

export interface User {
  id: number;
  company_id: number;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  telegram_id?: string;
  telegram_username?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface Department {
  id: number;
  company_id: number;
  name: string;
  head_employee_id?: number | null;
  parent_id?: number | null;
  color?: string;
  x?: number;
  y?: number;
  created_at: string;
}

export type EmployeeStatus = 'active' | 'probation' | 'terminated' | 'resigned';
export type Gender = 'male' | 'female' | 'other';

export interface Employee {
  id: number;
  user_id?: number;
  company_id: number;
  full_name: string;
  position: string;
  department: string;
  department_id?: number;
  manager_id?: number | null;
  hire_date: string;
  termination_date?: string;
  base_salary: number; // in UZS
  currency: string;
  bank_name: string;
  bank_account: string;
  inn: string; // 9 digits
  pinfl: string; // 14 digits JShShIR
  passport_series: string; // e.g. "AA" or "FA"
  passport_number: string; // 7 digits
  birth_date: string;
  gender: Gender;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: EmployeeStatus;
  notes?: string;
  avatar_url?: string;
  telegram_username?: string;
  created_at: string;
}

export type ShiftType = 'morning' | 'afternoon' | 'night' | 'custom';
export type ShiftStatus = 'scheduled' | 'checked_in' | 'checked_out' | 'absent' | 'late' | 'cancelled';

export interface Shift {
  id: number;
  employee_id: number;
  shift_date: string; // YYYY-MM-DD
  shift_type: ShiftType;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  scheduled_hours: number;
  actual_hours?: number;
  status: ShiftStatus;
  check_in_time?: string;
  check_out_time?: string;
  check_in_location_lat?: number;
  check_in_location_lng?: number;
  check_out_location_lat?: number;
  check_out_location_lng?: number;
  overtime_hours?: number;
  notes?: string;
  created_at: string;
}

export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'bereavement' | 'study';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: LeaveStatus;
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  attachments?: string[];
  created_at: string;
}

export interface LeaveBalance {
  id: number;
  employee_id: number;
  year: number;
  leave_type: LeaveType;
  total_days: number;
  used_days: number;
  carried_over_days: number;
}

export type PayrollStatus = 'draft' | 'calculated' | 'approved' | 'paid' | 'cancelled';

export interface PayrollRecord {
  id: number;
  employee_id: number;
  company_id: number;
  month: number;
  year: number;
  base_salary: number;
  bonuses: number;
  bonus_pay?: number;
  allowances: number;
  deductions: number;
  overtime_pay: number;
  overtime_hours?: number;
  gross_salary: number;
  tax_jshds: number; // 12% income tax
  tax_pension_employee: number; // 0.1% INPS accumulative
  inps_contribution?: number;
  tax_pension_employer: number;
  tax_social: number; // 12% social tax
  social_tax?: number;
  net_salary: number;
  status: PayrollStatus;
  approved_by?: number;
  approved_at?: string;
  paid_at?: string;
  payment_date?: string;
  payment_method?: 'uzcard_bulk' | 'humo_bulk' | 'click' | 'payme' | 'cash';
  payment_reference?: string;
  payslip_url?: string;
  notes?: string;
  created_at: string;
}

export type CheckInMethod = 'qr' | 'biometric' | 'gps' | 'manual';

export interface AttendanceRecord {
  id: number;
  company_id?: number;
  employee_id: number;
  shift_id?: number;
  check_in_time: string;
  check_out_time?: string;
  check_in_method: CheckInMethod;
  check_out_method?: CheckInMethod;
  check_in_location_lat?: number;
  check_in_location_lng?: number;
  check_out_location_lat?: number;
  check_out_location_lng?: number;
  qr_code?: string;
  device_info?: string;
  ip_address?: string;
  status?: 'ontime' | 'late' | 'early_leave';
  notes?: string;
  created_at: string;
}

export type DocumentType = 'contract' | 'id' | 'passport' | 'certificate' | 'order' | 'nda' | 'other';

export interface HRDocument {
  id: number;
  company_id?: number;
  employee_id: number;
  document_type: DocumentType;
  type?: DocumentType;
  title: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  issue_date?: string;
  expiry_date?: string;
  uploaded_by?: number;
  status?: 'draft' | 'pending' | 'signed' | 'expired';
  signedWithEimzo?: boolean;
  eimzoSignatureHash?: string;
  eimzoSignerInn?: string;
  eimzoSignerName?: string;
  eimzoSignedAt?: string;
  eimzoTimestamp?: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  company_id?: number;
  user_id?: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface IntegrationsConfig {
  telegram: {
    bot_token: string;
    bot_username: string;
    group_chat_id: string;
    enabled: boolean;
    notify_on_leave: boolean;
    notify_on_payroll: boolean;
    notify_on_shift: boolean;
  };
  click: {
    merchant_id: string;
    service_id: string;
    secret_key: string;
    enabled: boolean;
  };
  payme: {
    merchant_id: string;
    secret_key: string;
    enabled: boolean;
  };
  eimzo: {
    client_version: string;
    active_cert_serial: string;
    status: 'connected' | 'not_installed' | 'demo_mode';
  };
  soliq: {
    inn: string;
    api_key: string;
    auto_sync: boolean;
    last_export_date?: string;
  };
  eskiz: {
    email: string;
    api_token: string;
    sender_name: string;
    enabled: boolean;
  };
}

export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'big_screen';

export type KPISource = 'attendance' | 'sales' | 'tasks' | 'rating' | 'manual';
export type KPIDirection = 'up' | 'down';
export type KPIPeriodType = 'month' | 'quarter';

export interface KPIMetric {
  id: number;
  company_id: number;
  name: string;
  source: KPISource;
  target: number;
  direction: KPIDirection;
  weight: number;
  period: KPIPeriodType;
  active: boolean;
  created_at: string;
}

export interface KPIManualEntry {
  id: number;
  employee_id: number;
  metric_id: number;
  period_key: string;
  value: number;
  entered_by?: number;
  created_at: string;
}

export interface KPIMetricResult {
  metric_id: number;
  name: string;
  source: KPISource;
  target: number;
  direction: KPIDirection;
  weight: number;
  actual_value: number;
  score: number; // 0 to 120
  weighted_score: number;
  unit?: string;
}

export interface KPIResult {
  id?: number;
  employee_id: number;
  period_key: string;
  total: number;
  bonus_percent: number;
  bonus_amount?: number;
  breakdown: KPIMetricResult[];
  computed_at: string;
}

