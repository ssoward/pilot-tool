export type InitiativeStatus = 'Draft' | 'Proposal' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
export type InitiativePriority = 'low' | 'medium' | 'high' | 'critical';
export type InitiativeType = 'adaptive' | 'initiative';

export interface WorkingGroup {
  label: string;
  value: string;
  __typename?: string;
}

export interface OpportunityScore {
  impact: number;
  effort: number;
  calculated: number | null;
  __typename?: string;
}

export interface Hypothesis {
  businessOutcome: string;
  feature: string;
  goal: string;
  peopleSegment: string;
  __typename?: string;
}

export interface Initiative {
  id: string;
  productGroupName: string;
  productGroupId: string;
  summary: string;
  teamName: string;
  teamId: string;
  type: InitiativeType;
  stage: string;
  status: InitiativeStatus;
  score: number;
  workingGroup?: WorkingGroup | null;
  opportunityScore: OpportunityScore;
  hypothesis: Hypothesis;
  businessValue: string;
  jiraProjectKey?: string;
  jiraProjectId?: string;
  mondayBoardId?: string;
  contributingTeams: string[];
  percentComplete: number;
  onTrackPercent: number;
  __typename?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Legacy fields for backward compatibility
  name?: string;
  description?: string;
  owner?: string;
  priority?: InitiativePriority;
  startDate?: Date;
  endDate?: Date;
  jiraKey?: string;
  jiraUrl?: string;
  dependencies?: string[];
  goals?: string[];
  assignedTeams?: string[];
  estimatedEffort?: number;
  actualEffort?: number;
  requiredSkills?: string[];
  milestones?: Array<{
    id: string;
    name: string;
    date: Date;
    status: 'upcoming' | 'completed' | 'missed';
  }>;
  resourceAllocations?: Array<{
    teamId: string;
    allocatedCapacity: number;
    role: 'primary' | 'supporting';
  }>;
}
