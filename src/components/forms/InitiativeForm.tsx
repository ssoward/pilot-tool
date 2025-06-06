import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Initiative, WorkingGroup, OpportunityScore, Hypothesis, InitiativeType, InitiativeStatus } from '../../types/Initiative';

interface InitiativeFormProps {
  initiative?: Initiative;
  onClose: () => void;
  onSubmit: (data: InitiativeFormData) => void;
  isLoading: boolean;
  isEdit?: boolean;
}

export interface InitiativeFormData {
  // Core initiative fields
  id?: string;
  productGroupName: string;
  productGroupId: string;
  summary: string;
  teamName: string;
  teamId: string;
  type: InitiativeType;
  stage: string;
  status: InitiativeStatus;
  score: number;
  workingGroup?: WorkingGroup | null;
  opportunityScore: OpportunityScore;
  hypothesis: Hypothesis;
  businessValue: string;
  jiraProjectKey?: string;
  jiraProjectId?: string;
  mondayBoardId?: string;
  contributingTeams: string[];
  percentComplete: number;
  onTrackPercent: number;
}

const INITIATIVE_TYPES: InitiativeType[] = ['adaptive', 'initiative'];
const INITIATIVE_STATUSES: InitiativeStatus[] = ['Draft', 'Proposal', 'Active', 'Completed', 'On Hold', 'Cancelled'];
const INITIATIVE_STAGES = ['Investigate', 'Plan', 'Execute', 'Monitor', 'Complete'];

const InitiativeForm: React.FC<InitiativeFormProps> = ({
  initiative,
  onClose,
  onSubmit,
  isLoading,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<InitiativeFormData>({
    productGroupName: '',
    productGroupId: '',
    summary: '',
    teamName: '',
    teamId: '',
    type: 'initiative',
    stage: 'Investigate',
    status: 'Draft',
    score: 0,
    workingGroup: null,
    opportunityScore: {
      impact: 0,
      effort: 0,
      calculated: null
    },
    hypothesis: {
      businessOutcome: '',
      feature: '',
      goal: '',
      peopleSegment: ''
    },
    businessValue: '',
    jiraProjectKey: '',
    jiraProjectId: '',
    mondayBoardId: '',
    contributingTeams: [],
    percentComplete: 0,
    onTrackPercent: 0
  });

  const [newContributingTeam, setNewContributingTeam] = useState('');
  const [workingGroupLabel, setWorkingGroupLabel] = useState('');
  const [workingGroupValue, setWorkingGroupValue] = useState('');

  useEffect(() => {
    if (initiative && isEdit) {
      setFormData({
        id: initiative.id,
        productGroupName: initiative.productGroupName,
        productGroupId: initiative.productGroupId,
        summary: initiative.summary,
        teamName: initiative.teamName,
        teamId: initiative.teamId,
        type: initiative.type,
        stage: initiative.stage,
        status: initiative.status,
        score: initiative.score,
        workingGroup: initiative.workingGroup,
        opportunityScore: initiative.opportunityScore,
        hypothesis: initiative.hypothesis,
        businessValue: initiative.businessValue,
        jiraProjectKey: initiative.jiraProjectKey || '',
        jiraProjectId: initiative.jiraProjectId || '',
        mondayBoardId: initiative.mondayBoardId || '',
        contributingTeams: [...initiative.contributingTeams],
        percentComplete: initiative.percentComplete,
        onTrackPercent: initiative.onTrackPercent
      });

      if (initiative.workingGroup) {
        setWorkingGroupLabel(initiative.workingGroup.label);
        setWorkingGroupValue(initiative.workingGroup.value);
      }
    }
  }, [initiative, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('opportunityScore.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        opportunityScore: {
          ...prev.opportunityScore,
          [field]: field === 'calculated' ? (value === '' ? null : Number(value)) : Number(value)
        }
      }));
    } else if (name.startsWith('hypothesis.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        hypothesis: {
          ...prev.hypothesis,
          [field]: value
        }
      }));
    } else {
      const numericFields = ['score', 'percentComplete', 'onTrackPercent'];
      setFormData(prev => ({
        ...prev,
        [name]: numericFields.includes(name) ? Number(value) : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build working group if both label and value are provided
    const workingGroup = workingGroupLabel.trim() && workingGroupValue.trim() 
      ? {
          label: workingGroupLabel.trim(),
          value: workingGroupValue.trim(),
          __typename: 'WorkingGroup'
        }
      : null;

    const dataToSubmit = {
      ...formData,
      workingGroup,
      opportunityScore: {
        ...formData.opportunityScore,
        __typename: 'OpportunityScore'
      },
      hypothesis: {
        ...formData.hypothesis,
        __typename: 'Hypothesis'
      }
    };

    onSubmit(dataToSubmit);
  };

  const addContributingTeam = () => {
    if (newContributingTeam.trim() && !formData.contributingTeams.includes(newContributingTeam.trim())) {
      setFormData(prev => ({
        ...prev,
        contributingTeams: [...prev.contributingTeams, newContributingTeam.trim()]
      }));
      setNewContributingTeam('');
    }
  };

  const removeContributingTeam = (teamToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      contributingTeams: prev.contributingTeams.filter(team => team !== teamToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Initiative' : 'Create New Initiative'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                Summary *
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Brief description of the initiative"
                required
              />
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {INITIATIVE_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {INITIATIVE_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Group and Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productGroupName" className="block text-sm font-medium text-gray-700 mb-1">
                Product Group Name *
              </label>
              <input
                type="text"
                id="productGroupName"
                name="productGroupName"
                value={formData.productGroupName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Discovery"
                required
              />
            </div>

            <div>
              <label htmlFor="productGroupId" className="block text-sm font-medium text-gray-700 mb-1">
                Product Group ID *
              </label>
              <input
                type="text"
                id="productGroupId"
                name="productGroupId"
                value={formData.productGroupId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 1"
                required
              />
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Home Team"
                required
              />
            </div>

            <div>
              <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-1">
                Team ID *
              </label>
              <input
                type="text"
                id="teamId"
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 2"
                required
              />
            </div>
          </div>

          {/* Stage and Scoring */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                Stage *
              </label>
              <select
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                {INITIATIVE_STAGES.map(stage => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                Score
              </label>
              <input
                type="number"
                id="score"
                name="score"
                value={formData.score}
                onChange={handleChange}
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="percentComplete" className="block text-sm font-medium text-gray-700 mb-1">
                Percent Complete
              </label>
              <input
                type="number"
                id="percentComplete"
                name="percentComplete"
                value={formData.percentComplete}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Working Group */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Working Group</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="workingGroupLabel" className="block text-sm font-medium text-gray-700 mb-1">
                  Working Group Label
                </label>
                <input
                  type="text"
                  id="workingGroupLabel"
                  value={workingGroupLabel}
                  onChange={(e) => setWorkingGroupLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Engagement"
                />
              </div>

              <div>
                <label htmlFor="workingGroupValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Working Group Value
                </label>
                <input
                  type="text"
                  id="workingGroupValue"
                  value={workingGroupValue}
                  onChange={(e) => setWorkingGroupValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 4"
                />
              </div>
            </div>
          </div>

          {/* Opportunity Score */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Opportunity Score</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="opportunityScore.impact" className="block text-sm font-medium text-gray-700 mb-1">
                  Impact
                </label>
                <input
                  type="number"
                  id="opportunityScore.impact"
                  name="opportunityScore.impact"
                  value={formData.opportunityScore.impact}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="opportunityScore.effort" className="block text-sm font-medium text-gray-700 mb-1">
                  Effort
                </label>
                <input
                  type="number"
                  id="opportunityScore.effort"
                  name="opportunityScore.effort"
                  value={formData.opportunityScore.effort}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="opportunityScore.calculated" className="block text-sm font-medium text-gray-700 mb-1">
                  Calculated Score
                </label>
                <input
                  type="number"
                  id="opportunityScore.calculated"
                  name="opportunityScore.calculated"
                  value={formData.opportunityScore.calculated || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Auto-calculated"
                />
              </div>
            </div>
          </div>

          {/* Hypothesis */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Hypothesis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hypothesis.businessOutcome" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Outcome
                </label>
                <textarea
                  id="hypothesis.businessOutcome"
                  name="hypothesis.businessOutcome"
                  value={formData.hypothesis.businessOutcome}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Expected business outcome"
                />
              </div>

              <div>
                <label htmlFor="hypothesis.feature" className="block text-sm font-medium text-gray-700 mb-1">
                  Feature
                </label>
                <textarea
                  id="hypothesis.feature"
                  name="hypothesis.feature"
                  value={formData.hypothesis.feature}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Feature description"
                />
              </div>

              <div>
                <label htmlFor="hypothesis.goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Goal
                </label>
                <textarea
                  id="hypothesis.goal"
                  name="hypothesis.goal"
                  value={formData.hypothesis.goal}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Initiative goal"
                />
              </div>

              <div>
                <label htmlFor="hypothesis.peopleSegment" className="block text-sm font-medium text-gray-700 mb-1">
                  People Segment
                </label>
                <textarea
                  id="hypothesis.peopleSegment"
                  name="hypothesis.peopleSegment"
                  value={formData.hypothesis.peopleSegment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Target people segment"
                />
              </div>
            </div>
          </div>

          {/* Business Value */}
          <div>
            <label htmlFor="businessValue" className="block text-sm font-medium text-gray-700 mb-1">
              Business Value *
            </label>
            <textarea
              id="businessValue"
              name="businessValue"
              value={formData.businessValue}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe the business value this initiative will provide"
              required
            />
          </div>

          {/* Integration Keys */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="jiraProjectKey" className="block text-sm font-medium text-gray-700 mb-1">
                Jira Project Key
              </label>
              <input
                type="text"
                id="jiraProjectKey"
                name="jiraProjectKey"
                value={formData.jiraProjectKey}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., PROJ-123"
              />
            </div>

            <div>
              <label htmlFor="jiraProjectId" className="block text-sm font-medium text-gray-700 mb-1">
                Jira Project ID
              </label>
              <input
                type="text"
                id="jiraProjectId"
                name="jiraProjectId"
                value={formData.jiraProjectId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 12345"
              />
            </div>

            <div>
              <label htmlFor="mondayBoardId" className="block text-sm font-medium text-gray-700 mb-1">
                Monday Board ID
              </label>
              <input
                type="text"
                id="mondayBoardId"
                name="mondayBoardId"
                value={formData.mondayBoardId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 67890"
              />
            </div>
          </div>

          {/* Contributing Teams */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contributing Teams
            </label>
            
            {/* Teams List */}
            {formData.contributingTeams.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {formData.contributingTeams.map((team) => (
                  <span
                    key={team}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                  >
                    {team}
                    <button
                      type="button"
                      onClick={() => removeContributingTeam(team)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Team Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newContributingTeam}
                onChange={(e) => setNewContributingTeam(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addContributingTeam)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add a contributing team"
              />
              <button
                type="button"
                onClick={addContributingTeam}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or click + to add contributing teams
            </p>
          </div>

          {/* Progress Tracking */}
          <div>
            <label htmlFor="onTrackPercent" className="block text-sm font-medium text-gray-700 mb-1">
              On Track Percentage
            </label>
            <input
              type="number"
              id="onTrackPercent"
              name="onTrackPercent"
              value={formData.onTrackPercent}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                <span>{isEdit ? 'Update Initiative' : 'Create Initiative'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitiativeForm;
