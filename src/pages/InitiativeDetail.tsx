import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { initiativeService } from '../services/api';
import type { Initiative } from '../types/Initiative';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  CalendarIcon, 
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import AIInitiativeAnalysis from '../components/AIInitiativeAnalysis';

const InitiativeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: initiative, isLoading, error } = useQuery<Initiative>({
    queryKey: ['initiative', id],
    queryFn: () => initiativeService.getInitiativeById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !initiative) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Initiative Not Found</h2>
            <p className="text-gray-600 mb-4">
              The initiative you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/initiatives"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Initiatives
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Proposal':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{initiative.summary || initiative.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(initiative.status)}`}>
                    {initiative.status}
                  </span>
                  {initiative.priority && (
                    <span className={`text-sm font-medium ${getPriorityColor(initiative.priority)}`}>
                      <FlagIcon className="h-4 w-4 inline mr-1" />
                      {initiative.priority} priority
                    </span>
                  )}
                  {initiative.jiraKey && (
                    <span className="text-sm text-gray-600">
                      Key: {initiative.jiraKey}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Link
              to={`/initiatives/${initiative.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Initiative
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="space-y-4">
                {initiative.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600">{initiative.description}</p>
                  </div>
                )}
                {initiative.businessValue && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Business Value</h3>
                    <p className="text-gray-600">{initiative.businessValue}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Hypothesis & Opportunity Score */}
            {(initiative.hypothesis || initiative.opportunityScore) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Strategy & Scoring</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {initiative.hypothesis && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Hypothesis</h3>
                      <div className="space-y-2">
                        {initiative.hypothesis.businessOutcome && (
                          <div>
                            <span className="text-xs font-medium text-gray-500">Business Outcome:</span>
                            <p className="text-sm text-gray-600">{initiative.hypothesis.businessOutcome}</p>
                          </div>
                        )}
                        {initiative.hypothesis.feature && (
                          <div>
                            <span className="text-xs font-medium text-gray-500">Feature:</span>
                            <p className="text-sm text-gray-600">{initiative.hypothesis.feature}</p>
                          </div>
                        )}
                        {initiative.hypothesis.goal && (
                          <div>
                            <span className="text-xs font-medium text-gray-500">Goal:</span>
                            <p className="text-sm text-gray-600">{initiative.hypothesis.goal}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {initiative.opportunityScore && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Opportunity Score</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Impact:</span>
                          <span className="text-sm text-gray-600">{initiative.opportunityScore.impact}/10</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Effort:</span>
                          <span className="text-sm text-gray-600">{initiative.opportunityScore.effort}/10</span>
                        </div>
                        {initiative.opportunityScore.calculated && (
                          <div className="flex items-center justify-between font-medium">
                            <span className="text-xs text-gray-700">Calculated:</span>
                            <span className="text-sm text-gray-900">{initiative.opportunityScore.calculated}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Analysis */}
            <AIInitiativeAnalysis initiative={initiative} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
              <div className="space-y-3">
                {initiative.productGroupName && (
                  <div className="flex items-center text-sm">
                    <UserGroupIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <span className="text-gray-500">Product Group:</span>
                      <span className="ml-2 text-gray-900">{initiative.productGroupName}</span>
                    </div>
                  </div>
                )}
                {initiative.teamName && (
                  <div className="flex items-center text-sm">
                    <UserGroupIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <span className="text-gray-500">Team:</span>
                      <span className="ml-2 text-gray-900">{initiative.teamName}</span>
                    </div>
                  </div>
                )}
                {initiative.owner && (
                  <div className="flex items-center text-sm">
                    <UserGroupIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <span className="text-gray-500">Owner:</span>
                      <span className="ml-2 text-gray-900">{initiative.owner}</span>
                    </div>
                  </div>
                )}
                {initiative.stage && (
                  <div className="flex items-center text-sm">
                    <ChartBarIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <span className="text-gray-500">Stage:</span>
                      <span className="ml-2 text-gray-900">{initiative.stage}</span>
                    </div>
                  </div>
                )}
                {initiative.startDate && (
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(initiative.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
                {initiative.endDate && (
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <span className="text-gray-500">End Date:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(initiative.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
                {initiative.createdAt && (
                  <div className="flex items-center text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(initiative.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Card */}
            {(initiative.percentComplete !== undefined || initiative.onTrackPercent !== undefined) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
                <div className="space-y-4">
                  {initiative.percentComplete !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Completion</span>
                        <span>{initiative.percentComplete}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${initiative.percentComplete}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {initiative.onTrackPercent !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>On Track</span>
                        <span>{initiative.onTrackPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${initiative.onTrackPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contributing Teams */}
            {initiative.contributingTeams && initiative.contributingTeams.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contributing Teams</h3>
                <div className="space-y-2">
                  {initiative.contributingTeams.map((team, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{team}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Working Group */}
            {initiative.workingGroup && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Working Group</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Label:</span>
                    <p className="text-sm text-gray-900">{initiative.workingGroup.label}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Value:</span>
                    <p className="text-sm text-gray-900">{initiative.workingGroup.value}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativeDetail;