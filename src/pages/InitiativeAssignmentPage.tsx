import React, { useEffect } from 'react';
import InitiativeAssignment from '../components/InitiativeAssignment';
import { useInitiatives, useTeams, useTeamAssignments } from '../hooks/useQueries';
import { calculateScrollbarWidth } from '../utils/scrollbarUtils';

const InitiativeAssignmentPage: React.FC = () => {
  // Recalculate scrollbar width when the assignments page mounts
  useEffect(() => {
    calculateScrollbarWidth();
  }, []);
  
  const { data: initiatives = [], isLoading: initiativesLoading } = useInitiatives();
  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { 
    data: assignments = [], 
    isLoading: assignmentsLoading,
    assignTeamMutation,
    unassignTeamMutation,
    updateAllocationMutation
  } = useTeamAssignments();

  const handleAssignTeam = async (initiativeId: string, teamId: string, allocation: number) => {
    try {
      await assignTeamMutation.mutateAsync({
        initiativeId,
        teamId,
        allocation,
        startDate: new Date()
      });
    } catch (error) {
      console.error('Failed to assign team:', error);
    }
  };

  const handleUnassignTeam = async (assignmentId: string) => {
    try {
      await unassignTeamMutation.mutateAsync(assignmentId);
    } catch (error) {
      console.error('Failed to unassign team:', error);
    }
  };

  const handleUpdateAllocation = async (assignmentId: string, allocation: number) => {
    try {
      await updateAllocationMutation.mutateAsync({
        assignmentId,
        allocation
      });
    } catch (error) {
      console.error('Failed to update allocation:', error);
    }
  };

  if (initiativesLoading || teamsLoading || assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading assignments...</span>
      </div>
    );
  }

  return (
    <InitiativeAssignment
      initiatives={initiatives}
      teams={teams}
      assignments={assignments}
      onAssignTeam={handleAssignTeam}
      onUnassignTeam={handleUnassignTeam}
      onUpdateAllocation={handleUpdateAllocation}
    />
  );
};

export default InitiativeAssignmentPage;
