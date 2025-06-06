import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import type { Employee } from '../types/Employee';
import EmployeeForm from '../components/forms/EmployeeForm';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees based on search criteria
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const employeeFullName = `${employee.firstName} ${employee.lastName}`;

      const matchesSearch = searchQuery === '' || 
        (employeeFullName && employeeFullName.toLowerCase().includes(lowerSearchQuery)) || // Guard fullName
        (employee.role && employee.role.toLowerCase().includes(lowerSearchQuery)) || // Guard role
        (employee.mgrName && employee.mgrName.toLowerCase().includes(lowerSearchQuery)); // mgrName is already optional, so check is implicitly there by `?.` before, but explicit check is safer.
      
      const matchesRole = roleFilter === '' || (employee.role && employee.role === roleFilter); // Guard role
      const matchesStatus = statusFilter === '' || 
        (statusFilter === 'pilot' && employee.pilotUserFlag) ||
        (statusFilter === 'non-pilot' && !employee.pilotUserFlag) ||
        (statusFilter === 'external' && employee.externalFlag) ||
        (statusFilter === 'internal' && !employee.externalFlag);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, searchQuery, roleFilter, statusFilter]);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    return [...new Set(employees.map(emp => emp.role))].filter(Boolean);
  }, [employees]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/employees`);
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchEmployees();
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  const openCreateForm = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const openEditForm = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = async (employeeId: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${apiBaseUrl}/employees/${employeeId}`);
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete employee.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-4">Loading employees...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <button
          onClick={openCreateForm}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, role, or manager..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pilot">Pilot Users</option>
              <option value="non-pilot">Non-Pilot Users</option>
              <option value="external">External</option>
              <option value="internal">Internal</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <EmployeeForm
                employee={selectedEmployee}
                onSubmit={handleFormSuccess}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedEmployee(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              {/* <th className="py-3 px-6 text-left">Email</th> */}
              <th className="py-3 px-6 text-center">Role</th>
              <th className="py-3 px-6 text-center">Type</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="font-medium">{employee.firstName} {employee.lastName}</span>
                  </div>
                </td>
                {/* <td className="py-3 px-6 text-left">
                  {employee.email}
                </td> */}
                <td className="py-3 px-6 text-center">
                  {employee.role}
                </td>
                <td className="py-3 px-6 text-center">
                  {employee.employeeType}
                </td>
                 <td className="py-3 px-6 text-center">
                  <span className={`py-1 px-3 rounded-full text-xs ${!employee.attritionFlag ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                    {!employee.attritionFlag ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button onClick={() => openEditForm(employee)} className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(employee.id)} className="w-6 transform hover:text-red-500 hover:scale-110">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {filteredEmployees.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-6">
          {searchQuery || roleFilter || statusFilter ? 'No employees match your current filters.' : 'No employees found. Click "Add Employee" to get started.'}
        </p>
      )}
    </div>
  );
};

export default EmployeesPage;
