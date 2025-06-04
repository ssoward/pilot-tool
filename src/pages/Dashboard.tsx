import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initiativeService } from '../services/api';
import type { Initiative, InitiativeStatus } from '../types/Initiative';
import { useAI } from '../contexts/AIContext';
import AIAssistant from '../components/AIAssistant';
import AIPerformanceIndicator from '../components/AIPerformanceIndicator';

const statusColors: Record<InitiativeStatus, string> = {
  draft: 'bg-gray-200 text-gray-800',
  approved: 'bg-blue-200 text-blue-800',
  in_progress: 'bg-yellow-200 text-yellow-800',
  completed: 'bg-green-200 text-green-800',
  on_hold: 'bg-red-200 text-red-800'
};

const Dashboard = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { metrics, insights, generateAIMetrics, getContextualInsights } = useAI();
  
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
          } catch (aiError) {
            console.warn('AI metrics generation failed:', aiError);
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
        <Link 
          to="/initiatives/new" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          New Initiative
        </Link>
      </div>
      
      {/* AI-Powered Metrics and Insights */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <AIPerformanceIndicator
            value={metrics.overallHealth}
            label="Overall Health"
            type="health"
            showTrend={true}
            previousValue={75} // This would come from previous metrics in a real app
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
      
      {/* AI Insights and Recommendations */}
      {insights && insights.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">AI Insights & Recommendations</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.slice(0, 6).map((insight: any) => (
                <div 
                  key={insight.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.priority === 'critical' ? 'border-red-500 bg-red-50' :
                    insight.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                    insight.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <div className="flex items-center mt-2 space-x-2">
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
                    <div className={`ml-2 px-2 py-1 text-xs rounded-full ${
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
      
      {/* Status summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Initiatives</p>
                <h3 className="font-semibold text-2xl">{count}</h3>
              </div>
              <div className={`px-3 py-1 rounded-full ${statusColors[status as InitiativeStatus]}`}>
                {status.replace('_', ' ')}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent initiatives */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Initiatives</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">Loading initiatives...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : initiatives.length === 0 ? (
            <div className="p-6 text-center">No initiatives found</div>
          ) : (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/initiatives/${initiative.id}`} className="text-indigo-600 hover:text-indigo-900">
                        {initiative.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{initiative.owner}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[initiative.status]}`}>
                        {initiative.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{initiative.priority}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/initiatives/${initiative.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
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
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <Link to="/initiatives" className="text-sm text-indigo-600 hover:text-indigo-900">
            View all initiatives
          </Link>
        </div>
      </div>
      
      {/* Critical AI Alerts */}
      {insights && insights.filter((i: any) => i.priority === 'critical').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Critical Issues Detected
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {insights.filter((i: any) => i.priority === 'critical').slice(0, 3).map((insight: any) => (
                    <li key={insight.id}>{insight.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced charts with AI insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Initiatives by Status</h3>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Status chart will be displayed here</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Timeline Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Timeline chart will be displayed here</p>
          </div>
        </div>
        
        {/* AI Assistant for Dashboard */}
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
