import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import aiService from '../services/aiService';
import type { Initiative } from '../types/Initiative';

export interface DetailedAnalysis {
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

export interface AIInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  timestamp: Date;
}

export interface AIMetrics {
  overallHealth: number;
  riskScore: number;
  successProbability: number;
  resourceUtilization: number;
  timelineAdherence: number;
  lastUpdated: Date;
}

interface AIContextType {
  loading: boolean;
  error: string | null;
  insights: AIInsight[];
  metrics: AIMetrics | null;
  chatHistory: { type: 'question' | 'answer'; text: string; timestamp: Date }[];
  getInitiativeSuggestions: (initiativeId: string) => Promise<string>;
  getDependencyAnalysis: () => Promise<string>;
  getExecutiveSummary: () => Promise<string>;
  askQuestion: (question: string) => Promise<string>;
  getDetailedInitiativeAnalysis: (initiativeId: string) => Promise<DetailedAnalysis>;
  generateAIMetrics: (initiatives: Initiative[]) => Promise<AIMetrics>;
  getContextualInsights: (context: string, data?: any) => Promise<AIInsight[]>;
  clearChatHistory: () => void;
  refreshInsights: () => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider = ({ children }: AIProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [chatHistory, setChatHistory] = useState<{ type: 'question' | 'answer'; text: string; timestamp: Date }[]>([]);

  // Wrap functions with useCallback to prevent infinite re-renders
  const getInitiativeSuggestions = useCallback(async (initiativeId: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.getInitiativeSuggestions(initiativeId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI suggestions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDependencyAnalysis = useCallback(async (): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.getDependencyAnalysis();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get dependency analysis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getExecutiveSummary = useCallback(async (): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.getExecutiveSummary();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get executive summary';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const askQuestion = useCallback(async (question: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      // Add question to chat history
      const newQuestion = { type: 'question' as const, text: question, timestamp: new Date() };
      setChatHistory(prev => [...prev, newQuestion]);
      
      const result = await aiService.askQuestion(question);
      
      // Add answer to chat history
      const newAnswer = { type: 'answer' as const, text: result, timestamp: new Date() };
      setChatHistory(prev => [...prev, newAnswer]);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI answer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDetailedInitiativeAnalysis = useCallback(async (initiativeId: string): Promise<DetailedAnalysis> => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.getDetailedInitiativeAnalysis(initiativeId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get detailed analysis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAIMetrics = useCallback(async (initiatives: Initiative[]): Promise<AIMetrics> => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.generateMetrics(initiatives);
      setMetrics(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate AI metrics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getContextualInsights = useCallback(async (context: string, data?: any): Promise<AIInsight[]> => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.getContextualInsights(context, data);
      setInsights(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get contextual insights';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  const refreshInsights = useCallback(async () => {
    try {
      // Refresh insights based on current context - call service directly to avoid circular dependency
      const result = await aiService.getContextualInsights('dashboard');
      setInsights(result);
    } catch (err) {
      console.error('Failed to refresh insights:', err);
    }
  }, []);

  // Auto-refresh insights every 30 minutes - use longer interval and ref to prevent excessive calls
  useEffect(() => {
    let isMounted = true;
    
    const refreshInsightsPeriodically = async () => {
      if (!isMounted) return;
      try {
        // Call service directly to avoid circular dependency
        const result = await aiService.getContextualInsights('dashboard');
        setInsights(result);
      } catch (err) {
        console.error('Failed to refresh insights:', err);
      }
    };

    // Set longer interval and only call once on mount, not repeatedly
    const interval = setInterval(refreshInsightsPeriodically, 30 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // Empty dependency array to prevent re-running

  return (
    <AIContext.Provider
      value={{
        loading,
        error,
        insights,
        metrics,
        chatHistory,
        getInitiativeSuggestions,
        getDependencyAnalysis,
        getExecutiveSummary,
        askQuestion,
        getDetailedInitiativeAnalysis,
        generateAIMetrics,
        getContextualInsights,
        clearChatHistory,
        refreshInsights,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export default AIContext;
