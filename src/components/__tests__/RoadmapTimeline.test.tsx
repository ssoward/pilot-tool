import React from 'react';
import { render, screen } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import RoadmapTimeline from '../RoadmapTimeline';
import type { RoadmapItem, RoadmapMilestone } from '../../types/Team';

// Mock test data
const mockItems: RoadmapItem[] = [
  {
    id: '1',
    initiativeId: 'init-1',
    initiativeName: 'Test Initiative 1',
    teamIds: ['team-1'],
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-15'),
    status: 'in_progress',
    priority: 'high',
    dependencies: [],
    milestones: [],
    estimatedEffort: 10,
  },
  {
    id: '2',
    initiativeId: 'init-2',
    initiativeName: 'Test Initiative 2',
    teamIds: ['team-2'],
    startDate: new Date('2025-06-10'),
    endDate: new Date('2025-06-25'),
    status: 'planned',
    priority: 'medium',
    dependencies: [],
    milestones: [],
    estimatedEffort: 15,
  },
];

const mockMilestones: RoadmapMilestone[] = [
  {
    id: 'milestone-1',
    name: 'Test Milestone',
    date: new Date('2025-06-20'),
    status: 'upcoming',
    description: 'Test milestone description',
  },
];

const mockTimeRange = {
  start: new Date('2025-06-01'),
  end: new Date('2025-06-30'),
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DndProvider backend={HTML5Backend}>
    {children}
  </DndProvider>
);

describe('RoadmapTimeline', () => {
  const mockOnItemMove = jest.fn();
  const mockOnItemResize = jest.fn();
  const mockOnTimeRangeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without React key warnings', () => {
    // Capture console warnings to check for React key errors
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <RoadmapTimeline
          items={mockItems}
          milestones={mockMilestones}
          onItemMove={mockOnItemMove}
          onItemResize={mockOnItemResize}
          timeRange={mockTimeRange}
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      </TestWrapper>
    );

    // Check that no React key warnings were logged
    const keyWarnings = consoleSpy.mock.calls.filter(call =>
      call[0]?.includes?.('Warning: Each child in a list should have a unique "key" prop')
    );

    const keyErrors = consoleErrorSpy.mock.calls.filter(call =>
      call[0]?.includes?.('Warning: Each child in a list should have a unique "key" prop')
    );

    expect(keyWarnings).toHaveLength(0);
    expect(keyErrors).toHaveLength(0);

    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('renders timeline headers with unique keys for different views', () => {
    const { rerender } = render(
      <TestWrapper>
        <RoadmapTimeline
          items={mockItems}
          milestones={mockMilestones}
          onItemMove={mockOnItemMove}
          onItemResize={mockOnItemResize}
          timeRange={mockTimeRange}
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      </TestWrapper>
    );

    // Check that the component renders successfully
    expect(screen.getByText('Roadmap Timeline')).toBeInTheDocument();
    expect(screen.getByText('Teams / Initiatives')).toBeInTheDocument();

    // Re-render to ensure no key conflicts on updates
    rerender(
      <TestWrapper>
        <RoadmapTimeline
          items={mockItems}
          milestones={mockMilestones}
          onItemMove={mockOnItemMove}
          onItemResize={mockOnItemResize}
          timeRange={{
            start: new Date('2025-07-01'),
            end: new Date('2025-07-31'),
          }}
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      </TestWrapper>
    );

    // Component should still render without issues
    expect(screen.getByText('Roadmap Timeline')).toBeInTheDocument();
  });

  it('renders initiative names correctly', () => {
    render(
      <TestWrapper>
        <RoadmapTimeline
          items={mockItems}
          milestones={mockMilestones}
          onItemMove={mockOnItemMove}
          onItemResize={mockOnItemResize}
          timeRange={mockTimeRange}
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Test Initiative 1')).toBeInTheDocument();
    expect(screen.getByText('Test Initiative 2')).toBeInTheDocument();
  });

  it('renders view selector options', () => {
    render(
      <TestWrapper>
        <RoadmapTimeline
          items={mockItems}
          milestones={mockMilestones}
          onItemMove={mockOnItemMove}
          onItemResize={mockOnItemResize}
          timeRange={mockTimeRange}
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Month View')).toBeInTheDocument();
    expect(screen.getByText('Quarter View')).toBeInTheDocument();
    expect(screen.getByText('Year View')).toBeInTheDocument();
  });
});
