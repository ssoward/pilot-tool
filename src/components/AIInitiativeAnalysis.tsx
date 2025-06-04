import { useState, useEffect } from 'react';
import { useAI } from '../contexts/AIContext';
import type { Initiative } from '../types/Initiative';

interface AIInitiativeAnalysisProps {
  initiative: Initiative;
  className?: string;
}

interface AnalysisSection {
  title: string;
  content: string;
  icon: React.ReactNode;
  status: 'loading' | 'completed' | 'error';
}

const AIInitiativeAnalysis = ({ initiative, className = '' }: AIInitiativeAnalysisProps) => {
  const { loading: globalLoading, error: globalError, getDetailedInitiativeAnalysis } = useAI();
  const [analysis, setAnalysis] = useState<AnalysisSection[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize analysis sections
  useEffect(() => {
    const sections: AnalysisSection[] = [
      {
        title: 'Risk Assessment',
        content: '',
        status: 'loading',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      },
      {
        title: 'Success Probability',
        content: '',
        status: 'loading',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      },
      {
        title: 'Timeline Analysis',
        content: '',
        status: 'loading',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        title: 'Resource Optimization',
        content: '',
        status: 'loading',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      },
      {
        title: 'Improvement Recommendations',
        content: '',
        status: 'loading',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      }
    ];

    setAnalysis(sections);
  }, [initiative]);

  // Fetch detailed analysis
  useEffect(() => {
    if (isExpanded && initiative.id) {
      fetchAnalysis();
    }
  }, [isExpanded, initiative.id]);

  const fetchAnalysis = async () => {
    try {
      const detailedAnalysis = await getDetailedInitiativeAnalysis(initiative.id);
      
      // Parse the response and update each section
      const sections = analysis.map((section) => {
        let content = '';
        let status: 'loading' | 'completed' | 'error' = 'completed';

        switch (section.title) {
          case 'Risk Assessment':
            if (typeof detailedAnalysis.riskAssessment === 'object') {
              content = `Risk Level: ${detailedAnalysis.riskAssessment.level.toUpperCase()} (Score: ${detailedAnalysis.riskAssessment.score}/100)\n\nKey Risk Factors:\n${detailedAnalysis.riskAssessment.factors.map(f => `• ${f}`).join('\n')}\n\nRecommendations:\n${detailedAnalysis.riskAssessment.recommendations.map(r => `• ${r}`).join('\n')}`;
            } else {
              content = detailedAnalysis.riskAssessment || 'No specific risks identified based on current data.';
            }
            break;
          case 'Success Probability':
            if (typeof detailedAnalysis.successProbability === 'object') {
              content = `Success Score: ${detailedAnalysis.successProbability.score}% (Confidence: ${detailedAnalysis.successProbability.confidence}%)\n\nSuccess Factors:\n${detailedAnalysis.successProbability.factors.map(f => `• ${f}`).join('\n')}`;
            } else {
              content = detailedAnalysis.successProbability || 'Analysis in progress...';
            }
            break;
          case 'Timeline Analysis':
            if (typeof detailedAnalysis.timelineAnalysis === 'object') {
              content = `Current Status: ${detailedAnalysis.timelineAnalysis.currentStatus}\nProjected Completion: ${detailedAnalysis.timelineAnalysis.projectedCompletion}\n\nRisk Factors:\n${detailedAnalysis.timelineAnalysis.riskFactors.map(f => `• ${f}`).join('\n')}\n\nRecommendations:\n${detailedAnalysis.timelineAnalysis.recommendations.map(r => `• ${r}`).join('\n')}`;
            } else {
              content = detailedAnalysis.timelineAnalysis || 'Timeline appears feasible based on scope and dependencies.';
            }
            break;
          case 'Resource Optimization':
            if (typeof detailedAnalysis.resourceOptimization === 'object') {
              content = `Current Utilization: ${detailedAnalysis.resourceOptimization.currentUtilization}%\nPotential Savings: ${detailedAnalysis.resourceOptimization.potentialSavings}\n\nRecommendations:\n${detailedAnalysis.resourceOptimization.recommendations.map(r => `• ${r}`).join('\n')}`;
            } else {
              content = detailedAnalysis.resourceOptimization || 'Current resource allocation appears adequate.';
            }
            break;
          case 'Improvement Recommendations':
            if (typeof detailedAnalysis.improvements === 'object') {
              content = `Immediate Actions:\n${detailedAnalysis.improvements.immediate.map(i => `• ${i}`).join('\n')}\n\nShort-term (1-3 months):\n${detailedAnalysis.improvements.shortTerm.map(s => `• ${s}`).join('\n')}\n\nLong-term (3+ months):\n${detailedAnalysis.improvements.longTerm.map(l => `• ${l}`).join('\n')}`;
            } else {
              content = (detailedAnalysis as any).recommendations || 'Consider regular checkpoint reviews and stakeholder communication.';
            }
            break;
          default:
            content = 'Analysis complete.';
        }

        return { ...section, content, status };
      });

      setAnalysis(sections);
    } catch (error) {
      // Update all sections to error state
      const errorSections = analysis.map(section => ({
        ...section,
        content: 'Unable to generate analysis at this time.',
        status: 'error' as const
      }));
      setAnalysis(errorSections);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'error':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">AI Initiative Analysis</h3>
              <p className="text-sm text-gray-500">
                Detailed insights and recommendations for "{initiative.name}"
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {globalLoading && (
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            )}
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          {globalError && (
            <div className="p-4 bg-red-50 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Analysis Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{globalError}</p>
            </div>
          )}

          <div className="p-4 space-y-4">
            {analysis.map((section, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-600">{section.icon}</div>
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                  </div>
                  <div className={`flex items-center space-x-1 ${getStatusColor(section.status)}`}>
                    {getStatusIcon(section.status)}
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  {section.status === 'loading' ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-gray-500">Generating analysis...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{section.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInitiativeAnalysis;
