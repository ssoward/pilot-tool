import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Team, TeamCreateRequest } from '../../types/Team';

interface TeamFormProps {
  team?: Team;
  onClose: () => void;
  onSubmit: (data: TeamCreateRequest) => void;
  isLoading: boolean;
  isEdit?: boolean;
}

const TeamForm: React.FC<TeamFormProps> = ({
  team,
  onClose,
  onSubmit,
  isLoading,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<TeamCreateRequest>({
    teamName: '',
    teamDescription: '',
    jiraProjectId: 0,
    jiraBoardId: 0,
    teamBacklogLabel: '',
    teamNotificationSettings: '',
    empCount: 0,
    orgUnitId: 0,
    orgUnitName: ''
  });

  useEffect(() => {
    if (team && isEdit) {
      setFormData({
        teamName: team.teamName,
        teamDescription: team.teamDescription || '',
        jiraProjectId: team.jiraProjectId,
        jiraBoardId: team.jiraBoardId,
        teamBacklogLabel: team.teamBacklogLabel || '',
        teamNotificationSettings: team.teamNotificationSettings || '',
        empCount: team.empCount,
        orgUnitId: team.orgUnitId,
        orgUnitName: team.orgUnitName
      });
    }
  }, [team, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.teamName.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Team' : 'Create New Team'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              id="teamName"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter team name"
              required
            />
          </div>
          <div>
            <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="teamDescription"
              name="teamDescription"
              value={formData.teamDescription || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the team's purpose and responsibilities"
            />
          </div>
          <div>
            <label htmlFor="jiraProjectId" className="block text-sm font-medium text-gray-700 mb-1">
              Jira Project ID
            </label>
            <input
              type="number"
              id="jiraProjectId"
              name="jiraProjectId"
              value={formData.jiraProjectId}
              onChange={handleNumberChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="jiraBoardId" className="block text-sm font-medium text-gray-700 mb-1">
              Jira Board ID
            </label>
            <input
              type="number"
              id="jiraBoardId"
              name="jiraBoardId"
              value={formData.jiraBoardId}
              onChange={handleNumberChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="teamBacklogLabel" className="block text-sm font-medium text-gray-700 mb-1">
              Team Backlog Label
            </label>
            <input
              type="text"
              id="teamBacklogLabel"
              name="teamBacklogLabel"
              value={formData.teamBacklogLabel || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. APAC-Backlog"
            />
          </div>
          <div>
            <label htmlFor="teamNotificationSettings" className="block text-sm font-medium text-gray-700 mb-1">
              Team Notification Settings
            </label>
            <input
              type="text"
              id="teamNotificationSettings"
              name="teamNotificationSettings"
              value={formData.teamNotificationSettings || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notification settings (optional)"
            />
          </div>
          <div>
            <label htmlFor="empCount" className="block text-sm font-medium text-gray-700 mb-1">
              Employee Count
            </label>
            <input
              type="number"
              id="empCount"
              name="empCount"
              value={formData.empCount}
              onChange={handleNumberChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="orgUnitId" className="block text-sm font-medium text-gray-700 mb-1">
              Org Unit ID
            </label>
            <input
              type="number"
              id="orgUnitId"
              name="orgUnitId"
              value={formData.orgUnitId}
              onChange={handleNumberChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="orgUnitName" className="block text-sm font-medium text-gray-700 mb-1">
              Org Unit Name
            </label>
            <input
              type="text"
              id="orgUnitName"
              name="orgUnitName"
              value={formData.orgUnitName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Asia Pacific"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.teamName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                <span>{isEdit ? 'Update Team' : 'Create Team'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
