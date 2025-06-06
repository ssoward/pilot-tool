import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { initiativeService } from '../services/api';
import { advancedAIAnalyticsService } from '../services/advancedAIAnalytics';
import teamManagementService from '../services/teamManagementService';
import roadmapService from '../services/roadmapService';
import type { Initiative } from '../types/Initiative';
import type {
  TeamCreateRequest,
  TeamUpdateRequest,
  TeamMemberCreateRequest,
  BulkAssignmentRequest
} from '../types/Team';
import type { RoadmapFilters } from '../services/roadmapService';

// Query Keys
export const queryKeys = {
  initiatives: ['initiatives'] as const,
  initiative: (id: string) => ['initiatives', id] as const,
  aiMetrics: (initiativeIds: string[]) => ['ai-metrics', initiativeIds] as const,
  advancedAnalytics: (initiativeIds: string[]) => ['advanced-analytics', initiativeIds] as const,
  teams: ['teams'] as const,
  team: (id: string) => ['teams', id] as const,
  teamMembers: (teamId: string) => ['team-members', teamId] as const,
  resourceAllocation: ['resource-allocation'] as const,
  resourceConflicts: ['resource-conflicts'] as const,
  teamPerformance: (teamId: string, startDate: Date, endDate: Date) => 
    ['team-performance', teamId, startDate.toISOString(), endDate.toISOString()] as const,
  roadmap: ['roadmap'] as const,
  roadmapItem: (itemId: string) => ['roadmap', itemId] as const,
  timelineAnalysis: (filters?: RoadmapFilters) => ['roadmap-analysis', filters] as const,
  teamRoadmap: (teamId: string, timeframe: 'quarter' | 'year') => 
    ['team-roadmap', teamId, timeframe] as const,
  capacityProjection: (startDate: Date, endDate: Date, teamIds?: string[]) => 
    ['capacity-projection', startDate.toISOString(), endDate.toISOString(), teamIds] as const,
};

// Initiatives Hooks
export const useInitiatives = () => {
  return useQuery({
    queryKey: queryKeys.initiatives,
    queryFn: () => initiativeService.getAllInitiatives(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInitiative = (id: string) => {
  return useQuery({
    queryKey: queryKeys.initiative(id),
    queryFn: () => initiativeService.getInitiativeById(id),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateInitiative = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt'>) =>
      initiativeService.createInitiative(initiative),
    onSuccess: () => {
      // Invalidate and refetch initiatives
      queryClient.invalidateQueries({ queryKey: queryKeys.initiatives });
    },
  });
};

export const useUpdateInitiative = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, initiative }: { id: string; initiative: Partial<Initiative> }) =>
      initiativeService.updateInitiative(id, initiative),
    onSuccess: (_, { id }) => {
      // Invalidate specific initiative and initiatives list
      queryClient.invalidateQueries({ queryKey: queryKeys.initiative(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.initiatives });
    },
  });
};

export const useDeleteInitiative = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => initiativeService.deleteInitiative(id),
    onSuccess: () => {
      // Invalidate initiatives list
      queryClient.invalidateQueries({ queryKey: queryKeys.initiatives });
    },
  });
};

// Advanced AI Analytics Hook
export const useAdvancedAIAnalytics = (initiatives: Initiative[]) => {
  const initiativeIds = initiatives.map(i => i.id).sort();
  
  return useQuery({
    queryKey: queryKeys.advancedAnalytics(initiativeIds),
    queryFn: () => advancedAIAnalyticsService.generateAdvancedAnalytics(initiatives),
    enabled: initiatives.length > 0,
    staleTime: 15 * 60 * 1000, // 15 minutes (AI analytics are expensive to compute)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2, // Reduce retries for expensive operations
  });
};

// Real-time Data Hook
export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();
  
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.initiatives });
  };
  
  // Simulate real-time updates (in production, this would connect to WebSocket)
  const startPolling = (intervalMs = 60000) => { // 1 minute
    const interval = setInterval(refreshData, intervalMs);
    return () => clearInterval(interval);
  };
  
  return { refreshData, startPolling };
};

// Performance Metrics Hook
export const usePerformanceMetrics = () => {
  const queryClient = useQueryClient();
  
  const getQueryMetrics = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    return {
      totalQueries: queries.length,
      loadingQueries: queries.filter(q => q.state.status === 'pending').length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      successQueries: queries.filter(q => q.state.status === 'success').length,
      cacheHitRatio: queries.length > 0 ? 
        queries.filter(q => q.state.dataUpdatedAt > 0).length / queries.length : 0,
    };
  }, [queryClient]);
  
  return { getQueryMetrics };
};

// Team Management Queries
export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamManagementService.getTeams,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ['teams', teamId],
    queryFn: () => teamManagementService.getTeam(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => teamManagementService.getTeamMembers(teamId),
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Team Management Mutations
export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamData: TeamCreateRequest) => teamManagementService.createTeam(teamData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, teamData }: { teamId: string; teamData: TeamUpdateRequest }) =>
      teamManagementService.updateTeam(teamId, teamData),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) => teamManagementService.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberData: TeamMemberCreateRequest) =>
      teamManagementService.addTeamMember(memberData),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] });
    },
  });
};

export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId }: { memberId: string; teamId: string }) =>
      teamManagementService.removeTeamMember(memberId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] });
    },
  });
};

// Resource Planning Queries
export const useResourceAllocation = () => {
  return useQuery({
    queryKey: ['resource-allocation'],
    queryFn: teamManagementService.getResourceAllocation,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useTeamResourceAllocation = (teamId: string) => {
  return useQuery({
    queryKey: ['resource-allocation', teamId],
    queryFn: () => teamManagementService.getTeamResourceAllocation(teamId),
    enabled: !!teamId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useResourceConflicts = () => {
  return useQuery({
    queryKey: ['resource-conflicts'],
    queryFn: teamManagementService.detectResourceConflicts,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useTeamPerformanceMetrics = (teamId: string, startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ['team-performance', teamId, startDate.toISOString(), endDate.toISOString()],
    queryFn: () => teamManagementService.getTeamPerformanceMetrics(teamId, startDate, endDate),
    enabled: !!teamId && !!startDate && !!endDate,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Initiative Assignment Mutations
export const useAssignInitiativeToTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      initiativeId, 
      teamId, 
      allocation 
    }: { 
      initiativeId: string; 
      teamId: string; 
      allocation: any;
    }) => teamManagementService.assignInitiativeToTeam(initiativeId, teamId, allocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['resource-allocation'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
};

export const useBulkAssignInitiatives = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignmentData: BulkAssignmentRequest) =>
      teamManagementService.bulkAssignInitiatives(assignmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['resource-allocation'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
};

// Roadmap Queries
export const useRoadmapItems = (filters?: RoadmapFilters) => {
  return useQuery({
    queryKey: ['roadmap', filters],
    queryFn: () => roadmapService.getRoadmapItems(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRoadmapItem = (itemId: string) => {
  return useQuery({
    queryKey: ['roadmap', itemId],
    queryFn: () => roadmapService.getRoadmapItem(itemId),
    enabled: !!itemId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useTimelineAnalysis = (filters?: RoadmapFilters) => {
  return useQuery({
    queryKey: ['roadmap-analysis', filters],
    queryFn: () => roadmapService.getTimelineAnalysis(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeamRoadmap = (teamId: string, timeframe: 'quarter' | 'year' = 'quarter') => {
  return useQuery({
    queryKey: ['team-roadmap', teamId, timeframe],
    queryFn: () => roadmapService.getTeamRoadmap(teamId, timeframe),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCapacityProjection = (startDate: Date, endDate: Date, teamIds?: string[]) => {
  return useQuery({
    queryKey: ['capacity-projection', startDate.toISOString(), endDate.toISOString(), teamIds],
    queryFn: () => roadmapService.getCapacityProjection(startDate, endDate, teamIds),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Roadmap Mutations
export const useUpdateRoadmapItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, updates }: { itemId: string; updates: any }) =>
      roadmapService.updateRoadmapItem(itemId, updates),
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap', itemId] });
    },
  });
};

export const useUpdateItemTimeline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      itemId, 
      startDate, 
      endDate, 
      validateResources = true 
    }: { 
      itemId: string; 
      startDate: Date; 
      endDate: Date; 
      validateResources?: boolean;
    }) => roadmapService.updateItemTimeline(itemId, startDate, endDate, validateResources),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['resource-allocation'] });
    },
  });
};

// Skills and Optimization Queries
export const useAvailableSkills = () => {
  return useQuery({
    queryKey: ['available-skills'],
    queryFn: teamManagementService.getAvailableSkills,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useTeamSuggestions = (initiativeId: string) => {
  return useQuery({
    queryKey: ['team-suggestions', initiativeId],
    queryFn: () => teamManagementService.suggestTeamForInitiative(initiativeId),
    enabled: !!initiativeId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTeamAssignments = () => {
  const queryClient = useQueryClient();
  
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['team-assignments'],
    queryFn: () => teamManagementService.getResourceAllocation().then(data => 
      data.flatMap(allocation => allocation.assignments)
    ),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const assignTeamMutation = useMutation({
    mutationFn: ({ initiativeId, teamId, allocation, startDate }: {
      initiativeId: string;
      teamId: string;
      allocation: number;
      startDate: Date;
    }) => teamManagementService.assignInitiativeToTeam(initiativeId, teamId, {
      allocatedCapacity: allocation,
      startDate,
      endDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      role: 'primary' as const
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['resource-allocation'] });
    },
  });

  const unassignTeamMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      // Since the backend expects initiativeId and teamId, we need to find the assignment first
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) throw new Error('Assignment not found');
      return teamManagementService.unassignInitiativeFromTeam(assignment.initiativeId, assignment.teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['resource-allocation'] });
    },
  });

  const updateAllocationMutation = useMutation({
    mutationFn: async (_params: { assignmentId: string; allocation: number }) => {
      // This would need to be implemented in the backend
      throw new Error('Update allocation not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['resource-allocation'] });
    },
  });

  return {
    data: assignments,
    isLoading,
    assignTeamMutation,
    unassignTeamMutation,
    updateAllocationMutation
  };
};
