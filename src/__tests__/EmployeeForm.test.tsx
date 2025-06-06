import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeForm from '../components/forms/EmployeeForm';

const mockOnSuccess = jest.fn();
const mockOnCancel = jest.fn();

describe('EmployeeForm', () => {
  it('renders empty form for create', () => {
    render(<EmployeeForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/HR Employee ID/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('renders with employee data for edit', () => {
    render(
      <EmployeeForm
        employee={{
          id: '1',
          hrEmpId: '1001',
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice.smith@example.com',
          role: 'Engineer',
          employeeType: 'Full-time',
          isActive: true,
        } as any}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1001')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', () => {
    render(<EmployeeForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
