import React, { useState } from 'react';
import { Plus, Users, Settings, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  useTeams,
  useResourceAllocation,
  useResourceConflicts,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam
} from '../hooks/useQueries';
import { useNotifications } from '../contexts/NotificationContext';
import TeamCard from './TeamCard';
import CreateTeamModal from './CreateTeamModal';
import ResourceAllocationChart from './charts/ResourceAllocationChart';
import type { Team, TeamCreateRequest, TeamUpdateRequest } from '../types/Team';

const TeamManagementDashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { addNotification } = useNotifications();
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeams();
  const { data: resourceAllocation, isLoading: resourceLoading } = useResourceAllocation();
  const { data: conflicts } = useResourceConflicts();

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();

  const handleCreateTeam = async (teamData: TeamCreateRequest) => {
    try {
      await createTeamMutation.mutateAsync(teamData);
      addNotification({
        type: 'success',
        title: 'Team Created',
        message: `Team "${teamData.name}" has been created successfully.`
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

  const handleUpdateTeam = async (teamId: string, updates: TeamUpdateRequest) => {
    try {
      await updateTeamMutation.mutateAsync({ teamId, teamData: updates });
      addNotification({
        type: 'success',
        title: 'Team Updated',
        message: 'Team has been updated successfully.'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error Updating Team',
        message: 'Failed to update team. Please try again.'
      });
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`Are you sure you want to delete team "${teamName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTeamMutation.mutateAsync(teamId);
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

  const totalTeams = teams?.length || 0;
  const totalMembers = teams?.reduce((sum, team) => sum + team.memberCount, 0) || 0;
  const averageUtilization = resourceAllocation?.length 
    ? Math.round(resourceAllocation.reduce((sum, ra) => sum + ra.utilizationPercentage, 0) / resourceAllocation.length)
    : 0;
  const criticalConflicts = conflicts?.filter(c => c.severity === 'high').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage teams, members, and resource allocation</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{totalTeams}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{averageUtilization}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Issues</p>
              <p className="text-2xl font-bold text-gray-900">{criticalConflicts}</p>
            </div>
            <AlertTriangle className={`h-8 w-8 ${criticalConflicts > 0 ? 'text-red-600' : 'text-gray-400'}`} />
          </div>
        </div>
      </div>

      {/* Resource Allocation Chart */}
      {!resourceLoading && resourceAllocation && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Allocation Overview</h2>
          <ResourceAllocationChart data={resourceAllocation} />
        </div>
      )}

      {/* Resource Conflicts */}
      {conflicts && conflicts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Conflicts</h2>
          <div className="space-y-3">
            {conflicts.slice(0, 5).map((conflict) => (
              <div
                key={conflict.id}
                className={`p-4 rounded-lg border-l-4 ${
                  conflict.severity === 'high'
                    ? 'bg-red-50 border-red-400'
                    : conflict.severity === 'medium'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{conflict.description}</p>
                    <p className="text-sm text-gray-600 mt-1">{conflict.suggestedResolution}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">
                        Teams: {conflict.affectedTeams.join(', ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        Initiatives: {conflict.affectedInitiatives.length}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      conflict.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : conflict.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {conflict.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams Grid/List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Teams</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Users className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {teams && teams.length > 0 ? (
            <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  view={view}
                  onEdit={(team) => setSelectedTeam(team)}
                  onDelete={(teamId, teamName) => handleDeleteTeam(teamId, teamName)}
                  resourceAllocation={resourceAllocation?.find(ra => ra.teamId === team.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first team.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Team
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTeam}
          isLoading={createTeamMutation.isPending}
        />
      )}

      {selectedTeam && (
        <CreateTeamModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onSubmit={(data) => handleUpdateTeam(selectedTeam.id, data)}
          isLoading={updateTeamMutation.isPending}
          isEdit
        />
      )}
    </div>
  );
};

export default TeamManagementDashboard;
