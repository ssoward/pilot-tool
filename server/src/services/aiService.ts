import axios from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

const AZURE_API_KEY = process.env.AZURE_API_KEY;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send a chat completion request to Azure OpenAI
 */
export const generateChatCompletion = async (
  messages: Message[],
  temperature = 0.7,
  max_tokens = 1000
): Promise<string> => {
  try {
    if (!AZURE_API_KEY || !AZURE_ENDPOINT) {
      throw new Error('Azure OpenAI API credentials not configured');
    }

    const requestBody: ChatCompletionRequest = {
      messages,
      temperature,
      max_tokens,
      top_p: 0.95,
      stream: false,
    };

    const response = await axios.post<ChatCompletionResponse>(
      AZURE_ENDPOINT,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_API_KEY,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw new Error(`Failed to generate chat completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate initiative improvement suggestions
 */
export const generateInitiativeSuggestions = async (initiative: any): Promise<string> => {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an AI assistant specialized in engineering initiative management. Provide constructive feedback and suggestions to improve the initiative details. Focus on clarity, completeness, strategic alignment, and potential risks.'
    },
    {
      role: 'user',
      content: `Please review this engineering initiative and provide suggestions for improvement:
      
Name: ${initiative.name}
Description: ${initiative.description}
Owner: ${initiative.owner}
Status: ${initiative.status}
Priority: ${initiative.priority}
${initiative.startDate ? `Start Date: ${new Date(initiative.startDate).toLocaleDateString()}` : ''}
${initiative.endDate ? `End Date: ${new Date(initiative.endDate).toLocaleDateString()}` : ''}
${initiative.businessValue ? `Business Value: ${initiative.businessValue}` : ''}
${initiative.dependencies && initiative.dependencies.length > 0 ? `Dependencies: ${initiative.dependencies.join(', ')}` : ''}
${initiative.goals && initiative.goals.length > 0 ? `Goals: ${initiative.goals.join(', ')}` : ''}
`
    }
  ];

  return await generateChatCompletion(messages, 0.7, 1000);
};

/**
 * Generate dependencies analysis
 */
export const analyzeInitiativeDependencies = async (initiatives: any[]): Promise<string> => {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an AI assistant specialized in dependency analysis for engineering initiatives. Analyze the dependencies between initiatives and provide insights on potential bottlenecks, critical paths, and suggestions for optimization.'
    },
    {
      role: 'user',
      content: `Please analyze the dependencies between these initiatives and provide insights:

${initiatives.map(initiative => `
Name: ${initiative.name}
Status: ${initiative.status}
Priority: ${initiative.priority}
Dependencies: ${initiative.dependencies && initiative.dependencies.length > 0 ? initiative.dependencies.join(', ') : 'None'}
`).join('\n')}
`
    }
  ];

  return await generateChatCompletion(messages, 0.7, 1500);
};

/**
 * Generate summary report
 */
export const generateExecutiveSummary = async (initiatives: any[]): Promise<string> => {
  const statusCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};

  initiatives.forEach(initiative => {
    statusCounts[initiative.status] = (statusCounts[initiative.status] || 0) + 1;
    priorityCounts[initiative.priority] = (priorityCounts[initiative.priority] || 0) + 1;
  });

  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an AI assistant specialized in creating executive summaries for engineering management. Create a concise, insightful executive summary based on the initiative data provided.'
    },
    {
      role: 'user',
      content: `Please generate an executive summary for the current state of our engineering initiatives:

Total Initiatives: ${initiatives.length}

Status Distribution:
${Object.entries(statusCounts)
  .map(([status, count]) => `- ${status}: ${count} (${Math.round((count / initiatives.length) * 100)}%)`)
  .join('\n')}

Priority Distribution:
${Object.entries(priorityCounts)
  .map(([priority, count]) => `- ${priority}: ${count} (${Math.round((count / initiatives.length) * 100)}%)`)
  .join('\n')}

High-Priority Initiatives:
${initiatives
  .filter(i => i.priority === 'high' || i.priority === 'critical')
  .map(i => `- ${i.name} (${i.status})`)
  .join('\n')}

The executive summary should highlight key insights, potential risks, and recommendations.
`
    }
  ];

  return await generateChatCompletion(messages, 0.7, 1500);
};

/**
 * Generate answers to natural language questions about initiatives
 */
export const answerInitiativeQuestion = async (initiatives: any[], question: string): Promise<string> => {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an AI assistant specialized in analyzing engineering initiatives. Answer questions about the initiatives based on the data provided. Be concise, accurate, and helpful.'
    },
    {
      role: 'user',
      content: `Based on the following initiatives data, please answer this question: "${question}"

Initiatives Data:
${initiatives.map(initiative => `
- Name: ${initiative.name}
  Description: ${initiative.description.substring(0, 100)}${initiative.description.length > 100 ? '...' : ''}
  Owner: ${initiative.owner}
  Status: ${initiative.status}
  Priority: ${initiative.priority}
  ${initiative.startDate ? `Start Date: ${new Date(initiative.startDate).toLocaleDateString()}` : ''}
  ${initiative.endDate ? `End Date: ${new Date(initiative.endDate).toLocaleDateString()}` : ''}
`).join('\n')}
`
    }
  ];

  return await generateChatCompletion(messages, 0.7, 1000);
};

/**
 * Generate contextual insights based on current view and data
 */
const generateContextualInsights = async (context: string, data?: any): Promise<any[]> => {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are an AI assistant that provides contextual insights for engineering project management. 
        Based on the context and data provided, generate 3-5 relevant insights that could be risks, opportunities, recommendations, or alerts.
        Return insights as a JSON array with each insight having: id, type, title, description, confidence, priority, category, timestamp.
        Types: 'risk', 'opportunity', 'recommendation', 'alert'
        Priorities: 'low', 'medium', 'high', 'critical'
        Confidence should be between 0 and 1.`
      },
      {
        role: 'user',
        content: `Context: ${context}
        Data: ${data ? JSON.stringify(data, null, 2) : 'No additional data provided'}
        
        Please provide contextual insights relevant to this context and data.`
      }
    ];

    const response = await generateChatCompletion(messages, 0.7, 1500);
    
    try {
      // Try to parse the AI response as JSON
      const insights = JSON.parse(response);
      return Array.isArray(insights) ? insights : [insights];
    } catch (parseError) {
      // If parsing fails, return mock insights for development
      console.warn('Failed to parse AI insights response, returning mock data');
      return generateMockInsights(context, data);
    }
  } catch (error) {
    console.error('Error generating contextual insights:', error);
    // Return mock insights as fallback
    return generateMockInsights(context, data);
  }
};

/**
 * Generate mock insights for development/fallback
 */
const generateMockInsights = (context: string, data?: any): any[] => {
  const timestamp = new Date().toISOString();
  
  return [
    {
      id: `insight-${Date.now()}-1`,
      type: 'risk',
      title: 'Timeline Risk Detected',
      description: `Based on the current ${context} view, there may be potential delays due to resource constraints.`,
      confidence: 0.75,
      priority: 'medium',
      category: 'Timeline Management',
      timestamp
    },
    {
      id: `insight-${Date.now()}-2`,
      type: 'opportunity',
      title: 'Optimization Opportunity',
      description: `Analysis of ${context} data suggests potential for process improvements and efficiency gains.`,
      confidence: 0.68,
      priority: 'medium',
      category: 'Process Optimization',
      timestamp
    },
    {
      id: `insight-${Date.now()}-3`,
      type: 'recommendation',
      title: 'Team Collaboration',
      description: `Consider enhancing cross-team communication for better ${context} coordination.`,
      confidence: 0.72,
      priority: 'low',
      category: 'Team Development',
      timestamp
    }
  ];
};

/**
 * Generate AI metrics based on initiative data
 */
export const generateAIMetrics = async (initiatives: any[]): Promise<any> => {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are an AI assistant specialized in analyzing engineering initiatives and generating performance metrics. 
        Based on the initiative data provided, generate AI metrics as JSON with these exact fields:
        {
          "overallHealth": <number 0-100>,
          "riskScore": <number 0-100>,
          "successProbability": <number 0-100>,
          "resourceUtilization": <number 0-100>,
          "timelineAdherence": <number 0-100>,
          "lastUpdated": "<ISO date string>"
        }`
      },
      {
        role: 'user',
        content: `Please analyze these initiatives and generate AI metrics:

${initiatives.map(initiative => `
Name: ${initiative.name}
Status: ${initiative.status}
Priority: ${initiative.priority}
Description: ${initiative.description}
Start Date: ${initiative.startDate ? new Date(initiative.startDate).toLocaleDateString() : 'Not set'}
End Date: ${initiative.endDate ? new Date(initiative.endDate).toLocaleDateString() : 'Not set'}
Business Value: ${initiative.businessValue || 'Not specified'}
`).join('\n')}

Return only the JSON metrics object.`
      }
    ];

    const response = await generateChatCompletion(messages, 0.7, 500);
    
    try {
      // Try to parse the AI response as JSON
      const metrics = JSON.parse(response);
      return {
        ...metrics,
        lastUpdated: new Date().toISOString()
      };
    } catch (parseError) {
      // If parsing fails, return calculated metrics
      console.warn('Failed to parse AI metrics response, calculating metrics');
      return calculateMetricsFromData(initiatives);
    }
  } catch (error) {
    console.error('Error generating AI metrics:', error);
    // Return calculated metrics as fallback
    return calculateMetricsFromData(initiatives);
  }
};

/**
 * Calculate metrics from initiative data (fallback method)
 */
const calculateMetricsFromData = (initiatives: any[]): any => {
  const total = initiatives.length;
  if (total === 0) {
    return {
      overallHealth: 50,
      riskScore: 50,
      successProbability: 50,
      resourceUtilization: 50,
      timelineAdherence: 50,
      lastUpdated: new Date().toISOString()
    };
  }

  // Calculate based on status distribution
  const completed = initiatives.filter(i => i.status === 'completed').length;
  const inProgress = initiatives.filter(i => i.status === 'in_progress').length;
  const approved = initiatives.filter(i => i.status === 'approved').length;
  const onHold = initiatives.filter(i => i.status === 'on_hold').length;
  const cancelled = initiatives.filter(i => i.status === 'cancelled').length;

  // Calculate based on priority distribution
  const critical = initiatives.filter(i => i.priority === 'critical').length;
  const high = initiatives.filter(i => i.priority === 'high').length;

  // Overall health based on completion rate and status
  const completionRate = completed / total;
  const progressRate = inProgress / total;
  const overallHealth = Math.round((completionRate * 40 + progressRate * 30 + approved / total * 20 + (1 - (onHold + cancelled) / total) * 10) * 100);

  // Risk score based on high priority items and problematic statuses
  const riskScore = Math.round((critical / total * 30 + high / total * 20 + (onHold + cancelled) / total * 50) * 100);

  // Success probability based on healthy status distribution
  const successProbability = Math.round((completionRate * 50 + progressRate * 30 + approved / total * 20) * 100);

  // Resource utilization (estimated based on active initiatives)
  const activeInitiatives = inProgress + approved;
  const resourceUtilization = Math.min(Math.round((activeInitiatives / total) * 100), 100);

  // Timeline adherence (estimated)
  const timelineAdherence = Math.round(75 + Math.random() * 20); // Mock calculation

  return {
    overallHealth: Math.max(0, Math.min(100, overallHealth)),
    riskScore: Math.max(0, Math.min(100, riskScore)),
    successProbability: Math.max(0, Math.min(100, successProbability)),
    resourceUtilization: Math.max(0, Math.min(100, resourceUtilization)),
    timelineAdherence: Math.max(0, Math.min(100, timelineAdherence)),
    lastUpdated: new Date().toISOString()
  };
};

export default {
  generateChatCompletion,
  generateInitiativeSuggestions,
  analyzeInitiativeDependencies,
  generateExecutiveSummary,
  answerInitiativeQuestion,
  generateContextualInsights,
  generateAIMetrics
};
