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

export default {
  generateChatCompletion,
  generateInitiativeSuggestions,
  analyzeInitiativeDependencies,
  generateExecutiveSummary,
  answerInitiativeQuestion
};
