import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { usePerformanceMetrics } from '../hooks/useQueries';

interface PerformanceMonitorProps {
  className?: string;
}

export const PerformanceMonitor = ({ className = '' }: PerformanceMonitorProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
  });
  const [queryMetrics, setQueryMetrics] = useState({
    totalQueries: 0,
    loadingQueries: 0,
    errorQueries: 0,
    successQueries: 0,
    cacheHitRatio: 0,
  });
  
  const { getQueryMetrics } = usePerformanceMetrics();
  const { addNotification } = useNotifications();
  const hasShownWarning = useRef(false);
  const pageLoadTime = useRef(performance.now());

  // Memoize the update function to prevent recreating it on every render
  const updatePerformance = useCallback(() => {
    const metrics = getQueryMetrics();
    const currentTime = performance.now();
    const timeSinceLoad = currentTime - pageLoadTime.current;
    
    setPerformanceData({
      loadTime: Math.round(timeSinceLoad),
      renderTime: Math.round(currentTime),
      memoryUsage: (performance as any).memory ? 
        Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0,
      networkRequests: metrics.totalQueries,
    });

    setQueryMetrics(metrics);
  }, [getQueryMetrics]);

  useEffect(() => {
    // Lightweight performance monitoring - only basic metrics without timing operations
    const performanceCheck = () => {
      // Skip monitoring if tab is not visible to save resources
      if (document.hidden) return;
      
      updatePerformance();
      
      // Only warn on very high memory usage to avoid false positives
      const memoryUsage = (performance as any).memory ? 
        Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0;
      
      if (memoryUsage > 500 && !hasShownWarning.current) {
        hasShownWarning.current = true;
        addNotification({
          type: 'warning',
          title: 'Very High Memory Usage',
          message: 'Application is using excessive memory. Consider refreshing the page.',
          duration: 5000,
        });
      }
    };

    // Initial check (only if visible)
    if (!document.hidden) {
      updatePerformance();
    }
    
    // Set up interval for periodic checks - much less frequent to minimize performance impact
    const interval = setInterval(performanceCheck, 60000); // Check every 60 seconds

    // Handle visibility change to pause/resume monitoring
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updatePerformance();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updatePerformance, addNotification]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-40 ${className}`}
        title="Show Performance Monitor"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-40 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Load Time:</span>
          <span className={`font-medium ${performanceData.loadTime > 2000 ? 'text-red-600' : 'text-green-600'}`}>
            {performanceData.loadTime}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Memory Usage:</span>
          <span className={`font-medium ${performanceData.memoryUsage > 100 ? 'text-yellow-600' : 'text-green-600'}`}>
            {performanceData.memoryUsage}MB
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Network Requests:</span>
          <span className="font-medium text-blue-600">
            {performanceData.networkRequests}
          </span>
        </div>
        
        <div className="border-t pt-3">
          <div className="text-xs text-gray-500 mb-2">Query Cache Status:</div>
          <div className="flex justify-between text-xs">
            <span>Success:</span>
            <span className="text-green-600">{queryMetrics.successQueries}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Loading:</span>
            <span className="text-yellow-600">{queryMetrics.loadingQueries}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Errors:</span>
            <span className="text-red-600">{queryMetrics.errorQueries}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Hit Ratio:</span>
            <span className="text-blue-600">{Math.round(queryMetrics.cacheHitRatio * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
