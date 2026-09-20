import { Department, Employee, AuditLog, UserRole } from '../types';

export interface OrgNode {
  id: number;
  type: 'company' | 'department' | 'employee';
  name: string;
  position?: string;
  headName?: string;
  avatar_url?: string;
  color?: string;
  head_employee_id?: number | null;
  department_id?: number;
  manager_id?: number | null;
  base_salary?: number;
  isHead?: boolean;
  children?: OrgNode[];
}

export interface DepartmentStats {
  id: number;
  name: string;
  color: string;
  head_employee_id?: number | null;
  head_name?: string;
  head_avatar?: string;
  head_position?: string;
  headcount: number;
  total_payroll: number;
  open_positions_count: number;
}

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 1, company_id: 1, name: 'Boshqaruv', head_employee_id: 1, color: '#C6A15B', created_at: '2024-01-10T08:00:00Z' },
  { id: 2, company_id: 1, name: 'Ombor', head_employee_id: 2, color: '#3B82F6', created_at: '2024-01-15T09:00:00Z' },
  { id: 3, company_id: 1, name: 'Kassa', head_employee_id: 3, color: '#10B981', created_at: '2024-02-01T08:00:00Z' },
  { id: 4, company_id: 1, name: 'Zal', head_employee_id: 4, color: '#F59E0B', created_at: '2024-02-10T08:00:00Z' },
  { id: 5, company_id: 1, name: 'Oshxona', head_employee_id: 5, color: '#EF4444', created_at: '2024-02-15T08:00:00Z' },
];

// Helper: check if role can view salary details
export function canViewSalaries(role: UserRole): boolean {
  return role === 'admin' || role === 'hr' || role === 'manager';
}

// Helper: check if role can mutate org structure
export function canEditOrg(role: UserRole): boolean {
  return role === 'admin' || role === 'hr';
}

// Build hierarchical tree with 3 levels
export function buildOrgTree(
  companyName: string,
  departments: Department[],
  employees: Employee[],
  userRole: UserRole
): OrgNode {
  const showSalary = canViewSalaries(userRole);

  // Root company node
  const rootNode: OrgNode = {
    id: 9990,
    type: 'company',
    name: companyName,
    children: [],
  };

  departments.forEach((dept) => {
    const deptHead = employees.find((e) => e.id === dept.head_employee_id);
    const deptEmployees = employees.filter(
      (e) => e.department_id === dept.id || e.department === dept.name
    );

    const deptNode: OrgNode = {
      id: dept.id,
      type: 'department',
      name: dept.name,
      color: dept.color || '#C6A15B',
      head_employee_id: dept.head_employee_id,
      headName: deptHead?.full_name,
      children: [],
    };

    deptEmployees.forEach((emp) => {
      const isHead = dept.head_employee_id === emp.id;
      const empNode: OrgNode = {
        id: emp.id,
        type: 'employee',
        name: emp.full_name,
        position: emp.position,
        avatar_url: emp.avatar_url,
        department_id: dept.id,
        manager_id: emp.manager_id,
        color: dept.color,
        isHead,
        base_salary: showSalary ? emp.base_salary : undefined,
      };
      deptNode.children?.push(empNode);
    });

    rootNode.children?.push(deptNode);
  });

  return rootNode;
}

// Build department list stats
export function getDepartmentStatsList(
  departments: Department[],
  employees: Employee[],
  userRole: UserRole
): DepartmentStats[] {
  const showSalary = canViewSalaries(userRole);

  return departments.map((dept) => {
    const deptEmployees = employees.filter(
      (e) => e.department_id === dept.id || e.department === dept.name
    );
    const deptHead = employees.find((e) => e.id === dept.head_employee_id);

    const headcount = deptEmployees.length;
    const total_payroll = showSalary
      ? deptEmployees.reduce((sum, e) => sum + (e.base_salary || 0), 0)
      : 0;

    return {
      id: dept.id,
      name: dept.name,
      color: dept.color || '#C6A15B',
      head_employee_id: dept.head_employee_id,
      head_name: deptHead?.full_name || 'Tayinlanmagan',
      head_avatar: deptHead?.avatar_url,
      head_position: deptHead?.position || 'Bo‘lim boshlig‘i',
      headcount,
      total_payroll,
      open_positions_count: Math.max(0, 5 - headcount), // Demo vacancy count
    };
  });
}
