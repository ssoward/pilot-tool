import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamForm from '../components/forms/TeamForm';

describe('TeamForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  it('renders empty form for create', () => {
    render(<TeamForm onSubmit={mockOnSubmit} onClose={mockOnClose} isLoading={false} />);
    expect(screen.getByLabelText(/Team Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Jira Project ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Jira Board ID/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Team/i })).toBeInTheDocument();
  });

  it('renders with team data for edit', () => {
    render(
      <TeamForm
        team={{
          teamId: 1,
          teamName: 'Alpha',
          teamDescription: 'Alpha team',
          jiraProjectId: 123,
          jiraBoardId: 456,
          teamBacklogLabel: 'ALPHA-BACKLOG',
          teamNotificationSettings: null,
          empCount: 10,
          orgUnitId: 2,
          orgUnitName: 'OrgUnit',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any} // Add 'as any' to fix type error for missing required fields
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
        isEdit={true}
      />
    );
    expect(screen.getByDisplayValue('Alpha')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alpha team')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('456')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<TeamForm onSubmit={mockOnSubmit} onClose={mockOnClose} isLoading={false} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
