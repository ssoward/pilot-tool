import React, { useState, useMemo } from 'react';
import { Plus, Users, AlertTriangle } from 'lucide-react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  useTeams,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam
} from '../hooks/useQueries';
import { useNotifications } from '../contexts/NotificationContext';
import TeamCard from './TeamCard';
import CreateTeamModal from './CreateTeamModal';
import type { Team, TeamCreateRequest, TeamUpdateRequest } from '../types/Team';

const TeamManagementDashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [view, ] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orgUnitFilter, setOrgUnitFilter] = useState<string>('');

  const { addNotification } = useNotifications();
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeams();

  // Filter teams based on search criteria
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    return teams.filter(team => {
      const lowerSearchQuery = searchQuery.toLowerCase(); // Cache toLowerCase for search query

      const matchesSearch = searchQuery === '' ||
        (team.teamName && team.teamName.toLowerCase().includes(lowerSearchQuery)) || // Guard teamName before toLowerCase
        (team.teamDescription && team.teamDescription.toLowerCase().includes(lowerSearchQuery));
      
      const matchesOrgUnit = orgUnitFilter === '' || (team.orgUnitName && team.orgUnitName === orgUnitFilter); // Also guard orgUnitName for safety, though type says string
      
      return matchesSearch && matchesOrgUnit;
    });
  }, [teams, searchQuery, orgUnitFilter]);

  // Get unique org units for filter dropdown
  const uniqueOrgUnits = useMemo(() => {
    if (!teams) return [];
    return [...new Set(teams.map(team => team.orgUnitName))].filter(Boolean);
  }, [teams]);

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const handleCreateTeam = async (teamData: TeamCreateRequest) => {
    try {
      await createTeamMutation.mutateAsync(teamData);
      addNotification({
        type: 'success',
        title: 'Team Created',
        message: `Team "${teamData.teamName}" has been created successfully.`
      });
      setShowCreateModal(false);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error Creating Team',
        message: 'Failed to create team. Please try again.'
      });
    }
  };

  const handleUpdateTeam = async (teamId: number, updates: TeamUpdateRequest) => {
    try {
      await updateTeamMutation.mutateAsync({ teamId: String(teamId), teamData: updates });
      addNotification({
        type: 'success',
        title: 'Team Updated',
        message: 'Team has been updated successfully.'
      });
      setSelectedTeam(null);
      setShowCreateModal(false);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error Updating Team',
        message: 'Failed to update team. Please try again.'
      });
    }
  };

  const handleDeleteTeam = async (teamId: number, teamName: string) => {
    if (!confirm(`Are you sure you want to delete team "${teamName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTeamMutation.mutateAsync(String(teamId));
      addNotification({
        type: 'success',
        title: 'Team Deleted',
        message: `Team "${teamName}" has been deleted successfully.`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error Deleting Team',
        message: 'Failed to delete team. Please try again.'
      });
    }
  };

  if (teamsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (teamsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-800">Failed to load teams. Please try again.</span>
        </div>
      </div>
    );
  }

  const handleModalSubmit = (data: TeamCreateRequest | TeamUpdateRequest) => {
    if (selectedTeam && 'teamId' in selectedTeam && selectedTeam.teamId) {
      handleUpdateTeam(selectedTeam.teamId, data as TeamUpdateRequest);
    } else {
      handleCreateTeam(data as TeamCreateRequest);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Team Management</h1>
        <p className="text-lg text-gray-600 mt-1">Oversee, manage, and organize your engineering teams.</p>
      </header>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by team name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Org Unit Filter */}
          <div>
            <select
              value={orgUnitFilter}
              onChange={(e) => setOrgUnitFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Org Units</option>
              {uniqueOrgUnits.map(orgUnit => (
                <option key={orgUnit} value={orgUnit}>{orgUnit}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredTeams.length} of {teams?.length || 0} teams
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          {/* Placeholder for potential future actions or info */}
        </div>
        <button
          type="button"
          onClick={() => { setSelectedTeam(null); setShowCreateModal(true); }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Team
        </button>
      </div>

      {/* Removed dashboard summary cards */}

      <div className={`mt-6 ${view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        {filteredTeams && filteredTeams.map(team => (
          <TeamCard 
            key={team.teamId} 
            team={team} 
            onEdit={() => { setSelectedTeam(team); setShowCreateModal(true); }} 
            onDelete={() => handleDeleteTeam(team.teamId, team.teamName)} 
            view={view} 
          />
        ))}
      </div>
      {filteredTeams && filteredTeams.length === 0 && (
        <div className="text-center py-10">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchQuery || orgUnitFilter ? 'No teams match your current filters.' : 'No teams found.'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || orgUnitFilter ? 'Try adjusting your search or filter criteria.' : 'Get started by creating a new team.'}
          </p>
          {!searchQuery && !orgUnitFilter && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => { setSelectedTeam(null); setShowCreateModal(true); }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Team
              </button>
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTeam(null);
          }}
          onSubmit={handleModalSubmit}
          team={selectedTeam || undefined} // Changed to pass undefined if null
          isLoading={createTeamMutation.isPending || updateTeamMutation.isPending}
        />
      )}
    </div>
  );
};

export default TeamManagementDashboard;
