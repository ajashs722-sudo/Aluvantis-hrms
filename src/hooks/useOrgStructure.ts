import { useState, useEffect, useCallback } from 'react';
import { Department, Employee, AuditLog, UserRole } from '../types';
import {
  INITIAL_DEPARTMENTS,
  buildOrgTree,
  getDepartmentStatsList,
  OrgNode,
  DepartmentStats,
} from '../lib/orgService';
import { INITIAL_EMPLOYEES } from '../lib/mockData';

export function useOrgStructure(companyName: string, userRole: UserRole) {
  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('aluvantis_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('aluvantis_employees');
    if (saved) {
      return JSON.parse(saved);
    }
    // Map initial employees to default departments
    return INITIAL_EMPLOYEES.map((e) => {
      let deptId = 1;
      let mgrId: number | null = 1;
      if (e.id === 1) { deptId = 1; mgrId = null; }
      else if (e.id === 2) { deptId = 2; mgrId = 1; }
      else if (e.id === 3) { deptId = 3; mgrId = 1; }
      else if (e.id === 4) { deptId = 4; mgrId = 1; }
      else if (e.id === 5) { deptId = 5; mgrId = 3; }
      else if (e.id === 6) { deptId = 4; mgrId = 4; }
      else if (e.id === 7) { deptId = 2; mgrId = 2; }
      else { deptId = 3; mgrId = 3; }
      return { ...e, department_id: e.department_id || deptId, manager_id: e.manager_id ?? mgrId };
    });
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    localStorage.setItem('aluvantis_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('aluvantis_employees', JSON.stringify(employees));
  }, [employees]);

  // Log action
  const addAuditEntry = useCallback((action: string, details: string, entityId?: number) => {
    const newLog: AuditLog = {
      id: Date.now(),
      company_id: 1,
      action,
      entity_type: 'department',
      entity_id: entityId,
      details,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, []);

  // Add department
  const addDepartment = useCallback(
    (name: string, color: string = '#C6A15B', head_employee_id?: number | null) => {
      const newDept: Department = {
        id: Date.now(),
        company_id: 1,
        name,
        color,
        head_employee_id: head_employee_id || null,
        created_at: new Date().toISOString(),
      };
      setDepartments((prev) => [...prev, newDept]);
      addAuditEntry("Bo'lim yaratildi", `Yangi bo'lim qo'shildi: ${name}`, newDept.id);
      return newDept;
    },
    [addAuditEntry]
  );

  // Delete department
  const deleteDepartment = useCallback(
    (id: number) => {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      addAuditEntry("Bo'lim o'chirildi", `Bo'lim o'chirildi (ID: ${id})`, id);
    },
    [addAuditEntry]
  );

  // Update department
  const updateDepartment = useCallback(
    (id: number, name: string, color: string, head_employee_id?: number | null) => {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, name, color, head_employee_id: head_employee_id ?? d.head_employee_id } : d
        )
      );
      addAuditEntry("Bo'lim yangilandi", `Bo'lim tahrirlandi: ${name}`, id);
    },
    [addAuditEntry]
  );

  // Bulk update departments (e.g. reordering)
  const setAllDepartments = useCallback(
    (newDepts: Department[]) => {
      setDepartments(newDepts);
      addAuditEntry("Tuzilma yangilandi", "Bo'limlar ro'yxati yangilandi");
    },
    [addAuditEntry]
  );

  // Move employee to department / change manager
  const moveEmployee = useCallback(
    (employeeId: number, targetDepartmentId: number, targetManagerId?: number | null) => {
      const targetDept = departments.find((d) => d.id === targetDepartmentId);
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === employeeId
            ? {
                ...e,
                department_id: targetDepartmentId,
                department: targetDept ? targetDept.name : e.department,
                manager_id: targetManagerId !== undefined ? targetManagerId : e.manager_id,
              }
            : e
        )
      );
      const emp = employees.find((e) => e.id === employeeId);
      addAuditEntry(
        "Xodim ko'chirildi",
        `${emp?.full_name || 'Xodim'} ${targetDept?.name || ''} bo'limiga ko'chirildi`,
        employeeId
      );
    },
    [departments, employees, addAuditEntry]
  );

  // Set department head
  const setDepartmentHead = useCallback(
    (departmentId: number, headEmployeeId: number) => {
      setDepartments((prev) =>
        prev.map((d) => (d.id === departmentId ? { ...d, head_employee_id: headEmployeeId } : d))
      );
      // Also update employee's department if different
      moveEmployee(headEmployeeId, departmentId);
      const emp = employees.find((e) => e.id === headEmployeeId);
      const dept = departments.find((d) => d.id === departmentId);
      addAuditEntry(
        "Boshliq yangilandi",
        `${emp?.full_name || 'Xodim'} ${dept?.name || ''} bo'limi boshlig'i etib tayinlandi`,
        departmentId
      );
    },
    [departments, employees, moveEmployee, addAuditEntry]
  );

  const tree = buildOrgTree(companyName, departments, employees, userRole);
  const departmentStats = getDepartmentStatsList(departments, employees, userRole);

  return {
    departments,
    employees,
    tree,
    departmentStats,
    auditLogs,
    addDepartment,
    deleteDepartment,
    updateDepartment,
    setAllDepartments,
    moveEmployee,
    setDepartmentHead,
  };
}
