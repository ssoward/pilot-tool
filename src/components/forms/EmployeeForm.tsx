import React, { useState, useEffect } from 'react';
import type { Employee, EmployeeCreateRequest, EmployeeRole } from '../../types/Employee';
import { EmployeeType, getEmployeeTypeLabel } from '../../types/Employee';

interface EmployeeFormProps {
  employee?: Employee | null; // For editing existing employee
  onSubmit: (employeeData: EmployeeCreateRequest | Employee) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const initialFormData: EmployeeCreateRequest = {
  hrEmpId: 0,
  firstName: '',
  lastName: '',
  grade: undefined,
  mgrHrEmpId: undefined,
  mgrName: '',
  role: '' as EmployeeRole,
  cisIdPresentFlag: false,
  pilotUserFlag: false,
  employeeType: EmployeeType.FTE,
  employeeTypeName: getEmployeeTypeLabel(EmployeeType.FTE),
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<EmployeeCreateRequest | Employee>(initialFormData);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData(initialFormData);
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | boolean | Date | null = value;

    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      processedValue = value ? parseFloat(value) : null;
    } else if (type === 'date' || name === 'attritionDate') {
      processedValue = value ? new Date(value) : null;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
      // Automatically update employeeTypeName when employeeType changes
      ...(name === 'employeeType' && {
        employeeTypeName: getEmployeeTypeLabel(parseInt(value, 10) as EmployeeType)
      })
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const employeeRoles: EmployeeRole[] = ['PGM', 'SD', 'GPGM', 'FSD', 'SSD', 'SSE', 'FE', 'EM', 'DIR', 'QA', 'UX', 'PM', 'PO'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {employee ? 'Edit Employee' : 'Create New Employee'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HR Employee ID */}
        <div>
          <label htmlFor="hrEmpId" className="block text-sm font-medium text-gray-700">HR Employee ID</label>
          <input
            type="number"
            name="hrEmpId"
            id="hrEmpId"
            value={formData.hrEmpId || ''}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
          <input
            type="number"
            name="grade"
            id="grade"
            value={formData.grade || ''}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Role</option>
            {employeeRoles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Employee Type */}
        <div>
          <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700">Employee Type</label>
          <select
            name="employeeType"
            id="employeeType"
            value={formData.employeeType}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Object.values(EmployeeType).filter(v => typeof v === 'number').map(typeVal => (
              <option key={typeVal} value={typeVal as number}>
                {getEmployeeTypeLabel(typeVal as EmployeeType)}
              </option>
            ))}
          </select>
        </div>

        {/* Manager Name */}
        <div>
          <label htmlFor="mgrName" className="block text-sm font-medium text-gray-700">Manager Name</label>
          <input
            type="text"
            name="mgrName"
            id="mgrName"
            value={formData.mgrName || ''}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Manager HR Employee ID */}
        <div>
          <label htmlFor="mgrHrEmpId" className="block text-sm font-medium text-gray-700">Manager HR Emp ID</label>
          <input
            type="number"
            name="mgrHrEmpId"
            id="mgrHrEmpId"
            value={formData.mgrHrEmpId || ''}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Attrition Date - only if attritionFlag is true */}
        {(formData as Employee).attritionFlag && (
          <div>
            <label htmlFor="attritionDate" className="block text-sm font-medium text-gray-700">Attrition Date</label>
            <input
              type="date"
              name="attritionDate"
              id="attritionDate"
              value={(formData as Employee).attritionDate ? new Date((formData as Employee).attritionDate!).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        )}
      </div>

      {/* Flags Section */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Flags</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[ 'cisIdPresentFlag', 'pilotUserFlag', 'attritionFlag', 'externalFlag', 'creatorFlag', 'approverFlag', 'leadFlag', 'canViewHrData'].map(flagName => (
            <div key={flagName} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={flagName}
                  name={flagName}
                  type="checkbox"
                  checked={(formData as any)[flagName] || false}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={flagName} className="font-medium text-gray-700 capitalize">
                  {flagName.replace(/([A-Z])/g, ' $1').replace('Flag', '').trim()}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : (employee ? 'Save Changes' : 'Create Employee')}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
