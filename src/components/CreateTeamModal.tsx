import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Team, TeamCreateRequest, TeamUpdateRequest } from '../types/Team';

interface CreateTeamModalProps {
  isOpen: boolean;
  team?: Team | null;
  onClose: () => void;
  onSubmit: (data: TeamCreateRequest | TeamUpdateRequest) => void;
  isLoading: boolean;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  team,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const isEdit = !!(team && team.teamId);
  const [formData, setFormData] = useState<TeamCreateRequest | TeamUpdateRequest>(() => {
    if (isEdit && team) {
      return {
        teamId: team.teamId,
        teamName: team.teamName,
        teamDescription: team.teamDescription,
        jiraProjectId: team.jiraProjectId,
        jiraBoardId: team.jiraBoardId,
        teamBacklogLabel: team.teamBacklogLabel,
        teamNotificationSettings: team.teamNotificationSettings,
        orgUnitId: team.orgUnitId,
      };
    }
    return {
      teamName: '',
      teamDescription: '',
      jiraProjectId: undefined, // Initialize optional fields
      jiraBoardId: undefined,
      teamBacklogLabel: undefined,
      teamNotificationSettings: undefined,
      orgUnitId: undefined,
    };
  });

  useEffect(() => {
    if (isOpen) { // Reset form when modal opens or team/isEdit changes
      if (isEdit && team) {
        setFormData({
          teamId: team.teamId,
          teamName: team.teamName,
          teamDescription: team.teamDescription,
          jiraProjectId: team.jiraProjectId,
          jiraBoardId: team.jiraBoardId,
          teamBacklogLabel: team.teamBacklogLabel,
          teamNotificationSettings: team.teamNotificationSettings,
          orgUnitId: team.orgUnitId,
        });
      } else {
        setFormData({
          teamName: '',
          teamDescription: '',
          jiraProjectId: undefined,
          jiraBoardId: undefined,
          teamBacklogLabel: undefined,
          teamNotificationSettings: undefined,
          orgUnitId: undefined,
        });
      }
    }
  }, [team, isEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.teamName && formData.teamName.trim()) { // Check if teamName exists and is not empty
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = (name === 'jiraProjectId' || name === 'jiraBoardId' || name === 'orgUnitId') && value !== '' ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, [name]: numValue === '' ? undefined : numValue }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {isEdit ? 'Edit Team' : 'Create New Team'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  id="teamName"
                  required
                  value={formData.teamName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="teamDescription"
                  id="teamDescription"
                  rows={3}
                  value={formData.teamDescription || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="orgUnitId" className="block text-sm font-medium text-gray-700 mb-1">
                  Org Unit ID
                </label>
                <input
                  type="number"
                  name="orgUnitId"
                  id="orgUnitId"
                  value={formData.orgUnitId || ''} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="jiraProjectId" className="block text-sm font-medium text-gray-700 mb-1">
                  Jira Project ID
                </label>
                <input
                  type="number"
                  name="jiraProjectId"
                  id="jiraProjectId"
                  value={formData.jiraProjectId || ''} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
               <div>
                <label htmlFor="jiraBoardId" className="block text-sm font-medium text-gray-700 mb-1">
                  Jira Board ID
                </label>
                <input
                  type="number"
                  name="jiraBoardId"
                  id="jiraBoardId"
                  value={formData.jiraBoardId || ''} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="teamBacklogLabel" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Backlog Label
                </label>
                <input
                  type="text"
                  name="teamBacklogLabel"
                  id="teamBacklogLabel"
                  value={formData.teamBacklogLabel || ''} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
               <div>
                <label htmlFor="teamNotificationSettings" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Notification Settings
                </label>
                <input
                  type="text"
                  name="teamNotificationSettings"
                  id="teamNotificationSettings"
                  value={formData.teamNotificationSettings || ''} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Team')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
