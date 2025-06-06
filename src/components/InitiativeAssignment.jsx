import React, { useState, useMemo } from 'react';
// import type { Initiative } from '../types/Initiative';
// import type { Team, TeamAssignment } from '../types/Team';
import { 
  MagnifyingGlassIcon, 
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';



const InitiativeAssignment = ({
  initiatives,
  teams,
  assignments,
  onAssignTeam,
  onUnassignTeam,
  onUpdateAllocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [formData, setFormData] = useState({
    initiativeId: '',
    teamId: '',
    allocation: 50
  });

  // Filter initiatives based on search query
  const filteredInitiatives = useMemo(() => {
    if (!searchQuery.trim()) return initiatives;
    
    const query = searchQuery.toLowerCase();
    return initiatives.filter(initiative =>
      initiative.name.toLowerCase().includes(query) ||
      initiative.description?.toLowerCase().includes(query) ||
      initiative.jiraKey?.toLowerCase().includes(query)
    );
  }, [initiatives, searchQuery]);

  // Get assignments for a specific initiative
  const getInitiativeAssignments = (initiativeId) => {
    return assignments.filter(assignment => assignment.initiativeId === initiativeId);
  };

  // Get team by ID
  const getTeam = (teamId) => {
    return teams.find(team => team.id === teamId);
  };

  // Calculate team capacity utilization
  const getTeamUtilization = (teamId) => {
    const teamAssignments = assignments.filter(assignment => assignment.teamId === teamId);
    const totalAllocation = teamAssignments.reduce((sum, assignment) => sum + assignment.allocatedCapacity, 0);
    return Math.min(totalAllocation, 100);
  };

  // Get available teams for assignment (not at 100% capacity)
  const getAvailableTeams = () => {
    return teams.filter(team => getTeamUtilization(team.id) < 100);
  };

  // Check if team is already assigned to initiative
  const isTeamAssigned = (initiativeId, teamId) => {
    return assignments.some(assignment => 
      assignment.initiativeId === initiativeId && assignment.teamId === teamId
    );
  };

  const handleAssignTeam = (e) => {
    e.preventDefault();
    onAssignTeam(formData.initiativeId, formData.teamId, formData.allocation);
    setFormData({ initiativeId: '', teamId: '', allocation: 50 });
    setIsAssigning(false);
  };

  const startAssignment = (initiativeId) => {
    setFormData(prev => ({ ...prev, initiativeId }));
    setIsAssigning(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 100) return 'text-red-600 bg-red-50';
    if (utilization >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Initiative Team Assignments</h2>
            <p className="text-sm text-gray-600">
              Assign teams to initiatives and manage resource allocation
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{initiatives.length}</span> initiatives, 
              <span className="font-medium"> {teams.length}</span> teams
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search initiatives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Team Utilization Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Team Capacity Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => {
            const utilization = getTeamUtilization(team.id);
            const teamAssignments = assignments.filter(a => a.teamId === team.id);
            
            return (
              <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{team.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUtilizationColor(utilization)}`}>
                    {utilization}%
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Capacity</span>
                    <span>{utilization}/100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        utilization >= 100 ? 'bg-red-500' :
                        utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {teamAssignments.length} active assignments
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assignment Form Modal */}
      {isAssigning && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAssigning(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAssignTeam}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Assign Team to Initiative
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Initiative Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Initiative</label>
                          <select
                            required
                            value={formData.initiativeId}
                            onChange={(e) => setFormData(prev => ({ ...prev, initiativeId: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Select an initiative</option>
                            {initiatives.map(initiative => (
                              <option key={initiative.id} value={initiative.id}>
                                {initiative.name} ({initiative.jiraKey})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Team Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Team</label>
                          <select
                            required
                            value={formData.teamId}
                            onChange={(e) => setFormData(prev => ({ ...prev, teamId: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Select a team</option>
                            {getAvailableTeams()
                              .filter(team => !isTeamAssigned(formData.initiativeId, team.id))
                              .map(team => (
                                <option key={team.id} value={team.id}>
                                  {team.name} ({100 - getTeamUtilization(team.id)}% available)
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Allocation */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Allocation ({formData.allocation}%)
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={formData.allocation}
                            onChange={(e) => setFormData(prev => ({ ...prev, allocation: parseInt(e.target.value) }))}
                            className="mt-1 block w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>10%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Assign Team
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAssigning(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Initiatives List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Initiative Assignments</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredInitiatives.map(initiative => {
            const initiativeAssignments = getInitiativeAssignments(initiative.id);
            const totalAllocation = initiativeAssignments.reduce((sum, assignment) => sum + assignment.allocatedCapacity, 0);
            
            return (
              <div key={initiative.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Initiative Header */}
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{initiative.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(initiative.statu)}`}>
                        {initiative.status}
                      </span>
                      <span className={`text-sm ${getPriorityColor(initiative.priority)}`}>
                        {initiative.priority} priority
                      </span>
                    </div>

                    {/* Initiative Details */}
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Key: {initiative.jiraKey}</p>
                      {initiative.description && (
                        <p className="mt-1">{initiative.description}</p>
                      )}
                    </div>

                    {/* Team Assignments */}
                    {initiativeAssignments.length > 0 ? (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700">Assigned Teams:</h5>
                        {initiativeAssignments
                          .filter(assignment => getTeam(assignment.teamId) !== null)
                          .map(assignment => {
                            const team = getTeam(assignment.teamId);

                            return (
                              <div key={assignment.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-3">
                                <UserGroupIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                  <span className="font-medium text-gray-900">{team.name}</span>
                                  <div className="text-xs text-gray-500">
                                    {assignment.allocatedCapacity}% allocation
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {/* Allocation Slider */}
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    step="10"
                                    value={assignment.allocatedCapacity}
                                    onChange={(e) => onUpdateAllocation(assignment.id, parseInt(e.target.value))}
                                    className="w-20"
                                  />
                                  <span className="text-sm text-gray-600 w-10">{assignment.allocatedCapacity}%</span>
                                </div>
                                
                                <button
                                  onClick={() => onUnassignTeam(assignment.id)}
                                  className="p-1 text-red-400 hover:text-red-600"
                                  title="Remove assignment"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Total Allocation */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Resource Allocation:</span>
                          <span className={`font-medium ${
                            totalAllocation > 100 ? 'text-red-600' :
                            totalAllocation === 100 ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {totalAllocation}%
                            {totalAllocation > 100 && (
                              <ExclamationTriangleIcon className="inline h-4 w-4 ml-1" />
                            )}
                            {totalAllocation === 100 && (
                              <CheckCircleIcon className="inline h-4 w-4 ml-1" />
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        No teams assigned to this initiative
                      </div>
                    )}
                  </div>

                  {/* Assign Button */}
                  <button
                    onClick={() => startAssignment(initiative.id)}
                    className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Assign Team
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInitiatives.length === 0 && (
          <div className="p-6 text-center">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No initiatives found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or check if initiatives exist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitiativeAssignment;
