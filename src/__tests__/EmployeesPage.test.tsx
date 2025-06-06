import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeesPage from '../pages/EmployeesPage';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EmployeesPage', () => {
  const employees = [
    {
      id: '1',
      hrEmpId: '1001',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      role: 'Engineer',
      employeeType: 'Full-time',
      isActive: true,
    },
    {
      id: '2',
      hrEmpId: '1002',
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob.jones@example.com',
      role: 'Manager',
      employeeType: 'Part-time',
      isActive: false,
    },
  ];

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: employees });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders employee list', async () => {
    render(<EmployeesPage />);
    expect(screen.getByText(/Loading employees/i)).toBeInTheDocument();
    expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('opens the add employee form modal', async () => {
    render(<EmployeesPage />);
    fireEvent.click(await screen.findByText(/Add Employee/i));
    expect(await screen.findByText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('shows error if API fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    render(<EmployeesPage />);
    expect(await screen.findByText(/Failed to fetch employees/i)).toBeInTheDocument();
  });
});
