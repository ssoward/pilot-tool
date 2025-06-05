import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface AIMetricsTrendChartProps {
  className?: string;
}

// Generate mock AI metrics data for the last 30 days
const generateMockMetricsData = () => {
  const endDate = new Date();
  const startDate = subDays(endDate, 29);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map((day, index) => {
    // Create realistic trending data
    const baseHealth = 75 + Math.sin(index * 0.1) * 10 + Math.random() * 8;
    const baseRisk = 30 - Math.sin(index * 0.15) * 8 + Math.random() * 6;
    const baseSuccess = 78 + Math.cos(index * 0.08) * 12 + Math.random() * 5;
    
    return {
      date: format(day, 'MMM dd'),
      fullDate: format(day, 'yyyy-MM-dd'),
      overallHealth: Math.max(0, Math.min(100, baseHealth)),
      riskScore: Math.max(0, Math.min(100, baseRisk)),
      successProbability: Math.max(0, Math.min(100, baseSuccess)),
      resourceUtilization: Math.max(0, Math.min(100, 85 + Math.random() * 10 - 5)),
      timelineAdherence: Math.max(0, Math.min(100, 88 + Math.random() * 8 - 4))
    };
  });
};

const AIMetricsTrendChart = ({ className = '' }: AIMetricsTrendChartProps) => {
  const metricsData = generateMockMetricsData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">{entry.name}:</span>
                <span className="ml-1">{Math.round(entry.value)}%</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (tickItem: string, index: number) => {
    // Show every 5th label to avoid crowding
    return index % 5 === 0 ? tickItem : '';
  };

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={metricsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11 }}
            stroke="#6B7280"
            tickFormatter={formatXAxisLabel}
          />
          <YAxis 
            tick={{ fontSize: 11 }}
            stroke="#6B7280"
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="overallHealth"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#healthGradient)"
            name="Overall Health"
          />
          <Area
            type="monotone"
            dataKey="successProbability"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#successGradient)"
            name="Success Probability"
          />
          <Area
            type="monotone"
            dataKey="riskScore"
            stroke="#EF4444"
            strokeWidth={2}
            fill="url(#riskGradient)"
            name="Risk Score"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>Overall Health</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>Success Probability</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>Risk Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMetricsTrendChart;
