import React from 'react';
import { Users, Edit, Trash2, TrendingUp, AlertCircle } from 'lucide-react';
// import type { Team } from '../types/Team';



const TeamCard = ({
  team,
  view,
  onEdit,
  onDelete,
  resourceAllocation
}) => {
  const utilizationPercentage = resourceAllocation?.utilizationPercentage || 0;
  const isOverallocated = utilizationPercentage > 100;
  const isNearCapacity = utilizationPercentage > 85;

  if (view === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{team.teamName}</h3>
              <p className="text-sm text-gray-600">{team.teamDescription}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{team.empCount}</p>
              <p className="text-xs text-gray-600">Members</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{resourceAllocation?.totalCapacity || team.empCount * 40}</p>
              <p className="text-xs text-gray-600">Capacity</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center space-x-1">
                <p className={`text-sm font-medium ${
                  isOverallocated ? 'text-red-600' : 
                  isNearCapacity ? 'text-amber-600' : 
                  'text-green-600'
                }`}>
                  {utilizationPercentage.toFixed(0)}%
                  {isOverallocated && <AlertCircle className="inline h-3 w-3 ml-1" />}
                </p>
                
                {isOverallocated && 
                  <TrendingUp className="h-3 w-3 text-red-600" />
                }
              </div>
              <p className="text-xs text-gray-600">Used</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(team)}
                className="p-2 text-blue-700 hover:bg-blue-50 rounded-full"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </button>
              <button
                onClick={() => onDelete(team.teamId, team.teamName)}
                className="p-2 text-red-700 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(team)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit team"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(team.teamId, team.teamName)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete team"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-1">{team.teamName}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{team.teamDescription}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Org Unit</span>
          <span className="text-sm font-medium text-gray-900">{team.orgUnitName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Members</span>
          <span className="text-sm font-medium text-gray-900">{team.empCount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">JIRA Board</span>
          <span className="text-sm font-medium text-gray-900">#{team.jiraBoardId}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Utilization</span>
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-medium ${
              isOverallocated ? 'text-red-600' : 
              isNearCapacity ? 'text-amber-600' : 'text-green-600'
            }`}>
              {utilizationPercentage.toFixed(0)}%
            </span>
            {isOverallocated && <AlertCircle className="h-4 w-4 text-red-500" />}
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isOverallocated ? 'bg-red-500' : 
                isNearCapacity ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Backlog Label */}
      {team.teamBacklogLabel && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Backlog Label</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              {team.teamBacklogLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
