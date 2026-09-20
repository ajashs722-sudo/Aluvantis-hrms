import { openDB, IDBPDatabase } from 'idb';
import {
  Company,
  User,
  Employee,
  Shift,
  LeaveRequest,
  LeaveBalance,
  PayrollRecord,
  AttendanceRecord,
  HRDocument,
  AuditLog,
  IntegrationsConfig,
} from '../types';
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
  INITIAL_INTEGRATIONS,
} from './mockData';

const DB_NAME = 'aluvantis_hrms_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('company')) {
          db.createObjectStore('company', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('shifts')) {
          db.createObjectStore('shifts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('leaves')) {
          db.createObjectStore('leaves', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('leave_balances')) {
          db.createObjectStore('leave_balances', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('payroll')) {
          db.createObjectStore('payroll', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('attendance')) {
          db.createObjectStore('attendance', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('audit_logs')) {
          db.createObjectStore('audit_logs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('integrations')) {
          db.createObjectStore('integrations', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

// Local storage fallback state if idb fails
class LocalStoreFallback {
  private memoryData: Record<string, any> = {};

  get<T>(key: string, defaultVal: T): T {
    try {
      const stored = localStorage.getItem(`aluvantis_${key}`);
      if (stored) return JSON.parse(stored);
    } catch {
      if (this.memoryData[key]) return this.memoryData[key];
    }
    return defaultVal;
  }

  set<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`aluvantis_${key}`, JSON.stringify(val));
    } catch {
      this.memoryData[key] = val;
    }
  }
}

const fallback = new LocalStoreFallback();

export interface SyncQueueItem {
  id?: number;
  entity: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

export const offlineRepository = {
  async init(): Promise<void> {
    try {
      const db = await getDB();
      const empCount = await db.count('employees');
      if (empCount === 0) {
        // Seed initial data
        await db.put('company', INITIAL_COMPANY);
        for (const u of INITIAL_USERS) await db.put('users', u);
        for (const e of INITIAL_EMPLOYEES) await db.put('employees', e);
        for (const s of INITIAL_SHIFTS) await db.put('shifts', s);
        for (const a of INITIAL_ATTENDANCE) await db.put('attendance', a);
        for (const l of INITIAL_LEAVES) await db.put('leaves', l);
        for (const b of INITIAL_LEAVE_BALANCES) await db.put('leave_balances', b);
        for (const p of INITIAL_PAYROLL) await db.put('payroll', p);
        for (const d of INITIAL_DOCUMENTS) await db.put('documents', d);
        for (const log of INITIAL_AUDIT_LOGS) await db.put('audit_logs', log);
        await db.put('integrations', { id: 1, ...INITIAL_INTEGRATIONS });
      }
    } catch (err) {
      console.warn('IDB init error, using localStorage fallback', err);
      if (!fallback.get('employees', null)) {
        fallback.set('company', INITIAL_COMPANY);
        fallback.set('users', INITIAL_USERS);
        fallback.set('employees', INITIAL_EMPLOYEES);
        fallback.set('shifts', INITIAL_SHIFTS);
        fallback.set('attendance', INITIAL_ATTENDANCE);
        fallback.set('leaves', INITIAL_LEAVES);
        fallback.set('leave_balances', INITIAL_LEAVE_BALANCES);
        fallback.set('payroll', INITIAL_PAYROLL);
        fallback.set('documents', INITIAL_DOCUMENTS);
        fallback.set('audit_logs', INITIAL_AUDIT_LOGS);
        fallback.set('integrations', INITIAL_INTEGRATIONS);
      }
    }
  },

  async getCompany(): Promise<Company> {
    try {
      const db = await getDB();
      const comp = await db.get('company', 1);
      return comp || INITIAL_COMPANY;
    } catch {
      return fallback.get('company', INITIAL_COMPANY);
    }
  },

  async updateCompany(comp: Company): Promise<void> {
    try {
      const db = await getDB();
      await db.put('company', comp);
    } catch {
      fallback.set('company', comp);
    }
  },

  async getEmployees(): Promise<Employee[]> {
    try {
      const db = await getDB();
      const list = await db.getAll('employees');
      return list.length > 0 ? list : INITIAL_EMPLOYEES;
    } catch {
      return fallback.get('employees', INITIAL_EMPLOYEES);
    }
  },

  async saveEmployee(emp: Employee): Promise<void> {
    try {
      const db = await getDB();
      await db.put('employees', emp);
    } catch {
      const list = fallback.get('employees', INITIAL_EMPLOYEES);
      const idx = list.findIndex((e: Employee) => e.id === emp.id);
      if (idx >= 0) list[idx] = emp;
      else list.push(emp);
      fallback.set('employees', list);
    }
  },

  async getShifts(): Promise<Shift[]> {
    try {
      const db = await getDB();
      const list = await db.getAll('shifts');
      return list.length > 0 ? list : INITIAL_SHIFTS;
    } catch {
      return fallback.get('shifts', INITIAL_SHIFTS);
    }
  },

  async saveShift(shift: Shift): Promise<void> {
    try {
      const db = await getDB();
      await db.put('shifts', shift);
    } catch {
      const list = fallback.get('shifts', INITIAL_SHIFTS);
      const idx = list.findIndex((s: Shift) => s.id === shift.id);
      if (idx >= 0) list[idx] = shift;
      else list.push(shift);
      fallback.set('shifts', list);
    }
  },

  async getAttendance(): Promise<AttendanceRecord[]> {
    try {
      const db = await getDB();
      const list = await db.getAll('attendance');
      return list.length > 0 ? list : INITIAL_ATTENDANCE;
    } catch {
      return fallback.get('attendance', INITIAL_ATTENDANCE);
    }
  },

  async addAttendance(record: AttendanceRecord): Promise<void> {
    try {
      const db = await getDB();
      await db.put('attendance', record);
    } catch {
      const list = fallback.get('attendance', INITIAL_ATTENDANCE);
      list.unshift(record);
      fallback.set('attendance', list);
    }
  },

  async getLeaves(): Promise<LeaveRequest[]> {
    try {
      const db = await getDB();
      const list = await db.getAll('leaves');
      return list.length > 0 ? list : INITIAL_LEAVES;
    } catch {
      return fallback.get('leaves', INITIAL_LEAVES);
    }
  },

  async saveLeave(leave: LeaveRequest): Promise<void> {
    try {
      const db = await getDB();
      await db.put('leaves', leave);
    } catch {
      const list = fallback.get('leaves', INITIAL_LEAVES);
      const idx = list.findIndex((l: LeaveRequest) => l.id === leave.id);
      if (idx >= 0) list[idx] = leave;
      else list.unshift(leave);
      fallback.set('leaves', list);
    }
  },

  async getLeaveBalances(): Promise<LeaveBalance[]> {
    try {
      const db = await getDB();
      const list = await db.getAll('leave_balances');
      return list.length > 0 ? list : INITIAL_LEAVE_BALANCES;
    } catch {
      return fallback.get('leave_balances', INITIAL_LEAVE_BALANCES);
    }
  },

  async getPayroll(): Promise<PayrollRecord[]> {
    try {
      const db = await getDB();
      const list = await db.getAll('payroll');
      return list.length > 0 ? list : INITIAL_PAYROLL;
    } catch {
      return fallback.get('payroll', INITIAL_PAYROLL);
    }
  },

  async savePayroll(record: PayrollRecord): Promise<void> {
    try {
      const db = await getDB();
      await db.put('payroll', record);
    } catch {
      const list = fallback.get('payroll', INITIAL_PAYROLL);
      const idx = list.findIndex((p: PayrollRecord) => p.id === record.id);
      if (idx >= 0) list[idx] = record;
      else list.unshift(record);
      fallback.set('payroll', list);
    }
  },

  async getDocuments(): Promise<HRDocument[]> {
    try {
      const db = await getDB();
      const list = await db.getAll('documents');
      return list.length > 0 ? list : INITIAL_DOCUMENTS;
    } catch {
      return fallback.get('documents', INITIAL_DOCUMENTS);
    }
  },

  async saveDocument(doc: HRDocument): Promise<void> {
    try {
      const db = await getDB();
      await db.put('documents', doc);
    } catch {
      const list = fallback.get('documents', INITIAL_DOCUMENTS);
      const idx = list.findIndex((d: HRDocument) => d.id === doc.id);
      if (idx >= 0) list[idx] = doc;
      else list.unshift(doc);
      fallback.set('documents', list);
    }
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const db = await getDB();
      const list = await db.getAll('audit_logs');
      return list.length > 0 ? list : INITIAL_AUDIT_LOGS;
    } catch {
      return fallback.get('audit_logs', INITIAL_AUDIT_LOGS);
    }
  },

  async addAuditLog(log: AuditLog): Promise<void> {
    try {
      const db = await getDB();
      await db.put('audit_logs', log);
    } catch {
      const list = fallback.get('audit_logs', INITIAL_AUDIT_LOGS);
      list.unshift(log);
      fallback.set('audit_logs', list);
    }
  },

  async getIntegrations(): Promise<IntegrationsConfig> {
    try {
      const db = await getDB();
      const row = await db.get('integrations', 1);
      return row ? { ...INITIAL_INTEGRATIONS, ...row } : INITIAL_INTEGRATIONS;
    } catch {
      return fallback.get('integrations', INITIAL_INTEGRATIONS);
    }
  },

  async updateIntegrations(config: IntegrationsConfig): Promise<void> {
    try {
      const db = await getDB();
      await db.put('integrations', { id: 1, ...config });
    } catch {
      fallback.set('integrations', config);
    }
  },

  // Offline queue management
  async queueSyncItem(item: Omit<SyncQueueItem, 'timestamp'>): Promise<void> {
    const queueItem: SyncQueueItem = {
      ...item,
      timestamp: new Date().toISOString(),
    };
    try {
      const db = await getDB();
      await db.add('sync_queue', queueItem);
    } catch {
      const q = fallback.get<SyncQueueItem[]>('sync_queue', []);
      q.push(queueItem);
      fallback.set('sync_queue', q);
    }
  },

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const db = await getDB();
      return await db.getAll('sync_queue');
    } catch {
      return fallback.get<SyncQueueItem[]>('sync_queue', []);
    }
  },

  async clearSyncQueue(): Promise<void> {
    try {
      const db = await getDB();
      await db.clear('sync_queue');
    } catch {
      fallback.set('sync_queue', []);
    }
  },

  async getAll<T = any>(storeName: string): Promise<T[]> {
    try {
      const db = await getDB();
      return (await db.getAll(storeName as any)) as T[];
    } catch {
      return fallback.get<T[]>(storeName, []);
    }
  },

  async put(storeName: string, item: any): Promise<void> {
    try {
      const db = await getDB();
      await db.put(storeName as any, item);
    } catch {
      const list = fallback.get<any[]>(storeName, []);
      const idx = list.findIndex((i: any) => i.id === item.id);
      if (idx >= 0) list[idx] = item;
      else list.unshift(item);
      fallback.set(storeName, list);
    }
  },
};
