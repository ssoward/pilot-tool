/**
 * Employee type definition based on the JSON structure from employees.json
 */
export interface Employee {
  id: number;
  hrEmpId: number;
  parentPath: string;
  firstName: string;
  lastName: string;
  grade: number;
  mgrHrEmpId: number;
  mgrName: string;
  role: string;
  cisIdPresentFlag: boolean;
  pilotUserFlag: boolean;
  attritionFlag: boolean;
  externalFlag: boolean;
  creatorFlag: boolean;
  approverFlag: boolean;
  leadFlag: boolean;
  attritionDate: string | null;
  notificationSettings: string | null;
  endDate: number;
  employeeType: number;
  employeeTypeName: string | null;
  canViewHrData: boolean;
}

/**
 * Employee Creation DTO for creating new employees
 */
export interface EmployeeCreateRequest {
  hrEmpId: number;
  firstName: string;
  lastName: string;
  grade?: number;
  mgrHrEmpId?: number;
  mgrName?: string;
  role?: string;
  cisIdPresentFlag?: boolean;
  pilotUserFlag?: boolean;
  employeeType?: number;
  employeeTypeName?: string;
}

/**
 * Employee Role types based on the data in employees.json
 */
export type EmployeeRole = 'PGM' | 'SD' | 'GPGM' | 'FSD' | 'SSD' | 'SSE' | 'FE' | 'EM' | 'DIR' | 'QA' | 'UX' | 'PM' | 'PO';

/**
 * Employee Type enum based on employeeType field
 */
export enum EmployeeType {
  CONTRACT = 0,
  FTE = 1,
  INTERN = 2,
  EXTERNAL = 3
}

/**
 * Helper functions for employee data
 */
export const getFullName = (employee: Employee): string => {
  return `${employee.firstName} ${employee.lastName}`;
};

export const getEmployeeTypeLabel = (employeeType: number): string => {
  switch (employeeType) {
    case EmployeeType.FTE: return 'Full-time';
    case EmployeeType.CONTRACT: return 'Contractor';
    case EmployeeType.INTERN: return 'Intern';
    case EmployeeType.EXTERNAL: return 'External';
    default: return 'Unknown';
  }
};
