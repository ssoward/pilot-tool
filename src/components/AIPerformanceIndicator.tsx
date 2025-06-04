import { useEffect, useState } from 'react';

interface AIPerformanceIndicatorProps {
  value: number;
  label: string;
  type: 'health' | 'risk' | 'success' | 'utilization' | 'timeline';
  showTrend?: boolean;
  previousValue?: number;
}

const AIPerformanceIndicator = ({ 
  value, 
  label, 
  type, 
  showTrend = false, 
  previousValue 
}: AIPerformanceIndicatorProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 200);
    return () => clearTimeout(timer);
  }, [value]);

  const getStatusColor = () => {
    switch (type) {
      case 'health':
      case 'success':
      case 'timeline':
        return value >= 80 ? 'bg-green-500' : 
               value >= 60 ? 'bg-yellow-500' : 'bg-red-500';
      case 'risk':
        return value <= 20 ? 'bg-green-500' : 
               value <= 50 ? 'bg-yellow-500' : 'bg-red-500';
      case 'utilization':
        return value >= 70 && value <= 90 ? 'bg-green-500' : 
               value >= 90 ? 'bg-yellow-500' : 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'health':
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'risk':
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'utilization':
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'timeline':
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTrendIndicator = () => {
    if (!showTrend || previousValue === undefined) return null;
    
    const difference = value - previousValue;
    const isPositive = difference > 0;
    
    if (Math.abs(difference) < 1) return null; // No significant change
    
    return (
      <div className={`flex items-center text-xs ${
        (type === 'risk' ? !isPositive : isPositive) ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        )}
        <span className="ml-1">{Math.abs(difference).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <h3 
              className="font-semibold text-xl sm:text-2xl transition-all duration-1000 ease-out"
              style={{ 
                transform: `scale(${animatedValue === value ? 1 : 0.9})`,
                opacity: animatedValue === value ? 1 : 0.7
              }}
            >
              {Math.round(animatedValue)}%
            </h3>
            {getTrendIndicator()}
          </div>
        </div>
        <div className="ml-3 sm:ml-4 flex-shrink-0">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} shadow-sm`}></div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${getStatusColor()}`}
            style={{ width: `${Math.min(animatedValue, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AIPerformanceIndicator;
