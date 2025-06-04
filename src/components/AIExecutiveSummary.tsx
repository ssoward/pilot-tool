import { useState, useEffect } from 'react';
import { useAI } from '../contexts/AIContext';

const AIExecutiveSummary = () => {
  const { getExecutiveSummary } = useAI();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getExecutiveSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError('Failed to generate executive summary');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [getExecutiveSummary]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">AI Executive Summary</h3>
        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">AI-Generated</span>
      </div>
      
      <div className="border-t border-gray-100 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating executive summary...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        ) : summary ? (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm text-gray-700">{summary}</div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No summary available
          </div>
        )}
      </div>
    </div>
  );
};

export default AIExecutiveSummary;
