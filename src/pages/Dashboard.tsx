import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initiativeService } from '../services/api';
import type { Initiative, InitiativeStatus } from '../types/Initiative';
import { useAI } from '../contexts/AIContext';
import AIAssistant from '../components/AIAssistant';
import AIPerformanceIndicator from '../components/AIPerformanceIndicator';
import DataVisualizationDashboard from '../components/charts/DataVisualizationDashboard';
import { advancedAIAnalyticsService } from '../services/advancedAIAnalytics';
import type { AdvancedAIAnalytics } from '../services/advancedAIAnalytics';
import { useTeams, useResourceAllocation, useResourceConflicts, useCapacityProjection } from '../hooks/useQueries';
import TeamCard from '../components/TeamCard';
import ResourceAllocationChart from '../components/charts/ResourceAllocationChart';
import { UserGroupIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const statusColors: Record<InitiativeStatus, string> = {
  draft: 'bg-gray-200 text-gray-800',
  approved: 'bg-blue-200 text-blue-800',
  in_progress: 'bg-yellow-200 text-yellow-800',
  completed: 'bg-green-200 text-green-800',
  on_hold: 'bg-red-200 text-red-800',
  cancelled: 'bg-red-200 text-red-800'
};

const Dashboard = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [advancedAnalytics, setAdvancedAnalytics] = useState<AdvancedAIAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
  const { metrics, insights, generateAIMetrics, getContextualInsights } = useAI();
  
  // Team management queries
  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  const { data: resourceAllocation = [], isLoading: resourceLoading } = useResourceAllocation();
  const { data: resourceConflicts = [], isLoading: conflictsLoading } = useResourceConflicts();
  
  // Get capacity projection for the next 90 days
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 90);
  useCapacityProjection(startDate, endDate);
  
  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        setLoading(true);
        const data = await initiativeService.getAllInitiatives();
        setInitiatives(data);
        setError(null);
        
        // Generate AI metrics for the initiatives
        if (data.length > 0) {
          try {
            await generateAIMetrics(data);
            await getContextualInsights('dashboard', { initiatives: data });
            
            // Generate advanced analytics
            setAnalyticsLoading(true);
            const analytics = await advancedAIAnalyticsService.generateAdvancedAnalytics(data);
            setAdvancedAnalytics(analytics);
          } catch (aiError) {
            console.warn('AI metrics generation failed:', aiError);
          } finally {
            setAnalyticsLoading(false);
          }
        }
      } catch (err) {
        setError('Failed to fetch initiatives');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitiatives();
  }, [generateAIMetrics, getContextualInsights]);
  
  const statusCounts = initiatives.reduce((acc, initiative) => {
    acc[initiative.status] = (acc[initiative.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Executive Dashboard</h1>
        <div className="flex space-x-2">
          <Link 
            to="/roadmap" 
            className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 transition-colors text-center sm:text-left whitespace-nowrap"
          >
            View Roadmap
          </Link>
          <Link 
            to="/initiatives/new" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-center sm:text-left whitespace-nowrap"
          >
            New Initiative
          </Link>
        </div>
      </div>
      
      {/* AI-Powered Metrics - Mobile Responsive */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <AIPerformanceIndicator
            value={metrics.overallHealth}
            label="Overall Health"
            type="health"
            showTrend={true}
            previousValue={75}
          />
          
          <AIPerformanceIndicator
            value={metrics.riskScore}
            label="Risk Score"
            type="risk"
            showTrend={true}
            previousValue={35}
          />
          
          <AIPerformanceIndicator
            value={metrics.successProbability}
            label="Success Probability"
            type="success"
            showTrend={true}
            previousValue={70}
          />
          
          <AIPerformanceIndicator
            value={metrics.resourceUtilization}
            label="Resource Utilization"
            type="utilization"
            showTrend={true}
            previousValue={85}
          />
          
          <AIPerformanceIndicator
            value={metrics.timelineAdherence}
            label="Timeline Adherence"
            type="timeline"
            showTrend={true}
            previousValue={88}
          />
        </div>
      )}
      
      {/* Advanced AI Analytics Section */}
      {advancedAnalytics && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 sm:p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Advanced AI Analytics
            </h2>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              AI-Powered
            </span>
          </div>
          
          {/* Predictive Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {advancedAnalytics.predictiveInsights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    insight.impactLevel === 'critical' ? 'bg-red-100 text-red-700' :
                    insight.impactLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                    insight.impactLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {insight.impactLevel}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{insight.description}</p>
                <p className="text-xs font-medium text-indigo-600 mb-2">{insight.prediction}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{Math.round(insight.confidence * 100)}% confidence</span>
                  <span>{insight.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Performance Forecasting */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-medium text-gray-900 mb-2">Next Quarter</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium">{advancedAnalytics.performanceForecasting.nextQuarter.completionRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Resource Utilization</span>
                  <span className="font-medium">{advancedAnalytics.performanceForecasting.nextQuarter.resourceUtilization}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="font-medium">{advancedAnalytics.performanceForecasting.nextQuarter.riskLevel}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-medium text-gray-900 mb-2">6 Months</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Portfolio Health</span>
                  <span className="font-medium">{advancedAnalytics.performanceForecasting.nextSixMonths.portfolioHealth}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Strategic Alignment</span>
                  <span className="font-medium">{advancedAnalytics.performanceForecasting.nextSixMonths.strategicAlignment}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Innovation Index</span>
                  <span className="font-medium">{advancedAnalytics.performanceForecasting.nextSixMonths.innovationIndex}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-medium text-gray-900 mb-2">Year End</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overall Success</span>
                  <span className="font-medium">{advancedAnalytics.performanceForecasting.yearEnd.overallSuccess}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Strategic Goals</span>
                  <span className="font-medium">{advancedAnalytics.performanceForecasting.yearEnd.strategicGoalsAchievement}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Competitive Position</span>
                  <span className="font-medium">{advancedAnalytics.performanceForecasting.yearEnd.competitivePosition}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {analyticsLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Generating advanced AI analytics...</span>
          </div>
        </div>
      )}
      
      {/* AI Insights - Mobile Responsive */}
      {insights && insights.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">AI Insights & Recommendations</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {insights.slice(0, 6).map((insight: any) => (
                <div 
                  key={insight.id} 
                  className={`p-3 sm:p-4 rounded-lg border-l-4 ${
                    insight.priority === 'critical' ? 'border-red-500 bg-red-50' :
                    insight.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                    insight.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{insight.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-3">{insight.description}</p>
                      <div className="flex flex-wrap items-center mt-2 gap-1 sm:gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          insight.type === 'risk' ? 'bg-red-100 text-red-700' :
                          insight.type === 'opportunity' ? 'bg-green-100 text-green-700' :
                          insight.type === 'recommendation' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {insight.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 px-2 py-1 text-xs rounded-full ${
                      insight.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      insight.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {insight.priority}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {insights.length > 6 && (
              <div className="mt-4 text-center">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  View all {insights.length} insights
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Status Summary - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-lg shadow p-4 sm:p-5">
            <div className="flex justify-between items-center">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">Initiatives</p>
                <h3 className="font-semibold text-xl sm:text-2xl">{count}</h3>
              </div>
              <div className={`flex-shrink-0 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${statusColors[status as InitiativeStatus]}`}>
                <span className="hidden sm:inline">{status.replace('_', ' ')}</span>
                <span className="sm:hidden">{status.split('_')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Initiatives - Mobile Responsive Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Initiatives</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Loading initiatives...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : initiatives.length === 0 ? (
          <div className="p-6 text-center">No initiatives found</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {initiatives.slice(0, 5).map((initiative) => (
                    <tr key={initiative.id}>
                      <td className="px-6 py-4">
                        <Link to={`/initiatives/${initiative.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                          {initiative.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{initiative.owner}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[initiative.status]}`}>
                          {initiative.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">{initiative.priority}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <Link to={`/initiatives/${initiative.id}`} className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>
                        <Link to={`/initiatives/${initiative.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Card Layout */}
            <div className="sm:hidden">
              {initiatives.slice(0, 5).map((initiative) => (
                <div key={initiative.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/initiatives/${initiative.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                      {initiative.name}
                    </Link>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[initiative.status]}`}>
                      {initiative.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Owner:</span> {initiative.owner}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">
                      <span className="font-medium">Priority:</span> {initiative.priority}
                    </span>
                    <div className="flex space-x-3 text-sm">
                      <Link to={`/initiatives/${initiative.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View
                      </Link>
                      <Link to={`/initiatives/${initiative.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
          <Link to="/initiatives" className="text-sm text-indigo-600 hover:text-indigo-900">
            View all initiatives
          </Link>
        </div>
      </div>
      
      {/* Critical AI Alerts - Mobile Responsive */}
      {insights && insights.filter((i: any) => i.priority === 'critical').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Critical Issues Detected
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {insights.filter((i: any) => i.priority === 'critical').slice(0, 3).map((insight: any) => (
                    <li key={insight.id} className="break-words">{insight.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Team Management Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Team Management</h2>
          <div className="flex space-x-2">
            <Link 
              to="/teams" 
              className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
            >
              <UserGroupIcon className="h-4 w-4 mr-1" />
              View All Teams
            </Link>
          </div>
        </div>
        
        {teamsLoading ? (
          <div className="p-6 text-center">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="p-6 text-center">
            <UserGroupIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teams created</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new team.</p>
            <div className="mt-6">
              <Link
                to="/teams"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Team
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Resource Allocation Overview */}
            {!resourceLoading && resourceAllocation.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Resource Allocation</h3>
                <div className="h-64">
                  <ResourceAllocationChart data={resourceAllocation} />
                </div>
              </div>
            )}
            
            {/* Resource Conflicts */}
            {!conflictsLoading && resourceConflicts.length > 0 && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Resource Conflicts Detected ({resourceConflicts.length})
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {resourceConflicts.slice(0, 3).map((conflict) => (
                          <li key={conflict.id}>
                            {conflict.description}
                          </li>
                        ))}
                      </ul>
                      {resourceConflicts.length > 3 && (
                        <Link to="/assignments" className="text-sm font-medium text-red-800 hover:text-red-900">
                          View {resourceConflicts.length - 3} more conflicts
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.slice(0, 3).map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  view="grid"
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
              
              {teams.length > 3 && (
                <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6">
                  <Link
                    to="/teams"
                    className="text-sm text-gray-600 hover:text-indigo-600 flex flex-col items-center"
                  >
                    <span className="text-2xl mb-2">+{teams.length - 3}</span>
                    <span>View all teams</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Data Visualization Dashboard */}
      <DataVisualizationDashboard initiatives={initiatives} />
      
      {/* Charts and AI Assistant - Mobile Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* AI Assistant - Mobile Optimized */}
        <div className="bg-white rounded-lg shadow">
          <AIAssistant 
            currentInitiative={initiatives.length > 0 ? initiatives[0] : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
