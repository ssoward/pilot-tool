import axios from 'axios';
import type {
  Team,
  TeamMember,
  TeamAssignment,
  ResourceAllocation,
  ResourceConflict,
  TeamPerformanceMetrics,
  TeamCreateRequest,
  TeamUpdateRequest,
  TeamMemberCreateRequest,
  BulkAssignmentRequest
} from '../types/Team';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class TeamManagementService {
  // Team CRUD Operations
  async createTeam(teamData: TeamCreateRequest): Promise<Team> {
    const response = await axios.post(`${API_BASE_URL}/teams`, teamData);
    return response.data;
  }

  async getTeams(): Promise<Team[]> {
    const response = await axios.get(`${API_BASE_URL}/teams`);
    return response.data;
  }

  async getTeam(teamId: string): Promise<Team> {
    const response = await axios.get(`${API_BASE_URL}/teams/${teamId}`);
    return response.data;
  }

  async updateTeam(teamId: string, teamData: TeamUpdateRequest): Promise<Team> {
    const response = await axios.put(`${API_BASE_URL}/teams/${teamId}`, teamData);
    return response.data;
  }

  async deleteTeam(teamId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/teams/${teamId}`);
  }

  // Team Member Management
  async addTeamMember(memberData: TeamMemberCreateRequest): Promise<TeamMember> {
    const response = await axios.post(`${API_BASE_URL}/team-members`, memberData);
    return response.data;
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const response = await axios.get(`${API_BASE_URL}/teams/${teamId}/members`);
    return response.data;
  }

  async updateTeamMember(memberId: string, memberData: Partial<TeamMember>): Promise<TeamMember> {
    const response = await axios.put(`${API_BASE_URL}/team-members/${memberId}`, memberData);
    return response.data;
  }

  async removeTeamMember(memberId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/team-members/${memberId}`);
  }

  // Resource Allocation
  async assignInitiativeToTeam(
    initiativeId: string,
    teamId: string,
    allocation: Omit<TeamAssignment, 'id' | 'initiativeId' | 'teamId'>
  ): Promise<TeamAssignment> {
    const response = await axios.post(`${API_BASE_URL}/initiatives/${initiativeId}/assign`, {
      teamId,
      ...allocation
    });
    return response.data;
  }

  async unassignInitiativeFromTeam(initiativeId: string, teamId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/initiatives/${initiativeId}/unassign/${teamId}`);
  }

  async bulkAssignInitiatives(assignmentData: BulkAssignmentRequest): Promise<TeamAssignment[]> {
    const response = await axios.post(`${API_BASE_URL}/initiatives/bulk-assign`, assignmentData);
    return response.data;
  }

  // Resource Planning and Analytics
  async getResourceAllocation(): Promise<ResourceAllocation[]> {
    const response = await axios.get(`${API_BASE_URL}/resources/allocation`);
    return response.data;
  }

  async getTeamResourceAllocation(teamId: string): Promise<ResourceAllocation> {
    const response = await axios.get(`${API_BASE_URL}/resources/allocation/${teamId}`);
    return response.data;
  }

  async detectResourceConflicts(): Promise<ResourceConflict[]> {
    const response = await axios.get(`${API_BASE_URL}/resources/conflicts`);
    return response.data;
  }

  async resolveResourceConflict(conflictId: string, resolution: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/resources/conflicts/${conflictId}/resolve`, {
      resolution
    });
  }

  // Team Performance Analytics
  async getTeamPerformanceMetrics(
    teamId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TeamPerformanceMetrics> {
    const response = await axios.get(`${API_BASE_URL}/teams/${teamId}/performance`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return response.data;
  }

  async getAllTeamsPerformance(
    startDate: Date,
    endDate: Date
  ): Promise<TeamPerformanceMetrics[]> {
    const response = await axios.get(`${API_BASE_URL}/teams/performance`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return response.data;
  }

  // Capacity Planning
  async getTeamCapacityForecast(
    teamId: string,
    forecastMonths: number = 6
  ): Promise<{
    teamId: string;
    forecast: Array<{
      month: string;
      availableCapacity: number;
      plannedCapacity: number;
      utilizationRate: number;
    }>;
  }> {
    const response = await axios.get(`${API_BASE_URL}/teams/${teamId}/capacity-forecast`, {
      params: { months: forecastMonths }
    });
    return response.data;
  }

  async optimizeResourceAllocation(
    initiatives: string[],
    constraints?: {
      preferredTeams?: string[];
      maxUtilization?: number;
      skillRequirements?: string[];
    }
  ): Promise<{
    recommendations: Array<{
      initiativeId: string;
      recommendedTeam: string;
      confidence: number;
      reasoning: string;
    }>;
    conflicts: ResourceConflict[];
  }> {
    const response = await axios.post(`${API_BASE_URL}/resources/optimize`, {
      initiatives,
      constraints
    });
    return response.data;
  }

  // Skills Management
  async getAvailableSkills(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/skills`);
    return response.data;
  }

  async getTeamsBySkill(skill: string): Promise<Team[]> {
    const response = await axios.get(`${API_BASE_URL}/teams/by-skill/${encodeURIComponent(skill)}`);
    return response.data;
  }

  async suggestTeamForInitiative(initiativeId: string): Promise<{
    suggestions: Array<{
      team: Team;
      matchScore: number;
      reasoning: string;
      availableCapacity: number;
    }>;
  }> {
    const response = await axios.get(`${API_BASE_URL}/initiatives/${initiativeId}/team-suggestions`);
    return response.data;
  }
}

export const teamManagementService = new TeamManagementService();
export default teamManagementService;
