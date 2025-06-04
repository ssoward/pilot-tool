import { apiClient } from './api';
import type { Initiative } from '../types/Initiative';

interface DetailedAnalysis {
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    score: number;
    factors: string[];
    recommendations: string[];
  };
  successProbability: {
    score: number;
    factors: string[];
    confidence: number;
  };
  timelineAnalysis: {
    currentStatus: string;
    projectedCompletion: string;
    riskFactors: string[];
    recommendations: string[];
  };
  resourceOptimization: {
    currentUtilization: number;
    recommendations: string[];
    potentialSavings: string;
  };
  improvements: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

interface AIInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  timestamp: Date;
}

interface AIMetrics {
  overallHealth: number;
  riskScore: number;
  successProbability: number;
  resourceUtilization: number;
  timelineAdherence: number;
  lastUpdated: Date;
}

export const aiService = {
  /**
   * Get AI-generated improvement suggestions for an initiative
   */
  getInitiativeSuggestions: async (initiativeId: string): Promise<string> => {
    try {
      const response = await apiClient.get(`/ai/initiative-suggestions/${initiativeId}`);
      return response.data.suggestions;
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      throw new Error('Failed to get AI suggestions');
    }
  },
  
  /**
   * Get AI-generated dependency analysis
   */
  getDependencyAnalysis: async (): Promise<string> => {
    try {
      const response = await apiClient.get('/ai/dependency-analysis');
      return response.data.analysis;
    } catch (error) {
      console.error('Error fetching dependency analysis:', error);
      throw new Error('Failed to get dependency analysis');
    }
  },
  
  /**
   * Get AI-generated executive summary
   */
  getExecutiveSummary: async (): Promise<string> => {
    try {
      const response = await apiClient.get('/ai/executive-summary');
      return response.data.summary;
    } catch (error) {
      console.error('Error fetching executive summary:', error);
      throw new Error('Failed to get executive summary');
    }
  },
  
  /**
   * Ask a question about initiatives and get an AI-generated answer
   */
  askQuestion: async (question: string): Promise<string> => {
    try {
      const response = await apiClient.post('/ai/ask', { question });
      return response.data.answer;
    } catch (error) {
      console.error('Error getting AI answer:', error);
      throw new Error('Failed to get AI answer');
    }
  },

  /**
   * Get detailed analysis for a specific initiative
   */
  getDetailedInitiativeAnalysis: async (initiativeId: string): Promise<DetailedAnalysis> => {
    try {
      const response = await apiClient.get(`/ai/detailed-analysis/${initiativeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed analysis:', error);
      // Return mock data for development
      return {
        riskAssessment: {
          level: 'medium',
          score: 65,
          factors: [
            'Dependency on external APIs',
            'Timeline conflicts with Q4 releases',
            'Resource allocation constraints'
          ],
          recommendations: [
            'Implement API fallback mechanisms',
            'Create timeline buffers for Q4 dependencies',
            'Consider additional resource allocation'
          ]
        },
        successProbability: {
          score: 75,
          factors: [
            'Clear requirements defined',
            'Experienced team lead assigned',
            'Adequate resource allocation'
          ],
          confidence: 85
        },
        timelineAnalysis: {
          currentStatus: 'On track with minor concerns',
          projectedCompletion: '2024-03-15',
          riskFactors: [
            'Critical path dependencies',
            'Testing phase may require additional time',
            'Integration complexity'
          ],
          recommendations: [
            'Add 2-3 week buffer for testing',
            'Start integration planning early',
            'Implement parallel development tracks'
          ]
        },
        resourceOptimization: {
          currentUtilization: 85,
          recommendations: [
            'Add frontend specialist for UI components',
            'Involve QA earlier in the process',
            'Consider additional backend support'
          ],
          potentialSavings: '15% efficiency improvement possible'
        },
        improvements: {
          immediate: [
            'Implement weekly stakeholder check-ins',
            'Break down large epics into smaller stories'
          ],
          shortTerm: [
            'Establish clear definition of done criteria',
            'Set up automated testing pipeline'
          ],
          longTerm: [
            'Plan for early user testing and feedback loops',
            'Implement cross-team knowledge sharing'
          ]
        }
      };
    }
  },

  /**
   * Generate AI metrics based on initiative data
   */
  generateMetrics: async (initiatives: Initiative[]): Promise<AIMetrics> => {
    try {
      const response = await apiClient.post('/ai/generate-metrics', { initiatives });
      return response.data;
    } catch (error) {
      console.error('Error generating AI metrics:', error);
      // Return mock metrics for development
      return {
        overallHealth: 78,
        riskScore: 23,
        successProbability: 82,
        resourceUtilization: 85,
        timelineAdherence: 71,
        lastUpdated: new Date()
      };
    }
  },

  /**
   * Get contextual insights based on current view/data
   */
  getContextualInsights: async (context: string, data?: any): Promise<AIInsight[]> => {
    try {
      const response = await apiClient.post('/ai/contextual-insights', { context, data });
      return response.data.insights;
    } catch (error) {
      console.error('Error fetching contextual insights:', error);
      // Return mock insights for development
      return [
        {
          id: '1',
          type: 'risk',
          title: 'Timeline Risk Detected',
          description: 'The UI Redesign Project may face delays due to overlapping resource requirements with the Security Compliance Update.',
          confidence: 0.85,
          priority: 'high',
          category: 'Resource Management',
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'opportunity',
          title: 'Efficiency Opportunity',
          description: 'Database Migration and API Performance Optimization could share infrastructure improvements, reducing overall timeline by 3 weeks.',
          confidence: 0.72,
          priority: 'medium',
          category: 'Process Optimization',
          timestamp: new Date()
        },
        {
          id: '3',
          type: 'recommendation',
          title: 'Team Collaboration',
          description: 'Consider cross-team knowledge sharing sessions between Mobile App Development and UI Redesign teams.',
          confidence: 0.68,
          priority: 'medium',
          category: 'Team Development',
          timestamp: new Date()
        }
      ];
    }
  }
};

export default aiService;
