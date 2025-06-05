import React, { useState, useCallback } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import type { RoadmapItem, RoadmapMilestone } from '../types/Team';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';



const TimelineItem = ({
  item,
  pixelsPerDay,
  timelineStartDate
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const itemStartOffset = Math.floor((item.startDate.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const itemDuration = Math.floor((item.endDate.getTime() - item.startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const leftPosition = itemStartOffset * pixelsPerDay;
  const width = itemDuration * pixelsPerDay;

  const getStatusColor = (status) => {
    switch (status) {
      case 'not-started': return 'bg-gray-400';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'on-hold': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  return (
    <div
      className={`absolute h-8 rounded-md shadow-sm cursor-move transition-all duration-200 ${
        isDragging ? 'z-20 shadow-lg scale-105' : 'z-10'
      } ${getStatusColor(item.status)} ${getPriorityBorder(item.priority)}`}
      style={{
        left: `${leftPosition}px`,
        width: `${Math.max(width, 80)}px`,
      }}
      onMouseDown={(e) => {
        if (e.button === 0) {
          setIsDragging(true);
          // Add drag logic here
        }
      }}
      onMouseUp={() => setIsDragging(false)}
    >
      <div className="px-2 py-1 text-white text-xs font-medium truncate">
        {item.initiativeName}
      </div>
    </div>
  );
};

const RoadmapTimeline = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <RoadmapTimelineContent {...props} />
    </DndProvider>
  );
};

const RoadmapTimelineContent = ({
  items,
  milestones,
  onItemMove,
  onItemResize,
  timeRange,
  onTimeRangeChange
}) => {
  const [currentView, setCurrentView] = useState('quarter');

  const pixelsPerDay = currentView === 'month' ? 4 : currentView === 'quarter' ? 2 : 1;
  const totalDays = Math.ceil((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24));

  const [, drop] = useDrop({
    accept: 'timeline-item',
    drop: (draggedItem, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta && onItemMove) {
        const daysDelta = Math.round(delta.x / pixelsPerDay);
        const newStartDate = new Date(draggedItem.startDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
        const newEndDate = new Date(draggedItem.endDate.getTime() + daysDelta * 24 * 60 * 60 * 1000);
        onItemMove(draggedItem.id, newStartDate, newEndDate);
      }
    },
  });

  const timelineRef = React.useRef(null);
  
  React.useEffect(() => {
    if (timelineRef.current) {
      drop(timelineRef.current);
    }
  }, [drop]);

  const generateTimeHeaders = useCallback(() => {
    const headers = [];
    const current = new Date(timeRange.start);
    let dayCount = 0;

    while (current <= timeRange.end) {
      if (currentView === 'month') {
        // Daily headers for month view
        headers.push(
          <div
            key={dayCount}
            className="flex-shrink-0 text-xs text-gray-600 border-r border-gray-200 px-1"
            style={{ width: `${pixelsPerDay * 1}px` }}
          >
            {current.getDate()}
          </div>
        );
        current.setDate(current.getDate() + 1);
      } else if (currentView === 'quarter') {
        // Weekly headers for quarter view
        headers.push(
          <div
            key={dayCount}
            className="flex-shrink-0 text-xs text-gray-600 border-r border-gray-200 px-1"
            style={{ width: `${pixelsPerDay * 7}px` }}
          >
            {`${current.getMonth() + 1}/${current.getDate()}`}
          </div>
        );
        current.setDate(current.getDate() + 7);
      } else {
        // Monthly headers for year view
        headers.push(
          <div
            key={dayCount}
            className="flex-shrink-0 text-xs text-gray-600 border-r border-gray-200 px-1"
            style={{ width: `${pixelsPerDay * 30}px` }}
          >
            {current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          </div>
        );
        current.setMonth(current.getMonth() + 1);
      }
      dayCount++;
    }

    return headers;
  }, [timeRange, currentView, pixelsPerDay]);

  const navigateTime = (direction) => {
    if (!onTimeRangeChange) return;

    const rangeDuration = timeRange.end.getTime() - timeRange.start.getTime();
    const shift = direction === 'next' ? rangeDuration : -rangeDuration;

    const newStart = new Date(timeRange.start.getTime() + shift);
    const newEnd = new Date(timeRange.end.getTime() + shift);

    onTimeRangeChange(newStart, newEnd);
  };

  // Group items by team for better organization
  const itemsByTeam = items.reduce((acc, item) => {
    // Use first team ID as the grouping key, or 'Unassigned' if no teams
    const teamName = item.teamIds.length > 0 ? `Team ${item.teamIds[0]}` : 'Unassigned';
    if (!acc[teamName]) acc[teamName] = [];
    acc[teamName].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Timeline Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Roadmap Timeline</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateTime('prev')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">
              {timeRange.start.toLocaleDateString()} - {timeRange.end.toLocaleDateString()}
            </span>
            <button
              onClick={() => navigateTime('next')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <select
            value={currentView}
            onChange={(e) => setCurrentView(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="month">Month View</option>
            <option value="quarter">Quarter View</option>
            <option value="year">Year View</option>
          </select>
        </div>
      </div>

      {/* Timeline Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-48 flex-shrink-0 p-2 bg-gray-50 border-r border-gray-200">
            <span className="text-sm font-medium text-gray-700">Teams / Initiatives</span>
          </div>
          <div className="flex overflow-x-auto" style={{ width: 'calc(100% - 12rem)' }}>
            {generateTimeHeaders()}
          </div>
        </div>
      </div>

      {/* Timeline Body */}
      <div ref={timelineRef} className="relative">
        {Object.entries(itemsByTeam).map(([teamName, teamItems]) => (
          <div key={teamName} className="border-b border-gray-100 last:border-b-0">
            {/* Team Header */}
            <div className="flex items-center bg-gray-50">
              <div className="w-48 flex-shrink-0 p-3 border-r border-gray-200">
                <div className="font-medium text-gray-900">{teamName}</div>
                <div className="text-xs text-gray-500">{teamItems.length} initiatives</div>
              </div>
              <div className="relative flex-1" style={{ height: '48px' }}>
                {/* Timeline grid */}
                <div className="absolute inset-0 flex">
                  {Array.from({ length: totalDays }).map((_, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="border-r border-gray-100"
                      style={{ width: `${pixelsPerDay}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Team Items */}
            {teamItems.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="w-48 flex-shrink-0 p-2 border-r border-gray-200">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.initiativeName}</div>
                  <div className="text-xs text-gray-500">{item.status}</div>
                </div>
                <div className="relative flex-1" style={{ height: '48px' }}>
                  {/* Timeline grid */}
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: totalDays }).map((_, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="border-r border-gray-100"
                        style={{ width: `${pixelsPerDay}px` }}
                      />
                    ))}
                  </div>
                  
                  {/* Timeline Item */}
                  <TimelineItem
                    item={item}
                    onMove={onItemMove}
                    onResize={onItemResize}
                    pixelsPerDay={pixelsPerDay}
                    timelineStartDate={timeRange.start}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Milestones */}
        {milestones.map((milestone) => {
          const milestoneOffset = Math.floor((milestone.date.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24));
          const leftPosition = milestoneOffset * pixelsPerDay;

          return (
            <div
              key={milestone.id}
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none"
              style={{ left: `${leftPosition + 192}px` }}
            >
              <div className="absolute -top-6 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {milestone.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Not Started</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>On Hold</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapTimeline;
