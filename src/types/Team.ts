export interface Team {
  teamId: number;
  teamName: string;
  teamDescription: string | null;
  jiraProjectId: number;
  jiraBoardId: number;
  teamBacklogLabel: string | null;
  teamNotificationSettings: string | null;
  empCount: number;
  orgUnitId: number;
  orgUnitName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  name: string;
  email: string;
  role: 'lead' | 'senior' | 'mid' | 'junior';
  capacity: number;
  currentWorkload: number;
  skills: string[];
  joinedAt: Date;
}

export interface TeamAssignment {
  id: string;
  initiativeId: string;
  teamId: string;
  allocatedCapacity: number;
  startDate: Date;
  endDate: Date;
  role: 'primary' | 'supporting';
}

export interface ResourceAllocation {
  teamId: string;
  teamName: string;
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  utilizationPercentage: number;
  assignments: TeamAssignment[];
}

export interface ResourceConflict {
  id: string;
  type: 'overallocation' | 'skill_gap' | 'timeline_conflict';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affectedTeams: string[];
  affectedInitiatives: string[];
  suggestedResolution: string;
  detectedAt: Date;
}

export interface TeamPerformanceMetrics {
  teamId: string;
  teamName: string;
  completedInitiatives: number;
  averageDeliveryTime: number;
  velocityTrend: number;
  qualityScore: number;
  memberSatisfaction: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface RoadmapItem {
  id: string;
  initiativeId: string;
  initiativeName: string;
  teamIds: string[];
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
  milestones: RoadmapMilestone[];
  estimatedEffort: number;
  actualEffort?: number;
}

export interface RoadmapMilestone {
  id: string;
  name: string;
  date: Date;
  status: 'upcoming' | 'completed' | 'missed';
  description?: string;
}

export interface TeamCreateRequest {
  teamId?: number;
  teamName: string;
  teamDescription?: string | null;
  jiraProjectId?: number;
  jiraBoardId?: number;
  teamBacklogLabel?: string | null;
  teamNotificationSettings?: string | null;
  empCount?: number;
  orgUnitId?: number;
  orgUnitName?: string;
}

export interface TeamUpdateRequest {
  teamId?: number; // Optional, as it's part of the route params typically
  teamName?: string;
  teamDescription?: string | null;
  jiraProjectId?: number;
  jiraBoardId?: number;
  teamBacklogLabel?: string | null;
  teamNotificationSettings?: string | null;
  orgUnitId?: number;
  // empCount is likely managed by assignments, not direct update
}

/**
 * Represents the structure for a team member when creating or updating.
 * Fields like id, teamId, and userId are typically managed by the system
 * and not provided in requests.
 */
export interface TeamMemberCreateRequest {
  teamId: string;
  userId: string;
  name: string;
  email: string;
  role: 'lead' | 'senior' | 'mid' | 'junior';
  capacity: number;
  skills: string[];
}

export interface BulkAssignmentRequest {
  initiativeIds: string[];
  teamId: string;
  allocatedCapacity: number;
  startDate: Date;
  endDate: Date;
  role: 'primary' | 'supporting';
}
