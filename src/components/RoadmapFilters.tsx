import React, { useState } from 'react';
import { FunnelIcon, XMarkIcon, CalendarIcon, UserGroupIcon, FlagIcon } from '@heroicons/react/24/outline';

export interface RoadmapFilters {
  teams: string[];
  statuses: string[];
  priorities: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery: string;
  showMilestones: boolean;
  showDependencies: boolean;
}

interface RoadmapFiltersProps {
  filters: RoadmapFilters;
  onFiltersChange: (filters: RoadmapFilters) => void;
  availableTeams: string[];
  availableStatuses: string[];
  availablePriorities: string[];
  className?: string;
}

const RoadmapFiltersComponent: React.FC<RoadmapFiltersProps> = ({
  filters,
  onFiltersChange,
  availableTeams,
  availableStatuses,
  availablePriorities,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (updates: Partial<RoadmapFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleArrayFilter = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    } else {
      return [...array, value];
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      teams: [],
      statuses: [],
      priorities: [],
      dateRange: { start: null, end: null },
      searchQuery: '',
      showMilestones: true,
      showDependencies: true,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.teams.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.priorities.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.searchQuery.trim()) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search initiatives, teams, or descriptions..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {filters.searchQuery && (
            <button
              onClick={() => updateFilters({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Date Range Filter */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => updateFilters({
                    dateRange: {
                      ...filters.dateRange,
                      start: e.target.value ? new Date(e.target.value) : null
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => updateFilters({
                    dateRange: {
                      ...filters.dateRange,
                      end: e.target.value ? new Date(e.target.value) : null
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Teams Filter */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Teams ({filters.teams.length}/{availableTeams.length})
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableTeams.map((team) => (
                <label key={team} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.teams.includes(team)}
                    onChange={() => updateFilters({
                      teams: toggleArrayFilter(filters.teams, team)
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{team}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <div className="h-4 w-4 mr-2 rounded-full bg-gray-400"></div>
              Status ({filters.statuses.length}/{availableStatuses.length})
            </label>
            <div className="space-y-2">
              {availableStatuses.map((status) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'not-started': return 'bg-gray-400';
                    case 'in-progress': return 'bg-blue-500';
                    case 'completed': return 'bg-green-500';
                    case 'on-hold': return 'bg-yellow-500';
                    case 'cancelled': return 'bg-red-500';
                    default: return 'bg-gray-400';
                  }
                };

                return (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.statuses.includes(status)}
                      onChange={() => updateFilters({
                        statuses: toggleArrayFilter(filters.statuses, status)
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className={`ml-2 h-3 w-3 rounded-full ${getStatusColor(status)}`}></div>
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {status.replace('-', ' ')}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FlagIcon className="h-4 w-4 mr-2" />
              Priority ({filters.priorities.length}/{availablePriorities.length})
            </label>
            <div className="space-y-2">
              {availablePriorities.map((priority) => {
                const getPriorityColor = (priority: string) => {
                  switch (priority) {
                    case 'high': return 'text-red-600';
                    case 'medium': return 'text-yellow-600';
                    case 'low': return 'text-green-600';
                    default: return 'text-gray-600';
                  }
                };

                return (
                  <label key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.priorities.includes(priority)}
                      onChange={() => updateFilters({
                        priorities: toggleArrayFilter(filters.priorities, priority)
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <FlagIcon className={`ml-2 h-4 w-4 ${getPriorityColor(priority)}`} />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{priority}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Display Options */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Display Options</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showMilestones}
                  onChange={(e) => updateFilters({ showMilestones: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show Milestones</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showDependencies}
                  onChange={(e) => updateFilters({ showDependencies: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show Dependencies</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {filters.teams.map((team) => (
              <span
                key={`team-${team}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                Team: {team}
                <button
                  onClick={() => updateFilters({
                    teams: filters.teams.filter(t => t !== team)
                  })}
                  className="ml-1 h-3 w-3 rounded-full hover:bg-blue-200"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.statuses.map((status) => (
              <span
                key={`status-${status}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                Status: {status.replace('-', ' ')}
                <button
                  onClick={() => updateFilters({
                    statuses: filters.statuses.filter(s => s !== status)
                  })}
                  className="ml-1 h-3 w-3 rounded-full hover:bg-green-200"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.priorities.map((priority) => (
              <span
                key={`priority-${priority}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                Priority: {priority}
                <button
                  onClick={() => updateFilters({
                    priorities: filters.priorities.filter(p => p !== priority)
                  })}
                  className="ml-1 h-3 w-3 rounded-full hover:bg-purple-200"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Date: {filters.dateRange.start?.toLocaleDateString() || '...'} - {filters.dateRange.end?.toLocaleDateString() || '...'}
                <button
                  onClick={() => updateFilters({
                    dateRange: { start: null, end: null }
                  })}
                  className="ml-1 h-3 w-3 rounded-full hover:bg-orange-200"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapFiltersComponent;
