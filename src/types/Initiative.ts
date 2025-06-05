export type InitiativeStatus = 'draft' | 'approved' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
export type InitiativePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Initiative {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: InitiativeStatus;
  priority: InitiativePriority;
  startDate?: Date;
  endDate?: Date;
  jiraKey?: string;
  jiraUrl?: string;
  businessValue?: string;
  dependencies?: string[];
  goals?: string[];
  createdAt?: Date;
  updatedAt?: Date;

  // Enhanced fields for team management and resource planning
  assignedTeams: string[];
  estimatedEffort: number;
  actualEffort?: number;
  requiredSkills: string[];
  milestones: Array<{
    id: string;
    name: string;
    date: Date;
    status: 'upcoming' | 'completed' | 'missed';
  }>;
  resourceAllocations: Array<{
    teamId: string;
    allocatedCapacity: number;
    role: 'primary' | 'supporting';
  }>;
}
