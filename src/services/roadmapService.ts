import axios from 'axios';
import type { RoadmapItem, RoadmapMilestone } from '../types/Team';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface RoadmapFilters {
  teams: string[];
  statuses: string[];
  priorities: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery: string;
  showMilestones: boolean;
  showDependencies: boolean;
}

export interface RoadmapUpdateRequest {
  initiativeId: string;
  startDate?: Date;
  endDate?: Date;
  teamIds?: string[];
  estimatedEffort?: number;
}

export interface TimelineAnalysis {
  totalInitiatives: number;
  completedInitiatives: number;
  inProgressInitiatives: number;
  plannedInitiatives: number;
  overallProgress: number;
  criticalPath: RoadmapItem[];
  riskyItems: Array<{
    item: RoadmapItem;
    riskFactors: string[];
    impact: 'high' | 'medium' | 'low';
  }>;
}

class RoadmapService {
  // Roadmap Data Management
  async getRoadmapItems(filters?: RoadmapFilters): Promise<RoadmapItem[]> {
    const response = await axios.get(`${API_BASE_URL}/roadmap`, {
      params: filters
    });
    return response.data;
  }

  async getRoadmapItem(itemId: string): Promise<RoadmapItem> {
    const response = await axios.get(`${API_BASE_URL}/roadmap/${itemId}`);
    return response.data;
  }

  async updateRoadmapItem(itemId: string, updates: RoadmapUpdateRequest): Promise<RoadmapItem> {
    const response = await axios.put(`${API_BASE_URL}/roadmap/${itemId}`, updates);
    return response.data;
  }

  async createRoadmapItem(item: Omit<RoadmapItem, 'id'>): Promise<RoadmapItem> {
    const response = await axios.post(`${API_BASE_URL}/roadmap`, item);
    return response.data;
  }

  async deleteRoadmapItem(itemId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/roadmap/${itemId}`);
  }

  // Timeline Management
  async updateItemTimeline(
    itemId: string,
    startDate: Date,
    endDate: Date,
    validateResources: boolean = true
  ): Promise<{
    success: boolean;
    conflicts?: Array<{
      type: string;
      description: string;
      suggestions: string[];
    }>;
    updatedItem?: RoadmapItem;
  }> {
    const response = await axios.put(`${API_BASE_URL}/roadmap/${itemId}/timeline`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      validateResources
    });
    return response.data;
  }

  async bulkUpdateTimeline(updates: Array<{
    itemId: string;
    startDate: Date;
    endDate: Date;
  }>): Promise<{
    successful: string[];
    failed: Array<{
      itemId: string;
      error: string;
    }>;
  }> {
    const response = await axios.put(`${API_BASE_URL}/roadmap/bulk-timeline`, {
      updates: updates.map(update => ({
        ...update,
        startDate: update.startDate.toISOString(),
        endDate: update.endDate.toISOString()
      }))
    });
    return response.data;
  }

  // Milestone Management
  async addMilestone(itemId: string, milestone: Omit<RoadmapMilestone, 'id'>): Promise<RoadmapMilestone> {
    const response = await axios.post(`${API_BASE_URL}/roadmap/${itemId}/milestones`, milestone);
    return response.data;
  }

  async updateMilestone(itemId: string, milestoneId: string, updates: Partial<RoadmapMilestone>): Promise<RoadmapMilestone> {
    const response = await axios.put(`${API_BASE_URL}/roadmap/${itemId}/milestones/${milestoneId}`, updates);
    return response.data;
  }

  async deleteMilestone(itemId: string, milestoneId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/roadmap/${itemId}/milestones/${milestoneId}`);
  }

  // Dependency Management
  async addDependency(itemId: string, dependsOnId: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/roadmap/${itemId}/dependencies`, {
      dependsOnId
    });
  }

  async removeDependency(itemId: string, dependsOnId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/roadmap/${itemId}/dependencies/${dependsOnId}`);
  }

  async getDependencyGraph(): Promise<{
    nodes: Array<{
      id: string;
      name: string;
      status: string;
      teamIds: string[];
    }>;
    edges: Array<{
      from: string;
      to: string;
      type: 'blocks' | 'enables';
    }>;
  }> {
    const response = await axios.get(`${API_BASE_URL}/roadmap/dependency-graph`);
    return response.data;
  }

  // Analytics and Insights
  async getTimelineAnalysis(filters?: RoadmapFilters): Promise<TimelineAnalysis> {
    const response = await axios.get(`${API_BASE_URL}/roadmap/analysis`, {
      params: filters
    });
    return response.data;
  }

  async getTeamRoadmap(teamId: string, timeframe: 'quarter' | 'year' = 'quarter'): Promise<{
    team: {
      id: string;
      name: string;
    };
    items: RoadmapItem[];
    utilization: {
      current: number;
      projected: number;
    };
    conflicts: Array<{
      type: string;
      description: string;
      severity: 'high' | 'medium' | 'low';
    }>;
  }> {
    const response = await axios.get(`${API_BASE_URL}/roadmap/team/${teamId}`, {
      params: { timeframe }
    });
    return response.data;
  }

  async getCapacityProjection(
    startDate: Date,
    endDate: Date,
    teamIds?: string[]
  ): Promise<{
    timeline: Array<{
      date: string;
      totalCapacity: number;
      allocatedCapacity: number;
      availableCapacity: number;
      utilizationRate: number;
      teams: Array<{
        teamId: string;
        teamName: string;
        capacity: number;
        allocated: number;
        utilization: number;
      }>;
    }>;
    recommendations: Array<{
      type: 'rebalance' | 'delay' | 'additional_resources';
      description: string;
      impact: string;
      confidence: number;
    }>;
  }> {
    const response = await axios.get(`${API_BASE_URL}/roadmap/capacity-projection`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        teamIds: teamIds?.join(',')
      }
    });
    return response.data;
  }

  // Optimization and Suggestions
  async optimizeRoadmap(
    constraints: {
      maxUtilization?: number;
      priorityWeights?: Record<string, number>;
      teamPreferences?: Record<string, string[]>;
      deadlines?: Record<string, Date>;
    }
  ): Promise<{
    optimizedSchedule: RoadmapItem[];
    improvements: Array<{
      type: string;
      description: string;
      estimatedBenefit: string;
    }>;
    conflicts: Array<{
      description: string;
      severity: 'high' | 'medium' | 'low';
      affectedItems: string[];
    }>;
  }> {
    const response = await axios.post(`${API_BASE_URL}/roadmap/optimize`, {
      constraints: {
        ...constraints,
        deadlines: constraints.deadlines ? 
          Object.entries(constraints.deadlines).reduce((acc, [key, date]) => ({
            ...acc,
            [key]: date.toISOString()
          }), {}) : undefined
      }
    });
    return response.data;
  }

  async suggestScheduleAdjustments(itemId: string): Promise<{
    suggestions: Array<{
      type: 'move_earlier' | 'move_later' | 'change_team' | 'split_initiative';
      description: string;
      impact: string;
      newStartDate?: Date;
      newEndDate?: Date;
      suggestedTeam?: string;
      confidence: number;
    }>;
  }> {
    const response = await axios.get(`${API_BASE_URL}/roadmap/${itemId}/schedule-suggestions`);
    return {
      suggestions: response.data.suggestions.map((s: any) => ({
        ...s,
        newStartDate: s.newStartDate ? new Date(s.newStartDate) : undefined,
        newEndDate: s.newEndDate ? new Date(s.newEndDate) : undefined
      }))
    };
  }

  // Export and Sharing
  async exportRoadmap(
    format: 'pdf' | 'csv' | 'json',
    filters?: RoadmapFilters
  ): Promise<Blob> {
    const response = await axios.get(`${API_BASE_URL}/roadmap/export`, {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  }

  async generateRoadmapReport(
    teamIds?: string[],
    timeframe: 'quarter' | 'year' = 'quarter'
  ): Promise<{
    summary: {
      totalInitiatives: number;
      completionRate: number;
      averageDelay: number;
      resourceUtilization: number;
    };
    teamBreakdown: Array<{
      teamId: string;
      teamName: string;
      initiatives: number;
      utilization: number;
      performance: number;
    }>;
    recommendations: string[];
    risks: Array<{
      description: string;
      probability: number;
      impact: string;
      mitigation: string;
    }>;
  }> {
    const response = await axios.get(`${API_BASE_URL}/roadmap/report`, {
      params: {
        teamIds: teamIds?.join(','),
        timeframe
      }
    });
    return response.data;
  }
}

export const roadmapService = new RoadmapService();
export default roadmapService;
