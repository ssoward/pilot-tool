import React, { useState } from 'react';
import { Calendar, Filter, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useRoadmapItems, useTimelineAnalysis, useUpdateItemTimeline } from '../hooks/useQueries';
import { useNotifications } from '../contexts/NotificationContext';
import RoadmapTimeline from './RoadmapTimeline';
import RoadmapFilters from './RoadmapFilters';
import type { RoadmapFilters as RoadmapFiltersType } from '../services/roadmapService';

const RoadmapVisualization: React.FC = () => {
  const [filters, setFilters] = useState<RoadmapFiltersType>({
    teams: [],
    statuses: [],
    priorities: [],
    dateRange: { start: null, end: null },
    searchQuery: '',
    showMilestones: true,
    showDependencies: true
  });
  const [timeframe, setTimeframe] = useState<'quarter' | 'year'>('quarter');
  const [showFilters, setShowFilters] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { addNotification } = useNotifications();
  const { data: roadmapItems, isLoading, error } = useRoadmapItems(filters);
  const { data: timelineAnalysis } = useTimelineAnalysis(filters);
  const updateTimelineMutation = useUpdateItemTimeline();

  const handleItemMove = async (itemId: string, newStartDate: Date, newEndDate: Date) => {
    try {
      const result = await updateTimelineMutation.mutateAsync({
        itemId,
        startDate: newStartDate,
        endDate: newEndDate,
        validateResources: true
      });

      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Timeline Updated',
          message: 'Initiative timeline has been updated successfully.'
        });
      } else if (result.conflicts) {
        addNotification({
          type: 'warning',
          title: 'Timeline Updated with Conflicts',
          message: `Updated successfully, but ${result.conflicts.length} resource conflicts detected.`,
          action: {
            label: 'View Conflicts',
            onClick: () => console.log('Show conflicts:', result.conflicts)
          }
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update timeline. Please try again.'
      });
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  const resetZoom = () => setZoomLevel(1);

  const exportRoadmap = async (format: 'pdf' | 'csv') => {
    try {
      // Implementation would call roadmapService.exportRoadmap
      addNotification({
        type: 'success',
        title: 'Export Started',
        message: `Roadmap export to ${format.toUpperCase()} has been initiated.`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export roadmap. Please try again.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-800">Failed to load roadmap. Please try again.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roadmap Visualization</h1>
          <p className="text-gray-600">Interactive timeline view of initiatives and resource allocation</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimeframe('quarter')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                timeframe === 'quarter' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                timeframe === 'year' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {timelineAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Initiatives</p>
                <p className="text-2xl font-bold text-gray-900">{timelineAnalysis.totalInitiatives}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{timelineAnalysis.inProgressInitiatives}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{timelineAnalysis.completedInitiatives}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(timelineAnalysis.overallProgress)}%</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-6">
          <RoadmapFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableTeams={[]}
            availableStatuses={['planned', 'in_progress', 'completed', 'on_hold']}
            availablePriorities={['high', 'medium', 'low']}
          />
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Zoom:</span>
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[50px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={resetZoom}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportRoadmap('pdf')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors flex items-center space-x-1"
            >
              <Download className="h-3 w-3" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportRoadmap('csv')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors flex items-center space-x-1"
            >
              <Download className="h-3 w-3" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <RoadmapTimeline
          items={roadmapItems || []}
          milestones={[]}
          timeRange={{
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            end: new Date(new Date().getFullYear() + 1, new Date().getMonth(), 1)
          }}
          onItemMove={handleItemMove}
        />
      </div>

      {/* Critical Path & Risky Items */}
      {timelineAnalysis && (timelineAnalysis.criticalPath.length > 0 || timelineAnalysis.riskyItems.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Path */}
          {timelineAnalysis.criticalPath.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Path</h3>
              <div className="space-y-3">
                {timelineAnalysis.criticalPath.map((item) => (
                  <div key={item.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{item.initiativeName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Critical
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risky Items */}
          {timelineAnalysis.riskyItems.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">High Risk Items</h3>
              <div className="space-y-3">
                {timelineAnalysis.riskyItems.map((riskyItem) => (
                  <div key={riskyItem.item.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{riskyItem.item.initiativeName}</p>
                        <p className="text-sm text-gray-600">
                          Risk Factors: {riskyItem.riskFactors.join(', ')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        riskyItem.impact === 'high' ? 'bg-red-100 text-red-800' :
                        riskyItem.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {riskyItem.impact} impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadmapVisualization;
