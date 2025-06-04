export type InitiativeStatus = 'draft' | 'approved' | 'in_progress' | 'completed' | 'on_hold';
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
}
