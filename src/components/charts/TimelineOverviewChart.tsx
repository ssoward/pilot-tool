import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths } from 'date-fns';
import type { Initiative } from '../../types/Initiative';

interface TimelineOverviewChartProps {
  initiatives: Initiative[];
  className?: string;
}

const PRIORITY_COLORS = {
  low: '#10B981',
  medium: '#F59E0B', 
  high: '#EF4444',
  critical: '#DC2626'
};

const TimelineOverviewChart = ({ initiatives, className = '' }: TimelineOverviewChartProps) => {
  // Generate last 12 months
  const endDate = new Date();
  const startDate = subMonths(endDate, 11);
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthInitiatives = initiatives.filter(initiative => {
      if (!initiative.startDate) return false;
      const startDate = new Date(initiative.startDate);
      const endDate = initiative.endDate ? new Date(initiative.endDate) : new Date();
      
      return (startDate <= monthEnd && endDate >= monthStart);
    });

    const priorityCounts = monthInitiatives.reduce((acc, initiative) => {
      acc[initiative.priority] = (acc[initiative.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      month: format(month, 'MMM yyyy'),
      shortMonth: format(month, 'MMM'),
      total: monthInitiatives.length,
      low: priorityCounts.low || 0,
      medium: priorityCounts.medium || 0,
      high: priorityCounts.high || 0,
      critical: priorityCounts.critical || 0,
      completed: monthInitiatives.filter(i => i.status === 'completed').length
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Total Active:</span> {payload[0].payload.total}
            </p>
            <p className="text-sm">
              <span className="font-medium">Completed:</span> {payload[0].payload.completed}
            </p>
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-gray-600 mb-1">By Priority:</p>
              {['critical', 'high', 'medium', 'low'].map(priority => {
                const count = payload[0].payload[priority];
                if (count > 0) {
                  return (
                    <p key={priority} className="text-xs flex items-center">
                      <span 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] }}
                      />
                      <span className="capitalize">{priority}:</span> {count}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (initiatives.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <p className="text-gray-500">No timeline data available</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="shortMonth" 
            tick={{ fontSize: 12 }}
            stroke="#6B7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6B7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]}>
            {monthlyData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.total > 10 ? '#EF4444' : entry.total > 5 ? '#F59E0B' : '#3B82F6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>1-5 Initiatives</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span>6-10 Initiatives</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>10+ Initiatives</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineOverviewChart;
