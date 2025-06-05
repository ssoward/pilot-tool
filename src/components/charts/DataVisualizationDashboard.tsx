import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import InitiativeStatusChart from './InitiativeStatusChart';
import TimelineOverviewChart from './TimelineOverviewChart';
import AIMetricsTrendChart from './AIMetricsTrendChart';
import type { Initiative } from '../../types/Initiative';

interface DataVisualizationDashboardProps {
  initiatives: Initiative[];
  className?: string;
}

const DataVisualizationDashboard = ({ initiatives, className = '' }: DataVisualizationDashboardProps) => {
  const [activeTab, setActiveTab] = useState('status');

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
            Data Insights & Analytics
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>AI-Powered Analytics</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">Status Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline Trends</TabsTrigger>
            <TabsTrigger value="metrics">AI Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Initiative Status Distribution</h4>
                <span className="text-sm text-gray-500">{initiatives.length} total initiatives</span>
              </div>
              <InitiativeStatusChart initiatives={initiatives} />
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {initiatives.filter(i => i.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {initiatives.filter(i => i.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-gray-500">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {initiatives.filter(i => i.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-500">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {initiatives.filter(i => i.status === 'on_hold').length}
                  </div>
                  <div className="text-sm text-gray-500">On Hold</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">12-Month Timeline Overview</h4>
                <span className="text-sm text-gray-500">Active initiatives by month</span>
              </div>
              <TimelineOverviewChart initiatives={initiatives} />
              
              {/* Timeline Insights */}
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h5 className="font-medium text-blue-900">Timeline Insights</h5>
                    <p className="text-sm text-blue-700 mt-1">
                      Peak activity periods and capacity planning recommendations based on historical data and current pipeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">AI Performance Metrics Trend</h4>
                <span className="text-sm text-gray-500">Last 30 days</span>
              </div>
              <AIMetricsTrendChart />
              
              {/* Metrics Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-2xl font-bold text-green-600">78%</div>
                      <div className="text-sm text-green-700">Overall Health</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">85%</div>
                      <div className="text-sm text-blue-700">Success Rate</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">23%</div>
                      <div className="text-sm text-yellow-700">Risk Level</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataVisualizationDashboard;
