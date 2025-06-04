import { useState, useEffect, type FormEvent } from 'react';
import { useAI } from '../contexts/AIContext';
import { useLocation } from 'react-router-dom';

interface AIAssistantProps {
  className?: string;
  currentInitiative?: any;
}

const AIAssistant = ({ className = '', currentInitiative }: AIAssistantProps) => {
  const { 
    loading, 
    error, 
    askQuestion, 
    chatHistory, 
    clearChatHistory,
    insights,
    getContextualInsights 
  } = useAI();
  const [question, setQuestion] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [contextualSuggestions, setContextualSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');
  const location = useLocation();

  // Update contextual suggestions based on current route and data
  useEffect(() => {
    const path = location.pathname;
    let suggestions: string[] = [];
    
    if (currentInitiative) {
      suggestions = [
        `Analyze risks for "${currentInitiative.name}"`,
        `What are the success factors for this initiative?`,
        `How can we improve the timeline for "${currentInitiative.name}"?`,
        `What resources does this initiative need?`,
        `Compare this initiative to similar ones`
      ];
    } else if (path === '/') {
      suggestions = [
        'What initiatives need immediate attention?',
        'Show me this quarter\'s performance summary',
        'Which teams are overloaded this month?',
        'Identify cross-initiative dependencies',
        'What are our biggest risks right now?'
      ];
    } else if (path.includes('/initiatives')) {
      suggestions = [
        'How can I improve this initiative?',
        'What are potential blocking dependencies?',
        'What similar initiatives have we completed?',
        'Analyze the resource allocation',
        'Suggest timeline optimizations'
      ];
    } else if (path.includes('/reports')) {
      suggestions = [
        'Create an executive dashboard summary',
        'Which metrics show the biggest improvements?',
        'Compare this quarter to last quarter',
        'Identify process bottlenecks',
        'What are our top performing initiatives?'
      ];
    }
    
    setContextualSuggestions(suggestions);
  }, [location.pathname, currentInitiative]);

  // Load contextual insights when panel opens
  useEffect(() => {
    if (isOpen && activeTab === 'insights') {
      loadContextualInsights();
    }
  }, [isOpen, activeTab, location.pathname]);

  const loadContextualInsights = async () => {
    try {
      const context = location.pathname.includes('initiatives') ? 'initiative' : 'dashboard';
      const data = currentInitiative ? { initiative: currentInitiative } : undefined;
      await getContextualInsights(context, data);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    try {
      await askQuestion(question);
      setQuestion('');
    } catch (err) {
      console.error('Error asking question:', err);
    }
  };
  
  const handleSuggestionClick = async (suggestion: string) => {
    setQuestion(suggestion);
    try {
      await askQuestion(suggestion);
      setQuestion('');
    } catch (err) {
      console.error('Error with suggestion:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'opportunity':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'recommendation':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Assistant Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center relative"
        aria-label="AI Assistant"
      >
        {insights.length > 0 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">{insights.length}</span>
          </div>
        )}
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Assistant Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 sm:w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[500px]">
          {/* Header with Tabs */}
          <div className="bg-indigo-600 text-white p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">AI Assistant</h3>
              <div className="flex items-center space-x-2">
                {chatHistory.length > 0 && (
                  <button
                    onClick={clearChatHistory}
                    className="text-white hover:text-indigo-100 text-xs"
                    title="Clear chat history"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-indigo-100"
                  aria-label="Close assistant"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === 'chat' 
                    ? 'bg-white text-indigo-600' 
                    : 'text-indigo-100 hover:text-white'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-1 rounded text-sm transition-colors relative ${
                  activeTab === 'insights' 
                    ? 'bg-white text-indigo-600' 
                    : 'text-indigo-100 hover:text-white'
                }`}
              >
                Insights
                {insights.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {insights.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {error && (
              <div className="p-4 bg-red-100 text-red-800 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="p-4">
                {chatHistory.length > 0 ? (
                  <div className="space-y-4 mb-4">
                    {chatHistory.map((item: { type: 'question' | 'answer'; text: string; timestamp: Date }, index: number) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg ${
                          item.type === 'question' 
                            ? 'bg-indigo-50 ml-4 mr-1 border border-indigo-100' 
                            : 'bg-white mr-4 ml-1 border border-gray-200 shadow-sm'
                        }`}
                      >
                        <p className="text-xs text-gray-500 mb-1">
                          {item.type === 'question' ? 'You' : 'AI Assistant'}
                        </p>
                        <p className="text-sm whitespace-pre-wrap">
                          {item.text}
                        </p>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center p-3 bg-white rounded-lg mr-4 ml-1 border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-500">AI Assistant is thinking...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 mb-4">
                    <div className="text-center text-gray-500 py-4">
                      <p className="font-medium">Ask me anything about your initiatives!</p>
                      <p className="text-sm mt-1">I can analyze data, provide insights, and answer questions about your engineering initiatives.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 font-medium px-2">SUGGESTED QUESTIONS:</p>
                      {contextualSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left p-2 text-xs bg-white hover:bg-indigo-50 rounded-md border border-gray-200 transition-colors"
                          disabled={loading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="p-4">
                {insights.length > 0 ? (
                  <div className="space-y-3">
                    {insights.map((insight: any) => (
                      <div key={insight.id} className={`p-3 rounded-lg border ${getPriorityColor(insight.priority)}`}>
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium truncate">{insight.title}</h4>
                              <span className="text-xs opacity-75">
                                {Math.round(insight.confidence * 100)}%
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed">{insight.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-75">{insight.category}</span>
                              <span className="text-xs opacity-75">
                                {insight.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="font-medium">No insights available</p>
                    <p className="text-sm mt-1">AI is analyzing your initiatives to generate insights.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Input Form - Only show for chat tab */}
          {activeTab === 'chat' && (
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about your initiatives..."
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md px-3 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !question.trim()}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
