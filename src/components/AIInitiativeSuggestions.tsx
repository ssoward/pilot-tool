import { useState } from 'react';
import { useAI } from '../contexts/AIContext';

interface AIInitiativeSuggestionsProps {
  initiativeId: string;
}

const AIInitiativeSuggestions = ({ initiativeId }: AIInitiativeSuggestionsProps) => {
  const { getInitiativeSuggestions } = useAI();
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    try {
      setLoading(true);
      const data = await getInitiativeSuggestions(initiativeId);
      setSuggestions(data);
      setError(null);
    } catch (err) {
      setError('Failed to generate suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            AI Suggestions
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <svg className="mr-1.5 h-2 w-2 text-indigo-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            AI-Powered
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {!suggestions && !loading && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Get AI-generated suggestions to improve this initiative
            </p>
            <button
              onClick={handleGetSuggestions}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              Generate Suggestions
            </button>
          </div>
        )}
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating suggestions...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {suggestions && !error && (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm text-gray-700">{suggestions}</div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleGetSuggestions}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInitiativeSuggestions;
