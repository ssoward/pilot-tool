import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Team, TeamCreateRequest } from '../types/Team';

interface CreateTeamModalProps {
  team?: Team;
  onClose: () => void;
  onSubmit: (data: TeamCreateRequest) => void;
  isLoading: boolean;
  isEdit?: boolean;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  team,
  onClose,
  onSubmit,
  isLoading,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<TeamCreateRequest>({
    name: '',
    description: '',
    managerId: '',
    managerName: '',
    capacity: 100,
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (team && isEdit) {
      setFormData({
        name: team.name,
        description: team.description,
        managerId: team.managerId,
        managerName: team.managerName,
        capacity: team.capacity,
        skills: [...team.skills]
      });
    }
  }, [team, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.managerId.trim() && formData.managerName.trim()) {
      onSubmit(formData);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.currentTarget === e.target) {
      e.preventDefault();
      addSkill();
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter team name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the team's purpose and responsibilities"
            />
          </div>

          <div>
            <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-1">
              Manager ID *
            </label>
            <input
              type="text"
              id="managerId"
              value={formData.managerId}
              onChange={(e) => setFormData(prev => ({ ...prev, managerId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter manager user ID"
              required
            />
          </div>

          <div>
            <label htmlFor="managerName" className="block text-sm font-medium text-gray-700 mb-1">
              Manager Name *
            </label>
            <input
              type="text"
              id="managerName"
              value={formData.managerName}
              onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter manager name"
              required
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Team Capacity (Story Points/Sprint)
            </label>
            <input
              type="number"
              id="capacity"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Skills
            </label>
            
            {/* Skills List */}
            {formData.skills.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Skill Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a skill (e.g., React, Python, DevOps)"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or click + to add skills
            </p>
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
              disabled={isLoading || !formData.name.trim() || !formData.managerId.trim() || !formData.managerName.trim()}
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

export default CreateTeamModal;
