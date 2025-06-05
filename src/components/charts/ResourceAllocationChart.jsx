import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
// import type { ResourceAllocation } from '../../types/Team';


const ResourceAllocationChart = ({ data }) => {
  const chartData = data.map(allocation => ({
    name: allocation.teamName,
    totalCapacity: allocation.totalCapacity,
    allocatedCapacity: allocation.allocatedCapacity,
    availableCapacity: allocation.availableCapacity,
    utilizationPercentage: allocation.utilizationPercentage
  }));

  const getBarColor = (utilization) => {
    if (utilization > 100) return '#ef4444'; // red-500
    if (utilization > 85) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Total Capacity:</span>{' '}
              <span className="font-medium">{data.totalCapacity}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Allocated:</span>{' '}
              <span className="font-medium">{data.allocatedCapacity}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Available:</span>{' '}
              <span className="font-medium">{data.availableCapacity}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Utilization:</span>{' '}
              <span className={`font-medium ${
                data.utilizationPercentage > 100 ? 'text-red-600' :
                data.utilizationPercentage > 85 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {data.utilizationPercentage}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No resource allocation data available
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Total Capacity Bar (Background) */}
          <Bar 
            dataKey="totalCapacity" 
            fill="#e5e7eb" 
            radius={[4, 4, 0, 0]}
            name="Total Capacity"
          />
          
          {/* Allocated Capacity Bar (Foreground) */}
          <Bar 
            dataKey="allocatedCapacity" 
            radius={[4, 4, 0, 0]}
            name="Allocated Capacity"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.utilizationPercentage)} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Total Capacity</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-sm text-gray-600">Normal (&le;85%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-500 rounded"></div>
          <span className="text-sm text-gray-600">Near Capacity (85-100%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Overallocated (&gt;100%)</span>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocationChart;
